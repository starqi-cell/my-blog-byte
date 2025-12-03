import React, { Suspense, lazy } from 'react';
import { RouteObject } from 'react-router-dom';


const HomePage = lazy(() => import('../pages/Home'));
const Articles = lazy(() => import('../pages/Articles'));
const ArticleDetail = lazy(() => import('../pages/ArticleDetail'));
const ArticleEditor = lazy(() => import('../pages/ArticleEditor'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const About = lazy(() => import('../pages/About'));
const Profile = lazy(() => import('../pages/Profile'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));


const routes:RouteObject[]=[
    {
        path:'/',
        element:<HomePage />
    },
    {
        path:'/articles',
        element:<Articles />
    },
    {
        path:'/article/:id',
        element:<ArticleDetail />
    },
    {
        path:'/article/create',
        element:<ArticleEditor />
    },
    {
        path:'/article/edit/:id',
        element:<ArticleEditor />
    },
    {
        path:'/login',
        element:<Login />
    },
    {
        path:'/register',
        element:<Register />
    },
    {
        path:'/about',
        element:<About />
    },
    {
        path:'/profile',
        element:<Profile />
    },
    {
        path:'/admin',
        element:<AdminDashboard />
    }
];

export default routes;