"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useUser } from "@clerk/nextjs";
import { getUserProfile, updateUserProfile, type UserProfileDto } from "@/lib/api/profile";

interface UserProfileContextValue {
  profile: UserProfileDto | null;
  isLoading: boolean;
  error: string | null;
  saveMonthlyIncome: (amount: number) => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextValue | undefined>(
  undefined
);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const [profile, setProfile] = useState<UserProfileDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userId = user?.id;
    if (!userId) return;

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getUserProfile(userId)
      .then((data) => {
        if (!cancelled) setProfile(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          console.error(err);
          setError(
            err instanceof Error ? err.message : "Failed to load profile."
          );
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const saveMonthlyIncome = async (amount: number) => {
    const userId = user?.id;
    if (!userId) return;

    setError(null);
    try {
      const updated = await updateUserProfile(userId, {
        monthlyIncome: amount,
      });
      setProfile(updated);
    } catch (err: unknown) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Failed to update monthly income."
      );
    }
  };

  const value: UserProfileContextValue = {
    profile,
    isLoading,
    error,
    saveMonthlyIncome,
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return ctx;
}

