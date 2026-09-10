'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { Logo } from '@/shared/ui/Logo';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen wave-motif flex items-stretch">
            {/* Left panel - branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-navy relative overflow-hidden flex-col justify-between p-12">
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 15% 20%, rgba(217,164,65,0.5) 0, transparent 40%), radial-gradient(circle at 85% 80%, rgba(23,107,135,0.6) 0, transparent 45%)',
                    }}
                />
                <div className="relative z-10">
                    <Logo />
                </div>

                <div className="relative z-10 max-w-md">
                    <p className="text-xs font-semibold tracking-widest text-gold uppercase mb-4">
                        Customer Twin Intelligence
                    </p>
                    <h1 className="text-3xl font-bold text-white leading-tight tracking-tight">
                        Screen sustainable product concepts with confidence.
                    </h1>
                    <p className="mt-4 text-sm text-white/60 leading-relaxed">
                        AI-assisted, human-calibrated customer twins help Toba MSMEs
                        turn 108 possibilities into a focused, validated shortlist.
                    </p>
                </div>

                <div className="relative z-10 gorga-divider rounded-full" />
            </div>

            {/* Right panel - form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-sm">
                    <div className="lg:hidden mb-10 flex justify-center">
                        <div className="bg-navy rounded-xl px-3 py-2">
                            <Logo compact />
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-navy tracking-tight">Welcome back</h2>
                        <p className="mt-2 text-sm text-charcoal/60">
                            Sign in to continue to your TobaMarketTwin dashboard.
                        </p>
                    </div>

                    <form
                        className="space-y-5"
                        onSubmit={(e) => {
                            e.preventDefault();
                        }}
                    >
                        <div>
                            <label htmlFor="email" className="block text-xs font-semibold text-charcoal/70 mb-1.5">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30" />
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    placeholder="you@example.com"
                                    className="w-full rounded-xl border border-charcoal/10 bg-white pl-10 pr-4 py-2.5 text-sm text-charcoal placeholder:text-charcoal/30 outline-none transition focus:border-lakeblue focus:ring-4 focus:ring-lakeblue/10"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label htmlFor="password" className="block text-xs font-semibold text-charcoal/70">
                                    Password
                                </label>
                                <Link href="#" className="text-xs font-medium text-lakeblue hover:text-teal transition">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    placeholder="••••••••"
                                    className="w-full rounded-xl border border-charcoal/10 bg-white pl-10 pr-10 py-2.5 text-sm text-charcoal placeholder:text-charcoal/30 outline-none transition focus:border-lakeblue focus:ring-4 focus:ring-lakeblue/10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal/30 hover:text-charcoal/60 transition"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <label className="flex items-center gap-2 text-xs text-charcoal/60">
                            <input type="checkbox" className="rounded border-charcoal/20 text-lakeblue focus:ring-lakeblue/30" />
                            Remember me for 30 days
                        </label>

                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-lakeblue"
                        >
                            Sign in
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    <div className="mt-6 flex items-center gap-3">
                        <div className="h-px flex-1 bg-charcoal/10" />
                        <span className="text-xs text-charcoal/40">or</span>
                        <div className="h-px flex-1 bg-charcoal/10" />
                    </div>

                    <Link
                        href="/dashboard"
                        className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-charcoal/10 bg-white px-4 py-2.5 text-sm font-medium text-charcoal transition hover:border-lakeblue/40 hover:text-lakeblue"
                    >
                        Continue as demo guest
                    </Link>

                    <p className="mt-8 text-center text-xs text-charcoal/50">
                        Don&apos;t have an account?{' '}
                        <Link href="#" className="font-medium text-lakeblue hover:text-teal transition">
                            Request access
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
