import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Navbar } from './components/Navbar';
import Login from './pages/Login';
import Campaigns from './pages/Campaigns';
import Gifts from './pages/Gifts';
import Orders from './pages/Orders';

import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCampaigns from './pages/admin/ManageCampaigns';
import ManageGifts from './pages/admin/ManageGifts';
import AdminOrders from './pages/admin/AdminOrders';
import Users from "./pages/admin/Users";

function App() {
  const { isAuthenticated, loading, role } = useAuth();
  console.log("AUTH:", { isAuthenticated, role, loading });
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="glass-effect p-8 rounded-2xl shadow-2xl text-center max-w-md w-full">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navbar only shows for authenticated users and NOT on admin pages (Admin has its own sidebar) */}
      {isAuthenticated && role !== 'admin' && <Navbar />}
      
      <div className={isAuthenticated && role !== 'admin' ? 'pt-24 pb-12 px-6 max-w-7xl mx-auto' : ''}>
        <Routes>
          {/*  ANIMATED LOGIN BACKGROUND - KEPT EXACTLY AS REQUESTED */}
          <Route 
            path="/login" 
            element={
              !isAuthenticated ? (
                <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-600 animate-gradient-xy"></div>
                  <div className="absolute inset-0">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-pink-200/20 rounded-full blur-2xl animate-bounce"></div>
                  </div>
                  <div className="relative z-10 max-w-md w-full mx-auto">
                    <Login />
                  </div>
                </div>
              ) : (
                // Redirect based on role if already logged in
                <Navigate to={role === 'admin' ? "/admin/dashboard" : "/campaigns"} replace />
              )
            } 
          />
          
          {/* --- USER PROTECTED ROUTES --- */}
          <Route 
            path="/campaigns" 
            element={isAuthenticated ? <Campaigns /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/campaigns/:id/gifts" 
            element={isAuthenticated ? <Gifts /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/orders" 
            element={isAuthenticated ? <Orders /> : <Navigate to="/login" replace />} 
          />

          {/* --- ADMIN PROTECTED ROUTES --- */}
          <Route 
            path="/admin" 
            element={isAuthenticated && role === 'admin' ? <AdminLayout /> : <Navigate to="/login" replace />}
          >
            {/* These routes render inside the AdminLayout's <Outlet /> */}
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="campaigns" element={<ManageCampaigns />} />
            <Route path="gifts" element={<ManageGifts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<Users />} />
            {/* Default admin path */}
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>
          {/* Global Redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </div>
  );
}
export default App;