import {createFileRoute} from '@tanstack/react-router';
import {Dashboard} from '@/components/dashboard';
import {pageHead} from '@/lib/page-head';
export const Route=createFileRoute('/stations')({head:()=>pageHead('Stations','TrayWise stations for thoughtful university dining operations.'),component:()=> <Dashboard view="stations"/>});
