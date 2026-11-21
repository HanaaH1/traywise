import { describe,it,expect } from 'vitest';
import {analyzeStation,type Station,type StationEvent} from '@/lib/inventory';
const station:Station={id:'s',organization_id:'o',name:'Kitchen',food:'Rice',capacity_kg:40,closing_time:'20:00'};
const event=(kind:string,weight:number,time:string):StationEvent=>({id:time,station_id:'s',organization_id:'o',kind,weight_kg:weight,recorded_at:`2026-11-21T${time}:00`});
const now=new Date('2026-11-21T19:00:00');
describe('Inventory rules',()=>{
 it('requires two valid timestamped readings for a forecast',()=>{expect(analyzeStation(station,[event('reading',20,'18:00')],now).remaining).toBeNull();});
 it('separates refills from consumption',()=>{const r=analyzeStation(station,[event('reading',20,'18:00'),event('refill',5,'18:30'),event('reading',15,'19:00')],now);expect(r.rate).toBe(10);expect(r.remaining).toBe(5);expect(r.refills).toBe(1);});
 it('rejects unexplained inventory increases as valid consumption intervals',()=>{expect(analyzeStation(station,[event('reading',10,'18:00'),event('reading',20,'19:00')],now).rate).toBeNull();});
 it('counts post-reading refills as inventory, not as readings',()=>{const r=analyzeStation(station,[event('reading',10,'18:00'),event('refill',5,'18:30')],now);expect(r.inventory).toBe(15);expect(r.remaining).toBeNull();});
 it('never estimates negative remaining inventory',()=>{expect(analyzeStation(station,[event('reading',20,'18:00'),event('reading',5,'19:00')],now).remaining).toBe(0);});
});
