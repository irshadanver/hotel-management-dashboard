"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function PreferencesPage() {
  const [theme, setTheme] = useState("system");
  const [dateFormat, setDateFormat] = useState("dd-mmm-yyyy");
  const [notifications, setNotifications] = useState(true);

  return (
    <DashboardShell
      activeItem="dashboard"
      title="Preferences"
      subtitle="Display and notification preferences"
    >
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base">Application Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-2">
            <Label>Theme</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Date Format</Label>
            <Select value={dateFormat} onValueChange={setDateFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dd-mmm-yyyy">14 May 2026</SelectItem>
                <SelectItem value="yyyy-mm-dd">2026-05-14</SelectItem>
                <SelectItem value="mm-dd-yyyy">05/14/2026</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label>Notifications</Label>
              <p className="text-xs text-muted-foreground">
                Show operational alerts in the header.
              </p>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>
          <Button disabled>Save preferences (API required)</Button>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
