
-- ============ Roles ============
CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'affiliate');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "admins read all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Helper: admin or manager can view boss-panel data
CREATE OR REPLACE FUNCTION public.is_boss(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT public.has_role(_user_id, 'admin') OR public.has_role(_user_id, 'manager') $$;

-- ============ Affiliates ============
CREATE TABLE public.affiliates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  code text NOT NULL UNIQUE,
  display_name text NOT NULL,
  email text,
  country text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','verified','suspended','terminated')),
  kyc_status text NOT NULL DEFAULT 'unstarted' CHECK (kyc_status IN ('unstarted','in_review','approved','rejected')),
  health_score int NOT NULL DEFAULT 0,
  risk_score int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.affiliates TO authenticated;
GRANT ALL ON public.affiliates TO service_role;
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "boss manage affiliates" ON public.affiliates FOR ALL TO authenticated
  USING (public.is_boss(auth.uid())) WITH CHECK (public.is_boss(auth.uid()));
CREATE POLICY "affiliate reads self" ON public.affiliates FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ============ Campaigns ============
CREATE TABLE public.campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','active','paused','ended')),
  budget_cents bigint NOT NULL DEFAULT 0,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaigns TO authenticated;
GRANT ALL ON public.campaigns TO service_role;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "boss manage campaigns" ON public.campaigns FOR ALL TO authenticated
  USING (public.is_boss(auth.uid())) WITH CHECK (public.is_boss(auth.uid()));

-- ============ Affiliate Links ============
CREATE TABLE public.affiliate_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id uuid NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  campaign_id uuid REFERENCES public.campaigns(id) ON DELETE SET NULL,
  slug text NOT NULL UNIQUE,
  destination_url text NOT NULL,
  clicks_count bigint NOT NULL DEFAULT 0,
  conversions_count bigint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.affiliate_links TO authenticated;
GRANT ALL ON public.affiliate_links TO service_role;
ALTER TABLE public.affiliate_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "boss manage links" ON public.affiliate_links FOR ALL TO authenticated
  USING (public.is_boss(auth.uid())) WITH CHECK (public.is_boss(auth.uid()));

-- ============ Referral Codes ============
CREATE TABLE public.referral_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id uuid REFERENCES public.affiliates(id) ON DELETE CASCADE,
  campaign_id uuid REFERENCES public.campaigns(id) ON DELETE SET NULL,
  code text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','expired','disabled')),
  uses_count bigint NOT NULL DEFAULT 0,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.referral_codes TO authenticated;
GRANT ALL ON public.referral_codes TO service_role;
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "boss manage codes" ON public.referral_codes FOR ALL TO authenticated
  USING (public.is_boss(auth.uid())) WITH CHECK (public.is_boss(auth.uid()));

-- ============ Orders / Sales ============
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id uuid REFERENCES public.affiliates(id) ON DELETE SET NULL,
  customer_email text,
  amount_cents bigint NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  status text NOT NULL DEFAULT 'completed' CHECK (status IN ('pending','completed','refunded','cancelled')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "boss manage orders" ON public.orders FOR ALL TO authenticated
  USING (public.is_boss(auth.uid())) WITH CHECK (public.is_boss(auth.uid()));

-- ============ Commissions ============
CREATE TABLE public.commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id uuid NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  amount_cents bigint NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','paid','rejected')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.commissions TO authenticated;
GRANT ALL ON public.commissions TO service_role;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "boss manage commissions" ON public.commissions FOR ALL TO authenticated
  USING (public.is_boss(auth.uid())) WITH CHECK (public.is_boss(auth.uid()));

-- ============ Wallets & Payouts ============
CREATE TABLE public.wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id uuid NOT NULL UNIQUE REFERENCES public.affiliates(id) ON DELETE CASCADE,
  balance_cents bigint NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wallets TO authenticated;
GRANT ALL ON public.wallets TO service_role;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "boss manage wallets" ON public.wallets FOR ALL TO authenticated
  USING (public.is_boss(auth.uid())) WITH CHECK (public.is_boss(auth.uid()));

CREATE TABLE public.payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id uuid NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  amount_cents bigint NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','paid','failed','cancelled')),
  method text,
  requested_at timestamptz NOT NULL DEFAULT now(),
  settled_at timestamptz
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payouts TO authenticated;
GRANT ALL ON public.payouts TO service_role;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "boss manage payouts" ON public.payouts FOR ALL TO authenticated
  USING (public.is_boss(auth.uid())) WITH CHECK (public.is_boss(auth.uid()));

-- ============ Leads / Customers ============
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id uuid REFERENCES public.affiliates(id) ON DELETE SET NULL,
  email text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "boss manage leads" ON public.leads FOR ALL TO authenticated
  USING (public.is_boss(auth.uid())) WITH CHECK (public.is_boss(auth.uid()));

CREATE TABLE public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id uuid REFERENCES public.affiliates(id) ON DELETE SET NULL,
  email text,
  first_order_at timestamptz DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customers TO authenticated;
GRANT ALL ON public.customers TO service_role;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "boss manage customers" ON public.customers FOR ALL TO authenticated
  USING (public.is_boss(auth.uid())) WITH CHECK (public.is_boss(auth.uid()));

-- ============ Activity Log ============
CREATE TABLE public.activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  affiliate_id uuid REFERENCES public.affiliates(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity text,
  entity_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX activity_log_created_at_idx ON public.activity_log (created_at DESC);
GRANT SELECT, INSERT ON public.activity_log TO authenticated;
GRANT ALL ON public.activity_log TO service_role;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "boss read activity" ON public.activity_log FOR SELECT TO authenticated USING (public.is_boss(auth.uid()));
CREATE POLICY "boss insert activity" ON public.activity_log FOR INSERT TO authenticated WITH CHECK (public.is_boss(auth.uid()));

-- ============ Dashboard stats RPC ============
CREATE OR REPLACE FUNCTION public.affiliate_dashboard_stats()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  since timestamptz := now() - interval '30 days';
  result jsonb;
BEGIN
  IF NOT public.is_boss(auth.uid()) THEN
    RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501';
  END IF;
  SELECT jsonb_build_object(
    'affiliates_total', (SELECT count(*) FROM public.affiliates),
    'affiliates_verified', (SELECT count(*) FROM public.affiliates WHERE status = 'verified'),
    'affiliates_pending', (SELECT count(*) FROM public.affiliates WHERE status = 'pending'),
    'affiliates_suspended', (SELECT count(*) FROM public.affiliates WHERE status = 'suspended'),
    'countries', (SELECT count(DISTINCT country) FROM public.affiliates WHERE country IS NOT NULL),
    'links_total', (SELECT count(*) FROM public.affiliate_links),
    'campaigns_active', (SELECT count(*) FROM public.campaigns WHERE status = 'active'),
    'leads_30d', (SELECT count(*) FROM public.leads WHERE created_at >= since),
    'customers_30d', (SELECT count(*) FROM public.customers WHERE created_at >= since),
    'sales_30d', (SELECT count(*) FROM public.orders WHERE status = 'completed' AND created_at >= since),
    'revenue_cents_30d', (SELECT COALESCE(sum(amount_cents),0) FROM public.orders WHERE status = 'completed' AND created_at >= since),
    'commission_approved_cents', (SELECT COALESCE(sum(amount_cents),0) FROM public.commissions WHERE status IN ('approved','paid')),
    'wallet_balance_cents', (SELECT COALESCE(sum(balance_cents),0) FROM public.wallets),
    'payouts_pending_cents', (SELECT COALESCE(sum(amount_cents),0) FROM public.payouts WHERE status IN ('pending','processing'))
  ) INTO result;
  RETURN result;
END; $$;
GRANT EXECUTE ON FUNCTION public.affiliate_dashboard_stats() TO authenticated;

-- ============ Top Affiliates RPC ============
CREATE OR REPLACE FUNCTION public.affiliate_top(_limit int DEFAULT 5)
RETURNS TABLE(
  id uuid, display_name text, country text, status text,
  revenue_cents bigint, commission_cents bigint, conversions bigint
) LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT a.id, a.display_name, a.country, a.status,
    COALESCE((SELECT sum(o.amount_cents) FROM public.orders o WHERE o.affiliate_id = a.id AND o.status='completed'),0)::bigint AS revenue_cents,
    COALESCE((SELECT sum(c.amount_cents) FROM public.commissions c WHERE c.affiliate_id = a.id AND c.status IN ('approved','paid')),0)::bigint AS commission_cents,
    COALESCE((SELECT sum(l.conversions_count) FROM public.affiliate_links l WHERE l.affiliate_id = a.id),0)::bigint AS conversions
  FROM public.affiliates a
  WHERE public.is_boss(auth.uid())
  ORDER BY revenue_cents DESC NULLS LAST
  LIMIT GREATEST(_limit, 1);
$$;
GRANT EXECUTE ON FUNCTION public.affiliate_top(int) TO authenticated;
