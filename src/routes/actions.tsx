import {createFileRoute} from '@tanstack/react-router';
import {Dashboard} from '@/components/dashboard';
import {pageHead} from '@/lib/page-head';
export const Route=createFileRoute('/actions')({head:()=>pageHead('Actions','TrayWise actions for thoughtful university dining operations.'),component:()=> <Dashboard view="actions"/>});
