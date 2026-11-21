export interface Station { id: string; organization_id: string; name: string; food: string; capacity_kg: number; closing_time: string }
export interface StationEvent { id: string; station_id: string; organization_id: string; kind: string; weight_kg: number; recorded_at: string }
export interface ManagerAction { id: string; station_id: string; organization_id: string; decision: string; note: string; created_at: string }
export interface InventoryData { organizations: {id:string;name:string}[]; stations: Station[]; events: StationEvent[]; actions: ManagerAction[]; fullName: string }
export function analyzeStation(station: Station, events: StationEvent[], now: Date) {
 const rows=events.filter(e=>e.station_id===station.id && new Date(e.recorded_at).getTime()<=now.getTime()).sort((a,b)=>Date.parse(a.recorded_at)-Date.parse(b.recorded_at));
 const readings=rows.filter(e=>e.kind==='reading'); const latest=readings.at(-1);
 const refillsAfter=latest ? rows.filter(e=>e.kind==='refill' && Date.parse(e.recorded_at)>Date.parse(latest.recorded_at)).reduce((sum,e)=>sum+Number(e.weight_kg),0) : 0;
 const inventory=latest ? Number(latest.weight_kg)+refillsAfter : null;
 let consumed=0, minutes=0, validIntervals=0;
 for(let i=1;i<readings.length;i++) {const prev=readings[i-1], curr=readings[i]; if(!prev||!curr) continue; const start=Date.parse(prev.recorded_at), end=Date.parse(curr.recorded_at); const dt=(end-start)/60000; const refill=rows.filter(e=>e.kind==='refill'&&Date.parse(e.recorded_at)>start&&Date.parse(e.recorded_at)<=end).reduce((s,e)=>s+Number(e.weight_kg),0); const used=Number(prev.weight_kg)+refill-Number(curr.weight_kg); if(dt>=5&&used>=0) {consumed+=used;minutes+=dt;validIntervals++;}}
 const rate=validIntervals>0 ? consumed/minutes*60 : null;
 const close=new Date(now); const [h,m]=station.closing_time.split(':').map(Number); close.setHours(h??20,m??0,0,0);
 const hours=latest?Math.max(0,(close.getTime()-Date.parse(latest.recorded_at))/3600000):0;
 const remaining=inventory!==null&&rate!==null?Math.max(0,inventory-rate*hours):null;
 const percentage=inventory===null?0:Math.min(100,inventory/station.capacity_kg*100);
 return {inventory,rate,remaining,consumed,validIntervals,latest,percentage,refills:rows.filter(e=>e.kind==='refill').length,status:inventory===null?'No readings':percentage<20?'Low inventory':remaining!==null&&remaining>station.capacity_kg*.25?'Surplus likely':'On track'};
}
export function demoData(now: Date): InventoryData {
 const names=[['Hot kitchen','Grilled chicken',45],['Plant-based','Roasted vegetables',30],['Pasta station','Penne primavera',35],['Salad bar','Seasonal greens',20],['Soup station','Tomato & basil soup',25],['Bakery','Fresh bread',15]] as const;
 const stations=names.map(([name,food,capacity],i)=>({id:`demo-${i}`,organization_id:'demo',name,food,capacity_kg:capacity,closing_time:'20:00'}));
 const weights=[[38,29,23],[25,21,18],[29,19,12],[17,10,7],[22,19,17],[12,7,3]];
 const events=stations.flatMap((s,i)=>(weights[i]??[]).map((weight,j)=>({id:`e-${i}-${j}`,station_id:s.id,organization_id:'demo',kind:'reading',weight_kg:weight,recorded_at:new Date(now.getTime()-(2-j)*3600000).toISOString()})));
 events.push({id:'refill-demo',station_id:'demo-0',organization_id:'demo',kind:'refill',weight_kg:8,recorded_at:new Date(now.getTime()-90*60000).toISOString()});
 return {organizations:[{id:'demo',name:'Campus dining · Demo'}],stations,events,actions:[{id:'action-demo',station_id:'demo-2',organization_id:'demo',decision:'Reduce next batch',note:'Prepare a smaller batch for the final hour of service.',created_at:new Date(now.getTime()-35*60000).toISOString()}],fullName:'Demo manager'};
}
