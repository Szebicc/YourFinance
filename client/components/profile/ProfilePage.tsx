"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeftIcon, UserIcon } from "lucide-react";

import { useUserProfile } from "@/contexts/UserProfileContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatMoney } from "@/lib/breakdown/utils";

export function ProfilePage() {
  const { profile, isLoading, error, saveMonthlyIncome } = useUserProfile();
  const [value, setValue] = React.useState<string>("");

  React.useEffect(() => {
    if (profile) {
      setValue(profile.monthlyIncome ? String(profile.monthlyIncome) : "");
    }
  }, [profile]);

  const parsed = Number(value || "0");

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-4 py-8 lg:py-12">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button asChild variant="ghost" size="icon-sm">
                <Link href="/" aria-label="Back to dashboard">
                  <ArrowLeftIcon className="size-4" />
                </Link>
              </Button>
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
                  <UserIcon className="size-5" />
                  Profile
                </CardTitle>
                <CardDescription className="mt-1">
                  Configure your expected monthly income to power income tracking.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Salary / month
            </CardTitle>
            <CardDescription>
              Your expected monthly salary. The income card on the dashboard shows
              whether you&apos;ve recorded receiving it this month.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="monthlyIncome">
                Expected salary (per month)
              </label>
              <div className="flex items-center gap-2">
                <span className="rounded-md border bg-muted px-3 py-2 text-sm text-muted-foreground">
                  $
                </span>
                <Input
                  id="monthlyIncome"
                  type="number"
                  min="0"
                  step="0.01"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="max-w-xs"
                  placeholder="e.g. 3200"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Current saved value:{" "}
                {formatMoney(Math.round((profile?.monthlyIncome ?? 0) * 100))}
              </p>
            </div>

            {error ? (
              <p className="text-xs text-destructive">
                Couldn&apos;t save profile: {error}
              </p>
            ) : null}

            <div className="flex gap-2">
              <Button
                type="button"
                disabled={isLoading}
                onClick={async () => {
                  await saveMonthlyIncome(parsed);
                }}
              >
                Save
              </Button>
            </div>

            {isLoading ? (
              <p className="text-xs text-muted-foreground">
                Syncing profile with the server…
              </p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

