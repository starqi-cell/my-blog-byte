import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';


const HomePage = lazy(() => import('../pages/Home'));
const Articles = lazy(() => import('../pages/Articles'));
const ArticleDetail = lazy(() => import('../pages/Articles/c-cpns/ArticleDetail'));
const ArticleEditor = lazy(() => import('../pages/Articles/c-cpns/ArticleEditor'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const About = lazy(() => import('../pages/About'));
const Profile = lazy(() => import('../pages/Profile'));
const AdminDashboard = lazy(() => import('../pages/Animes/AdminDashboard'));
const AnimeList = lazy(() => import('../pages/Animes/AnimeList'));
const AnimeDetail = lazy(() => import('../pages/Animes/AnimeDetail'));
const AnimeManager = lazy(() => import('../pages/Animes/AnimeManager'));


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
    },
    {
        path:'/anime',
        element:<AnimeList />
    },
    {
        path:'/anime/:id',
        element:<AnimeDetail />
    },
    {
        path:'/admin/anime/add',
        element:<AnimeManager />
    }
];

export default routes;