import React from 'react';
import { Navigate } from 'react-router-dom';

import HomePage from '@/pages/Home/HomePage';
import LoginPage from '@/pages/Login/LoginPage';
import DashboardPage from '@/pages/Dashboard/DashboardPage';
import POSPage from '@/pages/POS/POSPage';
import ProductsPage from '@/pages/Products/ProductsPage';
import CategoriesPage from '@/pages/Categories/CategoriesPage';
import SuppliersPage from '@/pages/Suppliers/SuppliersPage';
import InventoryPage from '@/pages/Inventory/InventoryPage';
import PurchasesPage from '@/pages/Purchases/PurchasesPage';
import CustomersPage from '@/pages/Customers/CustomersPage';
import ReportsPage from '@/pages/Reports/ReportsPage';
import EmployeesPage from '@/pages/Employees/EmployeesPage';
import ShiftsPage from '@/pages/Shifts/ShiftsPage';
import NotFoundPage from '@/pages/NotFound/NotFoundPage';

import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';

export const routeConfig = [
  {
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
    ],
  },

  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: '/dashboard',
            element: <DashboardPage />,
          },
          {
            path: '/pos',
            element: <POSPage />,
          },
          {
            path: '/products',
            element: <ProductsPage />,
          },
          {
            path: '/categories',
            element: <CategoriesPage />,
          },
          {
            path: '/suppliers',
            element: <SuppliersPage />,
          },
          {
            path: '/inventory',
            element: <InventoryPage />,
          },
          {
            path: '/purchases',
            element: <PurchasesPage />,
          },
          {
            path: '/customers',
            element: <CustomersPage />,
          },
          {
            path: '/reports',
            element: <ReportsPage />,
          },
          {
            path: '/employees',
            element: <EmployeesPage />,
          },
          {
            path: '/shifts',
            element: <ShiftsPage />,
          },
        ],
      },
    ],
  },

  {
    path: '/404',
    element: <NotFoundPage />,
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
];

export default routeConfig;
