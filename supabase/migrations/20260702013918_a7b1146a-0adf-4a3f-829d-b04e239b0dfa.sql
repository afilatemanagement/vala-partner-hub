
-- 1. Trigram indexes for fast search at 1M+ scale
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_affiliates_display_trgm ON public.affiliates USING gin (display_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_affiliates_email_trgm ON public.affiliates USING gin (email gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_affiliates_status ON public.affiliates (status);
CREATE INDEX IF NOT EXISTS idx_affiliates_country ON public.affiliates (country);
CREATE INDEX IF NOT EXISTS idx_affiliates_created ON public.affiliates (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_campaigns_name_trgm ON public.campaigns USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_links_slug_trgm ON public.affiliate_links USING gin (slug gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_codes_code_trgm ON public.referral_codes USING gin (code gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_customers_email_trgm ON public.customers USING gin (email gin_trgm_ops);

-- 2. Permission matrix
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role app_role NOT NULL,
  permission text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (role, permission)
);

GRANT SELECT ON public.role_permissions TO authenticated;
GRANT ALL ON public.role_permissions TO service_role;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "role_permissions readable by boss"
  ON public.role_permissions FOR SELECT
  TO authenticated
  USING (public.is_boss(auth.uid()));

-- Seed default permission matrix (idempotent)
INSERT INTO public.role_permissions (role, permission) VALUES
  ('admin', 'affiliates.read'), ('admin', 'affiliates.write'), ('admin', 'affiliates.approve'), ('admin', 'affiliates.suspend'), ('admin', 'affiliates.terminate'),
  ('admin', 'campaigns.read'), ('admin', 'campaigns.write'),
  ('admin', 'commissions.read'), ('admin', 'commissions.write'), ('admin', 'commissions.approve'),
  ('admin', 'payouts.read'), ('admin', 'payouts.write'), ('admin', 'payouts.issue'),
  ('admin', 'wallet.read'), ('admin', 'wallet.write'),
  ('admin', 'bulk.execute'), ('admin', 'import.execute'), ('admin', 'export.execute'),
  ('admin', 'messaging.send'), ('admin', 'settings.write'), ('admin', 'roles.assign'),
  ('manager', 'affiliates.read'), ('manager', 'affiliates.write'), ('manager', 'affiliates.approve'), ('manager', 'affiliates.suspend'),
  ('manager', 'campaigns.read'), ('manager', 'campaigns.write'),
  ('manager', 'commissions.read'), ('manager', 'commissions.approve'),
  ('manager', 'payouts.read'), ('manager', 'payouts.issue'),
  ('manager', 'wallet.read'),
  ('manager', 'bulk.execute'), ('manager', 'import.execute'), ('manager', 'export.execute'),
  ('manager', 'messaging.send'),
  ('affiliate', 'affiliates.read'),
  ('affiliate', 'commissions.read'),
  ('affiliate', 'payouts.read'),
  ('affiliate', 'wallet.read')
ON CONFLICT DO NOTHING;

-- 3. Permission helper
CREATE OR REPLACE FUNCTION public.has_permission(_user_id uuid, _permission text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON rp.role = ur.role
    WHERE ur.user_id = _user_id AND rp.permission = _permission
  );
$$;

CREATE OR REPLACE FUNCTION public.get_my_permissions()
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _roles text[];
  _perms text[];
BEGIN
  IF _uid IS NULL THEN
    RETURN jsonb_build_object('roles', '[]'::jsonb, 'permissions', '[]'::jsonb, 'is_boss', false);
  END IF;
  SELECT COALESCE(array_agg(DISTINCT role::text), '{}') INTO _roles FROM public.user_roles WHERE user_id = _uid;
  SELECT COALESCE(array_agg(DISTINCT rp.permission), '{}') INTO _perms
    FROM public.user_roles ur JOIN public.role_permissions rp ON rp.role = ur.role
    WHERE ur.user_id = _uid;
  RETURN jsonb_build_object(
    'roles', to_jsonb(_roles),
    'permissions', to_jsonb(_perms),
    'is_boss', public.is_boss(_uid)
  );
END; $$;

-- 4. Universal indexed search RPC
CREATE OR REPLACE FUNCTION public.universal_search(
  _q text,
  _entity_types text[] DEFAULT NULL,
  _limit integer DEFAULT 25,
  _offset integer DEFAULT 0
)
RETURNS TABLE (
  entity_type text,
  entity_id uuid,
  title text,
  subtitle text,
  status text,
  route text,
  score real,
  total_count bigint
)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  _qn text := lower(coalesce(_q, ''));
  _tot bigint;
BEGIN
  IF NOT public.is_boss(auth.uid()) THEN
    RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501';
  END IF;
  IF length(_qn) < 1 THEN RETURN; END IF;

  RETURN QUERY
  WITH matches AS (
    SELECT 'affiliate'::text AS entity_type, a.id AS entity_id,
      a.display_name AS title, a.email AS subtitle, a.status::text AS status,
      '/affiliate-manager/affiliates'::text AS route,
      GREATEST(similarity(lower(a.display_name), _qn), similarity(lower(coalesce(a.email,'')), _qn)) AS score
    FROM public.affiliates a
    WHERE (_entity_types IS NULL OR 'affiliate' = ANY(_entity_types))
      AND (a.display_name ILIKE '%'||_q||'%' OR a.email ILIKE '%'||_q||'%')
    UNION ALL
    SELECT 'campaign', c.id, c.name, c.status::text, c.status::text, '/affiliate-manager/campaigns',
      similarity(lower(c.name), _qn)
    FROM public.campaigns c
    WHERE (_entity_types IS NULL OR 'campaign' = ANY(_entity_types))
      AND c.name ILIKE '%'||_q||'%'
    UNION ALL
    SELECT 'link', l.id, l.slug, l.destination_url, NULL, '/affiliate-manager/affiliate-links',
      similarity(lower(l.slug), _qn)
    FROM public.affiliate_links l
    WHERE (_entity_types IS NULL OR 'link' = ANY(_entity_types))
      AND l.slug ILIKE '%'||_q||'%'
    UNION ALL
    SELECT 'code', rc.id, rc.code, rc.status::text, rc.status::text, '/affiliate-manager/referral-codes',
      similarity(lower(rc.code), _qn)
    FROM public.referral_codes rc
    WHERE (_entity_types IS NULL OR 'code' = ANY(_entity_types))
      AND rc.code ILIKE '%'||_q||'%'
    UNION ALL
    SELECT 'customer', cu.id, coalesce(cu.email,'(no email)'), cu.email, NULL, '/affiliate-manager/customers',
      similarity(lower(coalesce(cu.email,'')), _qn)
    FROM public.customers cu
    WHERE (_entity_types IS NULL OR 'customer' = ANY(_entity_types))
      AND cu.email ILIKE '%'||_q||'%'
  )
  SELECT m.entity_type, m.entity_id, m.title, m.subtitle, m.status, m.route, m.score,
    count(*) OVER () AS total_count
  FROM matches m
  ORDER BY m.score DESC NULLS LAST, m.title
  LIMIT GREATEST(_limit, 1) OFFSET GREATEST(_offset, 0);
END; $$;

-- 5. Realtime for live cross-workspace sync
ALTER TABLE public.affiliates REPLICA IDENTITY FULL;
ALTER TABLE public.commissions REPLICA IDENTITY FULL;
ALTER TABLE public.wallets REPLICA IDENTITY FULL;
ALTER TABLE public.payouts REPLICA IDENTITY FULL;
ALTER TABLE public.activity_log REPLICA IDENTITY FULL;

DO $$ BEGIN
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.affiliates; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.commissions; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.wallets; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.payouts; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_log; EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;
