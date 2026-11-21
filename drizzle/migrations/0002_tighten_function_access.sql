REVOKE ALL ON FUNCTION public.create_manager_profile() FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.create_organization(text) FROM PUBLIC,anon; GRANT EXECUTE ON FUNCTION public.create_organization(text) TO authenticated;
REVOKE ALL ON FUNCTION public.is_org_member(uuid) FROM PUBLIC,anon; GRANT EXECUTE ON FUNCTION public.is_org_member(uuid) TO authenticated;
CREATE INDEX events_station_org_idx ON public.station_events(station_id,organization_id);
CREATE INDEX actions_station_org_idx ON public.manager_actions(station_id,organization_id);