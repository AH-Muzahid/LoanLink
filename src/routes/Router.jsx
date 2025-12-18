import React from 'react';
import { createBrowserRouter } from "react-router-dom";
import Home from '../pages/Home/Home';
import ErrorPage from '../pages/Error/ErrorPage';
import MainLayout from './../Layouts/MainLayout/MainLayout';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Regiser';
import AllLoans from '../pages/AllLoans/AllLoans';

import DashboardLayout from '../Layouts/DashboardLayout/DashboardLayout';
import PrivateRoute from './PrivateRoute';
import MyLoans from '../pages/dashboard/MyLoans';
import ApplyLoan from '../pages/dashboard/ApplyLoan';
import AddLoan from '../pages/dashboard/AddLoan';
import ManageUsers from '../pages/dashboard/ManageUsers';
import Profile from '../pages/dashboard/Profile';
import AllLoansAdmin from '../pages/dashboard/AllLoansAdmin';
import LoanApplications from '../pages/dashboard/LoanApplications';
import DashboardHome from '../pages/dashboard/DashboardHome';
import ManageLoans from '../pages/dashboard/ManageLoans';
import PendingLoans from '../pages/dashboard/PendingLoans';
import ApprovedLoans from '../pages/dashboard/ApprovedLoans';
import PaymentSuccess from '../pages/Payment/PaymentSuccess';
import AboutUs from '../pages/About/AboutUs';
import Contact from '../pages/Contact/Contact';




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
        path: "/all-loans",
        element: <AllLoans />,
      },
      {
        path: "/about",
        element: <AboutUs />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "*",
        element: <ErrorPage />,
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
      // Dashboard Home
      { index: true, element: <DashboardHome /> },
      
      // Common Route
      { path: "profile", element: <Profile /> },

      // Borrower Routes
      { path: "my-loans", element: <MyLoans /> },
      { path: "apply-loan", element: <ApplyLoan /> },

      // Manager Routes
      { path: "add-loan", element: <AddLoan /> },
      { path: "manage-loans", element: <ManageLoans /> },
      { path: "pending-loans", element: <PendingLoans /> },
      { path: "approved-loans", element: <ApprovedLoans /> },

      // Admin Routes
      { path: "manage-users", element: <ManageUsers /> },
      { path: "all-loans", element: <AllLoansAdmin /> },
      { path: "loan-applications", element: <LoanApplications /> },
    ],
  },
  // Payment Routes
  
  {
      path: 'dashboard/payment/success',
      Comment: <PaymentSuccess />
  }
]);
