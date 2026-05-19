"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Building2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveSession } from "@/lib/auth/session";
import { useLocale } from "@/lib/i18n/locale";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { tr } = useLocale();
  const [chainId, setChainId] = useState("CHAIN01");
  const [propertyId, setPropertyId] = useState("MADINAH01");
  const [userId, setUserId] = useState("Ahmed Hassan");
  const [password, setPassword] = useState("password");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // API_REQUIRED: POST /api/auth/login with chainId, propertyId, userId, password.
    saveSession({ chainId, propertyId, userId });
    router.replace(searchParams.get("next") || "/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-2xl">{tr("HotelOS Login")}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {tr("Enter chain, property, and user credentials.")}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="chainId">{tr("Chain ID")}</Label>
              <Input
                id="chainId"
                value={chainId}
                onChange={(event) => setChainId(event.target.value)}
                placeholder="CHAIN01"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="propertyId">{tr("Property ID")}</Label>
              <Input
                id="propertyId"
                value={propertyId}
                onChange={(event) => setPropertyId(event.target.value)}
                placeholder="MADINAH01"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userId">{tr("User ID")}</Label>
              <Input
                id="userId"
                value={userId}
                onChange={(event) => setUserId(event.target.value)}
                placeholder={tr("User ID")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{tr("Password")}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={tr("Password")}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              <Lock className="h-4 w-4" />
              {tr("Sign In")}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              {tr("Mock login for demo. Any values are accepted until API is wired.")}
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
