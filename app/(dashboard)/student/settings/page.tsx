import { getCurrentUser } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Shield, Sparkles, Info } from "lucide-react";

export default async function StudentSettingsPage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Account Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your personal profile information and authentication preferences.
        </p>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-2xl border bg-primary/5 text-primary text-xs sm:text-sm">
        <Info className="h-5 w-5 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-bold">Managing your account:</strong> Your profile photo, name, email addresses, password, and active security sessions are securely managed via the Clerk account menu in the top right navigation bar.
        </div>
      </div>

      <Card className="rounded-3xl border shadow-sm bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Profile Details</CardTitle>
              <CardDescription>Synced securely with your authenticated Clerk session</CardDescription>
            </div>
            <Badge variant="outline" className="uppercase font-bold text-[10px] tracking-wider">
              <Sparkles className="h-3 w-3 mr-1 text-primary" /> {user?.role} Account
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-1.5 text-xs font-semibold">
              <User className="h-3.5 w-3.5 text-muted-foreground" /> Full Name
            </Label>
            <Input id="name" defaultValue={user?.name || "Student"} disabled className="rounded-2xl bg-muted/40" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-1.5 text-xs font-semibold">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" /> Email Address
            </Label>
            <Input id="email" defaultValue={user?.email || ""} disabled className="rounded-2xl bg-muted/40" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="flex items-center gap-1.5 text-xs font-semibold">
              <Shield className="h-3.5 w-3.5 text-muted-foreground" /> System Role
            </Label>
            <Input id="role" defaultValue={user?.role || "student"} disabled className="rounded-2xl bg-muted/40 uppercase font-mono text-xs" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
