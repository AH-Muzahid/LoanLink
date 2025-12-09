import React from 'react';
import { createBrowserRouter } from "react-router-dom";
import Home from '../pages/Home/Home';
import ErrorPage from '../pages/Error/ErrorPage';
import MainLayout from './../Layouts/MainLayout/MainLayout';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Regiser';




export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      }

    ]
  },
]);
