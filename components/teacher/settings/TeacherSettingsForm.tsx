"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mail, Save, Shield, Sparkles, User, Info } from "lucide-react";

interface TeacherSettingsFormProps {
  initialData: {
    bio: string | null;
    name: string | null;
    email: string;
    role: string;
  };
}

export function TeacherSettingsForm({ initialData }: TeacherSettingsFormProps) {
  const router = useRouter();
  const [bio, setBio] = useState(initialData.bio || "");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const res = await fetch("/api/teacher/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio }),
      });

      if (!res.ok) {
        throw new Error("Failed to update teacher settings");
      }

      toast.success("Instructor profile updated successfully! 🎉");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex items-start gap-3 p-4 rounded-2xl border bg-primary/5 text-primary text-xs sm:text-sm">
        <Info className="h-5 w-5 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-bold">Public Instructor Bio:</strong> Your biography is displayed publicly on the course detail pages of all courses you author.
        </div>
      </div>

      <Card className="rounded-3xl border shadow-sm bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Instructor Profile</CardTitle>
              <CardDescription>Customize your public author details</CardDescription>
            </div>
            <Badge variant="outline" className="uppercase font-bold text-[10px] tracking-wider">
              <Sparkles className="h-3 w-3 mr-1 text-primary" /> {initialData.role} Account
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-1.5 text-xs font-semibold">
              <User className="h-3.5 w-3.5 text-muted-foreground" /> Full Name
            </Label>
            <Input id="name" defaultValue={initialData.name || "Instructor"} disabled className="rounded-2xl bg-muted/40" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-1.5 text-xs font-semibold">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" /> Email Address
            </Label>
            <Input id="email" defaultValue={initialData.email} disabled className="rounded-2xl bg-muted/40" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="flex items-center gap-1.5 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-muted-foreground" /> Instructor Biography & Expertise
            </Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write a compelling bio introducing your industry background, teaching style, and expertise..."
              rows={4}
              className="rounded-2xl resize-none text-xs sm:text-sm bg-card"
            />
            <p className="text-[11px] text-muted-foreground">
              Brief summary of your professional experience and credentials.
            </p>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-2xl gap-2 font-bold text-xs shadow-sm px-6"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
