export interface UserProfileDto {
  _id?: string;
  userId: string;
  monthlyIncome: number;
}

export async function getUserProfile(
  userId: string
): Promise<UserProfileDto> {
  const res = await fetch(
    `/api/profile?userId=${encodeURIComponent(userId)}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error(`Failed to load profile (${res.status})`);
  }

  return res.json();
}

export async function updateUserProfile(
  userId: string,
  profile: Pick<UserProfileDto, "monthlyIncome">
): Promise<UserProfileDto> {
  const res = await fetch(
    `/api/profile?userId=${encodeURIComponent(userId)}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to update profile (${res.status})`);
  }

  return res.json();
}

