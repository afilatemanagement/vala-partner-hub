
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_boss(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.affiliate_dashboard_stats() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.affiliate_top(int) FROM PUBLIC, anon;
