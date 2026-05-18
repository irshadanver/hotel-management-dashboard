"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getStoredSession, type HotelUserSession } from "@/lib/auth/session";

export default function ProfilePage() {
  const [session, setSession] = useState<HotelUserSession | null>(null);

  useEffect(() => {
    setSession(getStoredSession());
  }, []);

  return (
    <DashboardShell
      activeItem="dashboard"
      title="Profile Settings"
      subtitle="User and property profile for this session"
    >
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={session?.name ?? ""} readOnly />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Input value={session?.role ?? ""} readOnly />
          </div>
          <div className="space-y-2">
            <Label>Chain ID</Label>
            <Input value={session?.chainId ?? ""} readOnly />
          </div>
          <div className="space-y-2">
            <Label>Property ID</Label>
            <Input value={session?.propertyId ?? ""} readOnly />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Property Name</Label>
            <Input value={session?.propertyName ?? ""} readOnly />
          </div>
          <div className="sm:col-span-2">
            <Button disabled>Save profile (API required)</Button>
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
