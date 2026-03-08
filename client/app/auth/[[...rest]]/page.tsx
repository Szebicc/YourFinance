"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  useUser,
} from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AuthPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) {
      router.replace("/");
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
        {/* Left side - Branding/Hero */}
        <div className="flex flex-1 flex-col justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-8 py-16 text-white lg:px-12">
          <div className="mx-auto max-w-md space-y-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Your Finance
              </h1>
              <p className="text-lg text-blue-100 sm:text-xl">
                Take control of your money, one record at a time.
              </p>
            </div>

            <p className="text-base leading-relaxed text-blue-50">
              Track income, expenses, and categories in seconds. Get a clear view
              of your cash flow so you can make smarter decisions—without
              spreadsheet chaos.
            </p>

            <div className="grid gap-4 pt-4 sm:grid-cols-3">
              <div className="space-y-1">
                <div className="text-2xl font-semibold">24/7</div>
                <div className="text-sm text-blue-200">Access anywhere</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-semibold">Real‑time</div>
                <div className="text-sm text-blue-200">Dashboard updates</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-semibold">Zero</div>
                <div className="text-sm text-blue-200">Spreadsheet chaos</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth Card */}
        <div className="flex flex-1 items-center justify-center bg-white px-6 py-12 lg:px-12">
          <Card className="w-full max-w-md border-slate-200 shadow-lg">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl font-semibold text-slate-900">
                Welcome to Your Finance
              </CardTitle>
              <CardDescription className="text-slate-600">
                Sign in or create an account to start tracking your finances.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SignedOut>
                <div className="space-y-4">
                  <SignInButton mode="modal" fallbackRedirectUrl="/">
                    <Button
                      asChild
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      size="lg"
                    >
                      <span>Sign in</span>
                    </Button>
                  </SignInButton>

                  <SignUpButton mode="modal" fallbackRedirectUrl="/">
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-slate-300"
                      size="lg"
                    >
                      <span>Create account</span>
                    </Button>
                  </SignUpButton>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-slate-500">
                        Secure & Protected
                      </span>
                    </div>
                  </div>

                  <p className="text-center text-xs text-slate-500">
                    Powered by Clerk – your account and data are protected.
                  </p>
                </div>
              </SignedOut>

              <SignedIn>
                <div className="text-center">
                  <p className="text-sm text-slate-600">
                    You&apos;re already signed in. Redirecting to your dashboard…
                  </p>
                </div>
              </SignedIn>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}