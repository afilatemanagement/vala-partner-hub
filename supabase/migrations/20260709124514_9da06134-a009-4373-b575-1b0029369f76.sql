
-- ============ Shared updated_at trigger ============
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Helper macro-ish: we'll inline grants + rls + policies + triggers per table.

-- ============ APPLICATIONS ============
CREATE TABLE public.affiliate_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT,
  category TEXT,
  website TEXT,
  audience_size INT,
  motivation TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending|reviewing|approved|rejected
  risk_score INT NOT NULL DEFAULT 0,
  kyc_status TEXT NOT NULL DEFAULT 'not_started', -- not_started|submitted|verified|failed
  agreement_signed BOOLEAN NOT NULL DEFAULT false,
  reviewer_id UUID,
  review_notes TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  decided_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.affiliate_applications TO authenticated;
GRANT ALL ON public.affiliate_applications TO service_role;
ALTER TABLE public.affiliate_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "boss manages applications" ON public.affiliate_applications FOR ALL TO authenticated USING (public.is_boss(auth.uid())) WITH CHECK (public.is_boss(auth.uid()));
CREATE TRIGGER trg_apps_updated BEFORE UPDATE ON public.affiliate_applications FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE INDEX idx_apps_status ON public.affiliate_applications(status);
CREATE INDEX idx_apps_submitted ON public.affiliate_applications(submitted_at DESC);

-- ============ KYC DOCUMENTS ============
CREATE TABLE public.kyc_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE CASCADE,
  application_id UUID REFERENCES public.affiliate_applications(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL, -- passport|id_card|address_proof|tax|business
  file_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending|verified|rejected
  reviewer_id UUID,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.kyc_documents TO authenticated;
GRANT ALL ON public.kyc_documents TO service_role;
ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "boss manages kyc" ON public.kyc_documents FOR ALL TO authenticated USING (public.is_boss(auth.uid())) WITH CHECK (public.is_boss(auth.uid()));
CREATE TRIGGER trg_kyc_updated BEFORE UPDATE ON public.kyc_documents FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============ AFFILIATE DOCUMENTS (agreements/nda/certs/invoices) ============
CREATE TABLE public.affiliate_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL, -- agreement|nda|invoice|certificate|tax|other
  title TEXT NOT NULL,
  file_url TEXT,
  version INT NOT NULL DEFAULT 1,
  signed BOOLEAN NOT NULL DEFAULT false,
  signed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.affiliate_documents TO authenticated;
GRANT ALL ON public.affiliate_documents TO service_role;
ALTER TABLE public.affiliate_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "boss manages affiliate docs" ON public.affiliate_documents FOR ALL TO authenticated USING (public.is_boss(auth.uid())) WITH CHECK (public.is_boss(auth.uid()));
CREATE TRIGGER trg_afdocs_updated BEFORE UPDATE ON public.affiliate_documents FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============ COMPLIANCE ALERTS ============
CREATE TABLE public.compliance_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE CASCADE,
  severity TEXT NOT NULL DEFAULT 'low', -- low|medium|high|critical
  category TEXT NOT NULL, -- fraud|kyc|policy|tax|geo
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open', -- open|investigating|resolved|dismissed
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.compliance_alerts TO authenticated;
GRANT ALL ON public.compliance_alerts TO service_role;
ALTER TABLE public.compliance_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "boss manages alerts" ON public.compliance_alerts FOR ALL TO authenticated USING (public.is_boss(auth.uid())) WITH CHECK (public.is_boss(auth.uid()));
CREATE TRIGGER trg_alerts_updated BEFORE UPDATE ON public.compliance_alerts FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE INDEX idx_alerts_status ON public.compliance_alerts(status, severity);

-- ============ MARKETING ASSETS ============
CREATE TABLE public.marketing_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  kind TEXT NOT NULL, -- banner|creative|email_template|landing_page|video
  format TEXT,
  file_url TEXT,
  preview_url TEXT,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  downloads INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marketing_assets TO authenticated;
GRANT ALL ON public.marketing_assets TO service_role;
ALTER TABLE public.marketing_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "boss manages marketing assets" ON public.marketing_assets FOR ALL TO authenticated USING (public.is_boss(auth.uid())) WITH CHECK (public.is_boss(auth.uid()));
CREATE TRIGGER trg_massets_updated BEFORE UPDATE ON public.marketing_assets FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============ MARKETING / COMMUNICATION BROADCASTS ============
CREATE TABLE public.marketing_broadcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel TEXT NOT NULL, -- email|sms|whatsapp|push
  subject TEXT,
  body TEXT NOT NULL,
  audience TEXT NOT NULL DEFAULT 'all', -- all|verified|pending|segment
  segment JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft', -- draft|scheduled|sending|sent|failed
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  recipients_count INT NOT NULL DEFAULT 0,
  delivered_count INT NOT NULL DEFAULT 0,
  opened_count INT NOT NULL DEFAULT 0,
  clicked_count INT NOT NULL DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marketing_broadcasts TO authenticated;
GRANT ALL ON public.marketing_broadcasts TO service_role;
ALTER TABLE public.marketing_broadcasts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "boss manages broadcasts" ON public.marketing_broadcasts FOR ALL TO authenticated USING (public.is_boss(auth.uid())) WITH CHECK (public.is_boss(auth.uid()));
CREATE TRIGGER trg_bcast_updated BEFORE UPDATE ON public.marketing_broadcasts FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE INDEX idx_bcast_status ON public.marketing_broadcasts(status, scheduled_at DESC);

-- ============ ANNOUNCEMENTS ============
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  audience TEXT NOT NULL DEFAULT 'all',
  pinned BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.announcements TO authenticated;
GRANT ALL ON public.announcements TO service_role;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "boss manages announcements" ON public.announcements FOR ALL TO authenticated USING (public.is_boss(auth.uid())) WITH CHECK (public.is_boss(auth.uid()));
CREATE TRIGGER trg_ann_updated BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============ MEETINGS ============
CREATE TABLE public.meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE SET NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 30,
  join_url TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled', -- scheduled|completed|cancelled|no_show
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.meetings TO authenticated;
GRANT ALL ON public.meetings TO service_role;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "boss manages meetings" ON public.meetings FOR ALL TO authenticated USING (public.is_boss(auth.uid())) WITH CHECK (public.is_boss(auth.uid()));
CREATE TRIGGER trg_meet_updated BEFORE UPDATE ON public.meetings FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============ COMMUNICATION THREADS ============
CREATE TABLE public.communication_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE CASCADE,
  channel TEXT NOT NULL DEFAULT 'inbox',
  subject TEXT,
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  unread_count INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.communication_threads TO authenticated;
GRANT ALL ON public.communication_threads TO service_role;
ALTER TABLE public.communication_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "boss manages threads" ON public.communication_threads FOR ALL TO authenticated USING (public.is_boss(auth.uid())) WITH CHECK (public.is_boss(auth.uid()));
CREATE TRIGGER trg_thr_updated BEFORE UPDATE ON public.communication_threads FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE TABLE public.communication_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES public.communication_threads(id) ON DELETE CASCADE,
  sender TEXT NOT NULL, -- operator|affiliate|system
  sender_id UUID,
  body TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.communication_messages TO authenticated;
GRANT ALL ON public.communication_messages TO service_role;
ALTER TABLE public.communication_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "boss manages messages" ON public.communication_messages FOR ALL TO authenticated USING (public.is_boss(auth.uid())) WITH CHECK (public.is_boss(auth.uid()));

-- ============ SUPPORT ============
CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_no TEXT NOT NULL UNIQUE DEFAULT ('TKT-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)),
  affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'normal', -- low|normal|high|urgent
  status TEXT NOT NULL DEFAULT 'open', -- open|pending|resolved|closed
  channel TEXT NOT NULL DEFAULT 'email', -- email|chat|whatsapp|call
  assigned_to UUID,
  sla_due_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.support_tickets TO authenticated;
GRANT ALL ON public.support_tickets TO service_role;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "boss manages tickets" ON public.support_tickets FOR ALL TO authenticated USING (public.is_boss(auth.uid())) WITH CHECK (public.is_boss(auth.uid()));
CREATE TRIGGER trg_tkt_updated BEFORE UPDATE ON public.support_tickets FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE INDEX idx_tkt_status ON public.support_tickets(status, priority);

CREATE TABLE public.support_ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  sender TEXT NOT NULL,
  sender_id UUID,
  body TEXT NOT NULL,
  internal BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.support_ticket_messages TO authenticated;
GRANT ALL ON public.support_ticket_messages TO service_role;
ALTER TABLE public.support_ticket_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "boss manages ticket messages" ON public.support_ticket_messages FOR ALL TO authenticated USING (public.is_boss(auth.uid())) WITH CHECK (public.is_boss(auth.uid()));

-- ============ WORKFLOW / SETTINGS ============
CREATE TABLE public.workflow_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  trigger TEXT NOT NULL,
  conditions JSONB NOT NULL DEFAULT '{}'::jsonb,
  actions JSONB NOT NULL DEFAULT '[]'::jsonb,
  enabled BOOLEAN NOT NULL DEFAULT true,
  last_run_at TIMESTAMPTZ,
  run_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workflow_rules TO authenticated;
GRANT ALL ON public.workflow_rules TO service_role;
ALTER TABLE public.workflow_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "boss manages workflow" ON public.workflow_rules FOR ALL TO authenticated USING (public.is_boss(auth.uid())) WITH CHECK (public.is_boss(auth.uid()));
CREATE TRIGGER trg_wf_updated BEFORE UPDATE ON public.workflow_rules FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE TABLE public.notification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  channel TEXT NOT NULL, -- email|sms|whatsapp|push|inapp
  subject TEXT,
  body TEXT NOT NULL,
  variables JSONB DEFAULT '[]'::jsonb,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notification_templates TO authenticated;
GRANT ALL ON public.notification_templates TO service_role;
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "boss manages templates" ON public.notification_templates FOR ALL TO authenticated USING (public.is_boss(auth.uid())) WITH CHECK (public.is_boss(auth.uid()));
CREATE TRIGGER trg_tmpl_updated BEFORE UPDATE ON public.notification_templates FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE TABLE public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  prefix TEXT NOT NULL,
  hashed_key TEXT NOT NULL,
  scopes TEXT[] NOT NULL DEFAULT '{}',
  last_used_at TIMESTAMPTZ,
  revoked BOOLEAN NOT NULL DEFAULT false,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.api_keys TO authenticated;
GRANT ALL ON public.api_keys TO service_role;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "boss manages api keys" ON public.api_keys FOR ALL TO authenticated USING (public.is_boss(auth.uid())) WITH CHECK (public.is_boss(auth.uid()));
CREATE TRIGGER trg_apik_updated BEFORE UPDATE ON public.api_keys FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE TABLE public.integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'disconnected', -- connected|disconnected|error
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.integrations TO authenticated;
GRANT ALL ON public.integrations TO service_role;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "boss manages integrations" ON public.integrations FOR ALL TO authenticated USING (public.is_boss(auth.uid())) WITH CHECK (public.is_boss(auth.uid()));
CREATE TRIGGER trg_intg_updated BEFORE UPDATE ON public.integrations FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============ BANNERS ============
CREATE TABLE public.banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT,
  link_url TEXT,
  placement TEXT NOT NULL DEFAULT 'homepage',
  active BOOLEAN NOT NULL DEFAULT true,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  clicks INT NOT NULL DEFAULT 0,
  impressions INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.banners TO authenticated;
GRANT ALL ON public.banners TO service_role;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "boss manages banners" ON public.banners FOR ALL TO authenticated USING (public.is_boss(auth.uid())) WITH CHECK (public.is_boss(auth.uid()));
CREATE TRIGGER trg_bnr_updated BEFORE UPDATE ON public.banners FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============ PERFORMANCE SNAPSHOTS ============
CREATE TABLE public.performance_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE CASCADE,
  period DATE NOT NULL,
  clicks INT NOT NULL DEFAULT 0,
  visitors INT NOT NULL DEFAULT 0,
  conversions INT NOT NULL DEFAULT 0,
  sales INT NOT NULL DEFAULT 0,
  revenue_cents BIGINT NOT NULL DEFAULT 0,
  commission_cents BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(affiliate_id, period)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.performance_snapshots TO authenticated;
GRANT ALL ON public.performance_snapshots TO service_role;
ALTER TABLE public.performance_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "boss reads perf" ON public.performance_snapshots FOR ALL TO authenticated USING (public.is_boss(auth.uid())) WITH CHECK (public.is_boss(auth.uid()));
CREATE INDEX idx_perf_period ON public.performance_snapshots(period DESC);

-- ============ REALTIME ============
ALTER PUBLICATION supabase_realtime ADD TABLE public.affiliate_applications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.kyc_documents;
ALTER PUBLICATION supabase_realtime ADD TABLE public.affiliate_documents;
ALTER PUBLICATION supabase_realtime ADD TABLE public.compliance_alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.marketing_assets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.marketing_broadcasts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;
ALTER PUBLICATION supabase_realtime ADD TABLE public.meetings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.communication_threads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.communication_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_tickets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_ticket_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.workflow_rules;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notification_templates;
ALTER PUBLICATION supabase_realtime ADD TABLE public.integrations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.banners;
