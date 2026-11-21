import {createFileRoute} from '@tanstack/react-router';
import {Dashboard} from '@/components/dashboard';
import {pageHead} from '@/lib/page-head';
export const Route=createFileRoute('/forecasts')({head:()=>pageHead('Forecasts','TrayWise forecasts for thoughtful university dining operations.'),component:()=> <Dashboard view="forecasts"/>});
