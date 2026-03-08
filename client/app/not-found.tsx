"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function NotFound() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      const timer = setTimeout(() => {
        router.replace("/auth");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSignedIn, isLoaded, router]);

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Page Not Found</CardTitle>
          <CardDescription>
            The page you&apos;re looking for doesn&apos;t exist.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoaded && !isSignedIn ? (
            <p className="text-sm text-muted-foreground">
              Redirecting you to the login page...
            </p>
          ) : (
            <div className="flex gap-2">
              <Button onClick={() => router.push("/")} className="flex-1">
                Go to Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                Go Back
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
