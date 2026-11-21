import { createFileRoute } from '@tanstack/react-router';
import {Dashboard} from '@/components/dashboard';
import {pageHead} from '@/lib/page-head';
export const Route=createFileRoute('/')({head:()=>pageHead('Dining overview','Monitor station inventory, refills, and estimated consumption with TrayWise.'),component:()=> <Dashboard/>});
