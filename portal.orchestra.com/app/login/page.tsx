'use client';

import React from 'react';
import Image from 'next/image';
import { Mail, Lock, CheckCircle2, ShieldCheck, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useSignInForm } from '@/hooks/useSignInForm';

export default function LoginPage() {
  const { 
    formData, 
    errors, 
    isLoading, 
    authError, 
    handleChange, 
    handleSubmit 
  } = useSignInForm();

  return (
    <div className="flex min-h-screen font-sans">
      {/* Left Side - Login Form */}
      <div className="flex w-full flex-col justify-center bg-white px-8 md:w-1/2 lg:px-24">
        <div className="mx-auto w-full max-w-md flex flex-col min-h-[600px] justify-center">
          <div className="mb-10 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-lg">
              <ShieldCheck size={24} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Orchestrator <span className="text-indigo-600">Portal</span>
            </h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-gray-600">
              Enter your credentials to access your customer portal.
            </p>
          </div>

          {authError && (
            <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-600 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle size={18} />
              <p className="font-medium">{authError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative group">
                <div className={`pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 transition-colors ${errors.email ? 'text-red-400' : 'text-gray-400 group-focus-within:text-indigo-500'}`}>
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full rounded-xl border bg-gray-50 py-3 pl-10 pr-4 text-gray-900 transition-all outline-none ${errors.email ? 'border-red-300 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-100' : 'border-gray-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100'}`}
                  placeholder="user@orchestra.com"
                />
              </div>
              {errors.email && (
                <p className="text-xs font-medium text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <a href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative group">
                <div className={`pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 transition-colors ${errors.password ? 'text-red-400' : 'text-gray-400 group-focus-within:text-indigo-500'}`}>
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full rounded-xl border bg-gray-50 py-3 pl-10 pr-4 text-gray-900 transition-all outline-none ${errors.password ? 'border-red-300 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-100' : 'border-gray-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100'}`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="text-xs font-medium text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Sign in to Portal
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Need help? <a href="#" className="font-semibold text-indigo-600 hover:underline">Contact Customer Support</a>
          </p>

          <div className="mt-auto pt-10 text-center text-xs text-gray-400">
            © 2026 Orchestrator Enterprise Systems. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Image Overlay */}
      <div className="relative hidden w-1/2 overflow-hidden bg-indigo-900 lg:block">
        <Image
          src="/login_mv.jpg"
          alt="Orchestrator ERP Background"
          fill
          className="object-cover opacity-60 mix-blend-overlay"
          priority
        />
        
        {/* Abstract Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-tr from-indigo-950 via-indigo-900/40 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-end p-20 text-white">
          <div className="max-w-xl space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-1000">
            <div className="space-y-4">
              <h3 className="text-4xl font-bold leading-tight">
                Streamline your business interactions with ease.
              </h3>
              <p className="text-xl text-indigo-100/90 leading-relaxed font-light">
                The Orchestrator Portal provides a unified interface for all your customer and vendor needs, ensuring transparency and efficiency in every transaction.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/10">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-indigo-300">
                  <CheckCircle2 size={20} />
                  <span className="font-bold tracking-wider uppercase text-xs">Reliability</span>
                </div>
                <div className="text-2xl font-bold">99.9% Uptime</div>
                <div className="text-sm text-indigo-200/70">Enterprise-grade reliability</div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-indigo-300">
                  <ShieldCheck size={20} />
                  <span className="font-bold tracking-wider uppercase text-xs">Security</span>
                </div>
                <div className="text-2xl font-bold">SOC2 Compliant</div>
                <div className="text-sm text-indigo-200/70">Bank-level security standards</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
