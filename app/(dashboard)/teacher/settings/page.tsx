import { getCurrentUser } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, ShieldCheck, Sparkles } from "lucide-react";

export default async function TeacherSettingsPage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Instructor Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your instructor profile, bio, and publication credentials.
        </p>
      </div>

      <Card className="rounded-2xl border shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Instructor Profile</CardTitle>
              <CardDescription>Verified publishing permissions</CardDescription>
            </div>
            <Badge variant="secondary" className="uppercase font-semibold text-xs">
              <Sparkles className="h-3 w-3 mr-1 text-primary" /> {user?.role} Mode
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-1.5 text-xs font-semibold">
              <User className="h-3.5 w-3.5 text-muted-foreground" /> Display Name
            </Label>
            <Input id="name" defaultValue={user?.name || ""} disabled className="rounded-xl bg-muted/40" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-1.5 text-xs font-semibold">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" /> Contact Email
            </Label>
            <Input id="email" defaultValue={user?.email || ""} disabled className="rounded-xl bg-muted/40" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="flex items-center gap-1.5 text-xs font-semibold">
              <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" /> Role Authority
            </Label>
            <Input id="role" defaultValue={user?.role || "instructor"} disabled className="rounded-xl bg-muted/40 uppercase font-mono text-xs" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
