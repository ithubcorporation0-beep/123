"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Shield,
  User,
  Mail,
  Phone,
  Key,
  CheckCircle2,
  Loader2,
  UploadCloud,
  Clock,
  Sparkles,
  Lock,
} from "lucide-react";
import Image from "next/image";

interface AdminProfileData {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  bio: string | null;
  imageUrl: string | null;
  role: string;
  createdAt: string;
}

export function AdminProfileView() {
  const [profile, setProfile] = useState<AdminProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formBio, setFormBio] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/profile");
      if (res.ok) {
        const data = await res.json();
        if (data.profile) {
          setProfile(data.profile);
          setFormName(data.profile.name || "");
          setFormPhone(data.profile.phone || "");
          setFormBio(data.profile.bio || "");
          setFormImageUrl(data.profile.imageUrl || "");
        }
      }
    } catch (err) {
      console.error("Failed to load admin profile", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", "profile-images");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setFormImageUrl(data.url);
      } else {
        alert("Avatar upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading avatar");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName.trim(),
          phone: formPhone.trim() || null,
          bio: formBio.trim() || null,
          imageUrl: formImageUrl.trim() || null,
        }),
      });

      if (res.ok) {
        setSuccessMsg("Admin profile updated successfully!");
        fetchProfile();
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        alert("Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif text-[#194866] font-normal tracking-tight">
          Admin Profile & Credentials
        </h1>
        <p className="text-sm text-[#545454] mt-1">
          Manage administrator identity, credentials, role authorizations, and audit status.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center bg-white rounded-[16px] border border-[#DEDEDE]">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#194866] mb-3" />
          <p className="text-sm text-[#545454]">Loading administrator profile...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Security Card */}
          <div className="p-6 rounded-[16px] bg-white border border-[#DEDEDE] space-y-6 self-start">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-[#194866]/20 bg-[#F2F2F2] flex items-center justify-center">
                {formImageUrl ? (
                  <Image src={formImageUrl} alt="Admin" fill className="object-cover" />
                ) : (
                  <Shield className="h-10 w-10 text-[#194866]" />
                )}
              </div>

              <div>
                <h3 className="font-serif text-lg text-[#194866] font-medium">
                  {profile?.name || "System Administrator"}
                </h3>
                <span className="inline-flex items-center gap-1 mt-1 px-3 py-0.5 rounded-[30px] bg-[#194866] text-white text-[10px] font-bold uppercase tracking-wider">
                  <Lock className="h-3 w-3 text-[#FF9F59]" />
                  Master Admin
                </span>
              </div>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-[#DEDEDE] text-xs text-[#545454]">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#282828]">Email:</span>
                <span className="font-mono">{profile?.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#282828]">Status:</span>
                <span className="px-2 py-0.5 rounded-[30px] bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                  ACTIVE
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#282828]">Permissions:</span>
                <span className="font-medium text-[#194866]">Full Platform Superuser</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#282828]">Passcode:</span>
                <span className="font-mono bg-[#F2F2F2] px-2 py-0.5 rounded-[4px] border border-[#DEDEDE]">
                  •••••• (Protected)
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Edit Profile Form */}
          <div className="md:col-span-2 p-6 rounded-[16px] bg-white border border-[#DEDEDE]">
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <h2 className="font-serif text-lg text-[#194866] font-medium border-b border-[#DEDEDE] pb-3">
                Edit Profile Information
              </h2>

              {successMsg && (
                <div className="p-3 rounded-[4px] bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#282828]">Display Name *</Label>
                  <Input
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="rounded-[4px] border-[#DEDEDE] text-sm"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#282828]">Contact Phone</Label>
                  <Input
                    placeholder="+1 (555) 019-2831"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="rounded-[4px] border-[#DEDEDE] text-sm"
                  />
                </div>
              </div>

              {/* Avatar Upload */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-[#282828]">Profile Avatar Image</Label>
                <div className="flex items-center gap-3">
                  <Input
                    placeholder="https://... or upload below"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    className="rounded-[4px] border-[#DEDEDE] text-xs flex-1"
                  />
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={uploading}
                      className="rounded-[4px] border-[#DEDEDE] text-xs font-semibold gap-1.5 pointer-events-none"
                    >
                      {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UploadCloud className="h-3.5 w-3.5" />}
                      Upload Avatar
                    </Button>
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-[#282828]">Administrator Bio / Role Notes</Label>
                <Textarea
                  placeholder="Master administrator responsible for academic catalog, platform security, and instruction governance."
                  value={formBio}
                  onChange={(e) => setFormBio(e.target.value)}
                  className="rounded-[4px] border-[#DEDEDE] text-sm min-h-[90px]"
                />
              </div>

              <div className="pt-4 border-t border-[#DEDEDE] flex items-center justify-between">
                <div className="text-xs text-[#545454]">
                  Changes immediately apply to the LMS database.
                </div>
                <Button
                  type="submit"
                  disabled={saving || uploading}
                  className="rounded-[40px] px-6 py-2.5 h-auto text-xs font-semibold bg-[#194866] hover:bg-[#194866]/90 text-white shadow-none gap-2"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Profile"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
