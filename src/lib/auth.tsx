import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
const AuthContext=createContext<{user:User|null;loading:boolean}>({user:null,loading:true});
export const useAuth=()=>useContext(AuthContext);
export function AuthProvider({children}:{children:ReactNode}) {
 const [user,setUser]=useState<User|null>(null); const [loading,setLoading]=useState(true); const client=useQueryClient(); const router=useRouter();
 useEffect(()=>{let active=true; const {data:{subscription}}=supabase.auth.onAuthStateChange((event,session)=>{if(!active)return;if(event==='INITIAL_SESSION'||event==='SIGNED_IN'||event==='SIGNED_OUT'||event==='USER_UPDATED'){setUser(session?.user??null);setLoading(false); if(event!=='INITIAL_SESSION'){void router.invalidate();if(event!=='SIGNED_OUT')void client.invalidateQueries();}}}); void supabase.auth.getUser().then(({data})=>{if(active){setUser(data.user);setLoading(false);}}); return()=>{active=false;subscription.unsubscribe();};},[client,router]);
 return <AuthContext.Provider value={{user,loading}}>{children}</AuthContext.Provider>;
}
