import {createFileRoute} from '@tanstack/react-router';
import {Dashboard} from '@/components/dashboard';
import {pageHead} from '@/lib/page-head';
export const Route=createFileRoute('/history')({head:()=>pageHead('History','TrayWise history for thoughtful university dining operations.'),component:()=> <Dashboard view="history"/>});
