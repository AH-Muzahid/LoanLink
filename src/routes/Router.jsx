import React from 'react';
import { createBrowserRouter } from "react-router-dom";
import Home from '../pages/Home/Home';
import ErrorPage from '../pages/Error/ErrorPage';
import MainLayout from './../Layouts/MainLayout/MainLayout';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Regiser';

import DashboardLayout from '../Layouts/DashboardLayout/DashboardLayout';
import PrivateRoute from './PrivateRoute';
import MyLoans from '../pages/dashboard/MyLoans';
import ApplyLoan from '../pages/dashboard/ApplyLoan';
import AddLoan from '../pages/dashboard/AddLoan';
import ManageUsers from '../pages/dashboard/ManageUsers';
import Profile from '../pages/dashboard/Profile';




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

  // Dashboard Routes
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      // Common Route
      { path: "profile", element: <Profile /> },

      // Borrower Routes
      { path: "my-loans", element: <MyLoans /> },
      { path: "apply-loan", element: <ApplyLoan /> },

      // Manager Routes
      { path: "add-loan", element: <AddLoan /> },
      { path: "my-added-loans", element: <h2>My Added Loans (Manager)</h2> },

      // Admin Routes
      { path: "manage-users", element: <ManageUsers /> },
      { path: "all-loans", element: <h2>All Loans Management (Admin)</h2> },
    ],
  },
]);
