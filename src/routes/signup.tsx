import {createFileRoute} from '@tanstack/react-router';
import {AuthScreen} from '@/components/auth-screen';
import {pageHead} from '@/lib/page-head';
export const Route=createFileRoute('/signup')({head:()=>pageHead('Create account','Create your TrayWise manager account.'),component:()=> <AuthScreen signup/>});
