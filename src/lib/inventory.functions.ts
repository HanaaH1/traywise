import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
const uuid=z.string().uuid();
export const stationSchema=z.object({id:uuid.optional(),organization_id:uuid,name:z.string().trim().min(1).max(100),food:z.string().trim().min(1).max(100),capacity_kg:z.number().positive().max(10000),closing_time:z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/)});
export const eventSchema=z.object({organization_id:uuid,station_id:uuid,kind:z.enum(['reading','refill']),weight_kg:z.number().min(0).max(10000),recorded_at:z.string().datetime()}).refine(v=>v.kind==='reading'||v.weight_kg>0,'Refill must be greater than zero').refine(v=>Date.parse(v.recorded_at)<=Date.now()+60000,'Readings cannot be in the future');
export const actionSchema=z.object({organization_id:uuid,station_id:uuid,decision:z.string().trim().min(1).max(100),note:z.string().trim().min(1).max(2000)});
export const getInventory=createServerFn({method:'GET'}).middleware([requireSupabaseAuth]).handler(async({context})=>{
 const db=context.supabase;
 const orgs=await db.from('organizations').select('id,name').order('created_at'); if(orgs.error)throw orgs.error;
 const stations=await db.from('stations').select('*').order('created_at');if(stations.error)throw stations.error;
 const allEvents=[];for(let offset=0;;offset+=1000){const r=await db.from('station_events').select('*').order('recorded_at').order('id').range(offset,offset+999);if(r.error)throw r.error;allEvents.push(...r.data);if(r.data.length<1000)break;}
 const allActions=[];for(let offset=0;;offset+=1000){const r=await db.from('manager_actions').select('*').order('created_at',{ascending:false}).order('id').range(offset,offset+999);if(r.error)throw r.error;allActions.push(...r.data);if(r.data.length<1000)break;}
 const profile=await db.from('profiles').select('full_name').eq('id',context.userId).maybeSingle();if(profile.error)throw profile.error;
 return {organizations:orgs.data,stations:stations.data,events:allEvents,actions:allActions,fullName:profile.data?.full_name??''};
});
export const createOrganization=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator((v)=>z.object({name:z.string().trim().min(1).max(100)}).parse(v)).handler(async({data,context})=>{const r=await context.supabase.rpc('create_organization',{org_name:data.name});if(r.error)throw r.error;return r.data;});
export const saveStation=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator((v)=>stationSchema.parse(v)).handler(async({data,context})=>{const {id,...values}=data;const r=id?await context.supabase.from('stations').update(values).eq('id',id).eq('organization_id',values.organization_id).select('id').single():await context.supabase.from('stations').insert(values).select('id').single();if(r.error)throw r.error;return r.data;});
export const saveEvent=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator((v)=>eventSchema.parse(v)).handler(async({data,context})=>{const r=await context.supabase.from('station_events').insert({...data,created_by:context.userId}).select('id').single();if(r.error)throw r.error;return r.data;});
export const saveAction=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator((v)=>actionSchema.parse(v)).handler(async({data,context})=>{const r=await context.supabase.from('manager_actions').insert({...data,created_by:context.userId}).select('id').single();if(r.error)throw r.error;return r.data;});
