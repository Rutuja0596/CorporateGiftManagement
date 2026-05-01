
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useEffect } from "react";

export default function Login() {
  // 1. Define all necessary states inside the component
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth();
const { isAuthenticated, role } = useAuth();

useEffect(() => {
  if (isAuthenticated) {
    if (role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    } else {
      navigate("/campaigns", { replace: true });
    }
  }
}, [isAuthenticated, role]);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  setError('');
  setLoading(true);

  try {
    const response = await api.post('/auth/login', { email, password });

    if (!response.data || !response.data.access_token) {
      setError("Invalid email or password");
      return;
    }

    const token = response.data.access_token;

    // ✅ ONLY THIS
    login(token);

  } catch (err: any) {
    setError("Invalid email or password");
  } finally {
    setLoading(false);
  }
};

  return (
    <Card className="w-full max-w-md shadow-2xl bg-white/90 backdrop-blur-md">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-orange-600 bg-clip-text text-transparent mb-2">
          Welcome
        </h1>
        <p className="text-gray-600">Sign in to your account</p>
      </div>

      {/* Error Message Box */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
            <input
              type="email"
              required
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
            <input
              type={showPassword ? "text" : "password"}
              required
              className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* Eye Toggle Button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          loading={loading} 
          className="w-full py-4 text-lg font-bold shadow-lg mt-2"
          disabled={loading || !email || !password}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="animate-spin mr-2" /> Authenticating...
            </span>
          ) : "Sign In"}
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">
          Internal Platform Access Only
        </p>
      </div>
    </Card>
  );
}