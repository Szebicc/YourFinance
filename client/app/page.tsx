"use client";

import { SignedIn, useUser, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { FinancialRecordsProvider } from "@/contexts/FinancialRecordsProvider";
import { UserProfileProvider } from "@/contexts/UserProfileContext";
import { FinancialRecordForm } from "@/components/dashboard/FinancialRecordForm";
import { FinancialRecordList } from "@/components/dashboard/FinancialRecordList";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/themes/ModeToggle";
import Image from "next/image";
import { PieChartIcon, UserIcon } from "lucide-react";
import { IncomeSummary } from "@/components/dashboard/IncomeSummary";

export default function Home() {
  return (
    <SignedIn>
      <FinancialRecordsProvider>
        <UserProfileProvider>
          <Dashboard />
        </UserProfileProvider>
      </FinancialRecordsProvider>
    </SignedIn>
  );
}

const Dashboard = () => {
  const { user } = useUser();

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 py-8 lg:py-12">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Image
                src="/logo-small.svg"
                alt="Your Finance"
                width={40}
                height={40}
                className="hidden sm:block"
              />
              <div>
                <CardTitle className="text-2xl font-semibold tracking-tight">
                  Your Finance
                </CardTitle>
                <CardDescription className="mt-1">
                  Welcome back{user?.firstName ? `, ${user.firstName}` : ""}. Track
                  your spending and income in real time.
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ModeToggle />
              <Button asChild variant="outline">
                <Link href="/breakdown">
                  <PieChartIcon className="size-4" />
                  Breakdown
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/profile">
                  <UserIcon className="size-4" />
                  Profile
                </Link>
              </Button>
              <SignedIn>
                <SignOutButton redirectUrl="/auth">
                  <Button variant="outline">
                    Log out
                  </Button>
                </SignOutButton>
              </SignedIn>
            </div>
          </CardHeader>
        </Card>

        <div className="grid flex-1 gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.6fr)]">
          <div className="space-y-4">
            <FinancialRecordForm />
          </div>
          <div className="space-y-4">
            <IncomeSummary />
            <FinancialRecordList />
          </div>
        </div>
      </div>
    </main>
  );
};