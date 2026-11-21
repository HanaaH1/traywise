import {createFileRoute} from '@tanstack/react-router';
import {AuthScreen} from '@/components/auth-screen';
import {pageHead} from '@/lib/page-head';
export const Route=createFileRoute('/auth')({head:()=>pageHead('Sign in','Sign in to your TrayWise dining operations account.'),component:()=> <AuthScreen/>});
