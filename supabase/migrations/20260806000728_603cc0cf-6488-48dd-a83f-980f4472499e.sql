REVOKE EXECUTE ON FUNCTION public.affiliate_dashboard_stats() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.affiliate_top(integer) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.universal_search(text, text[], integer, integer) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.get_my_permissions() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.has_permission(uuid, text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.is_boss(uuid) FROM anon, public;

GRANT EXECUTE ON FUNCTION public.affiliate_dashboard_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.affiliate_top(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.universal_search(text, text[], integer, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_permissions() TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_permission(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_boss(uuid) TO authenticated;

CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON public.activity_log (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_log_action_trgm ON public.activity_log USING gin (action public.gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_activity_log_entity ON public.activity_log (entity);