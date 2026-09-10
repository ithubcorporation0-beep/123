"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Settings,
  Save,
  Loader2,
  Upload,
  Globe,
  Mail,
  Phone,
  MapPin,
  Share2,
  BookOpen,
  UserCheck,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface AdminSettingsViewProps {
  initialSettings: Record<string, string>;
}

export function AdminSettingsView({ initialSettings }: AdminSettingsViewProps) {
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // LMS Identity
  const [lmsName, setLmsName] = useState(initialSettings.lms_name || "IZBA Learning HUB");
  const [lmsTagline, setLmsTagline] = useState(initialSettings.lms_tagline || "Modern Online Education Platform");
  const [logoUrl, setLogoUrl] = useState(initialSettings.logo_url || "");
  const [faviconUrl, setFaviconUrl] = useState(initialSettings.favicon_url || "");

  // Contact Info
  const [contactEmail, setContactEmail] = useState(initialSettings.contact_email || "support@izba.local");
  const [contactPhone, setContactPhone] = useState(initialSettings.contact_phone || "+1 (555) 019-2834");
  const [address, setAddress] = useState(initialSettings.contact_address || "100 Innovation Way, Tech Park, CA");

  // Social Links
  const [twitterUrl, setTwitterUrl] = useState(initialSettings.social_twitter || "https://twitter.com");
  const [linkedinUrl, setLinkedinUrl] = useState(initialSettings.social_linkedin || "https://linkedin.com");
  const [youtubeUrl, setYoutubeUrl] = useState(initialSettings.social_youtube || "https://youtube.com");
  const [githubUrl, setGithubUrl] = useState(initialSettings.social_github || "https://github.com");

  // Course & Platform Defaults
  const [defaultCurrency, setDefaultCurrency] = useState(initialSettings.default_currency || "USD ($)");
  const [defaultCourseLevel, setDefaultCourseLevel] = useState(initialSettings.default_course_level || "BEGINNER");
  const [allowPublicSignup, setAllowPublicSignup] = useState(initialSettings.allow_public_signup !== "false");
  const [instructorAutoApprove, setInstructorAutoApprove] = useState(initialSettings.instructor_auto_approve === "true");

  // SEO Defaults
  const [siteSeoTitle, setSiteSeoTitle] = useState(initialSettings.seo_site_title || "IZBA Learning HUB — Discover & Master New Skills");
  const [siteSeoDesc, setSiteSeoDesc] = useState(initialSettings.seo_site_desc || "Top-rated courses taught by industry leaders and world-class instructors.");

  const handleUpload = async (file: File, field: "logo" | "favicon") => {
    try {
      setUploadingField(field);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "image");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      if (field === "logo") setLogoUrl(data.url);
      if (field === "favicon") setFaviconUrl(data.url);

      toast.success(`${field} uploaded!`);
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploadingField(null);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        lms_name: lmsName,
        lms_tagline: lmsTagline,
        logo_url: logoUrl,
        favicon_url: faviconUrl,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        contact_address: address,
        social_twitter: twitterUrl,
        social_linkedin: linkedinUrl,
        social_youtube: youtubeUrl,
        social_github: githubUrl,
        default_currency: defaultCurrency,
        default_course_level: defaultCourseLevel,
        allow_public_signup: allowPublicSignup ? "true" : "false",
        instructor_auto_approve: instructorAutoApprove ? "true" : "false",
        seo_site_title: siteSeoTitle,
        seo_site_desc: siteSeoDesc,
      };

      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save settings");

      toast.success("All administrative settings saved successfully! ✨");
    } catch (error: any) {
      toast.error(error.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Save Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-card border shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-foreground">Global LMS Configuration</h2>
          <p className="text-xs text-muted-foreground">
            Changes will take effect across public web pages and user dashboards.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="rounded-xl text-xs font-bold gap-1.5 shadow-xs">
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          Save All Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Branding & Identity */}
        <Card className="rounded-2xl border bg-card p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 border-b pb-3">
            <Globe className="h-4 w-4 text-primary" />
            <h3 className="font-bold text-sm text-foreground">Platform Branding & Logos</h3>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">LMS Name *</label>
            <Input
              value={lmsName}
              onChange={(e) => setLmsName(e.target.value)}
              className="rounded-xl text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Tagline</label>
            <Input
              value={lmsTagline}
              onChange={(e) => setLmsTagline(e.target.value)}
              className="rounded-xl text-sm"
            />
          </div>

          {/* Logo Upload */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold flex items-center justify-between">
              <span>Main Brand Logo</span>
              {uploadingField === "logo" && (
                <span className="text-[10px] text-primary flex items-center gap-1 font-medium">
                  <Loader2 className="h-3 w-3 animate-spin" /> Uploading...
                </span>
              )}
            </label>
            <div className="flex gap-2">
              <Input
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://... or upload"
                className="rounded-xl text-xs"
              />
              <label className="cursor-pointer shrink-0">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUpload(f, "logo");
                  }}
                />
                <div className="h-9 px-3 rounded-xl border bg-card hover:bg-muted text-xs font-medium flex items-center gap-1.5">
                  <Upload className="h-3.5 w-3.5" />
                </div>
              </label>
            </div>
            {logoUrl && (
              <div className="relative w-28 h-8 rounded-lg border bg-muted p-1">
                <Image src={logoUrl} alt="Logo" fill unoptimized className="object-contain" />
              </div>
            )}
          </div>

          {/* Favicon */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold">Favicon Icon URL</label>
            <div className="flex gap-2">
              <Input
                value={faviconUrl}
                onChange={(e) => setFaviconUrl(e.target.value)}
                placeholder="https://... or upload"
                className="rounded-xl text-xs"
              />
              <label className="cursor-pointer shrink-0">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUpload(f, "favicon");
                  }}
                />
                <div className="h-9 px-3 rounded-xl border bg-card hover:bg-muted text-xs font-medium flex items-center gap-1.5">
                  <Upload className="h-3.5 w-3.5" />
                </div>
              </label>
            </div>
          </div>
        </Card>

        {/* Card 2: Contact & Support Information */}
        <Card className="rounded-2xl border bg-card p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 border-b pb-3">
            <Mail className="h-4 w-4 text-primary" />
            <h3 className="font-bold text-sm text-foreground">Contact & Support Details</h3>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Contact Email</label>
            <Input
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="rounded-xl text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Contact Phone</label>
            <Input
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="rounded-xl text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Campus / Business Address</label>
            <Textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="rounded-xl text-sm"
            />
          </div>
        </Card>

        {/* Card 3: Social Media Links */}
        <Card className="rounded-2xl border bg-card p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 border-b pb-3">
            <Share2 className="h-4 w-4 text-primary" />
            <h3 className="font-bold text-sm text-foreground">Social Media Accounts</h3>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Twitter / X URL</label>
            <Input
              value={twitterUrl}
              onChange={(e) => setTwitterUrl(e.target.value)}
              className="rounded-xl text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">LinkedIn Profile / Page</label>
            <Input
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="rounded-xl text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">YouTube Channel</label>
            <Input
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="rounded-xl text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">GitHub Repository</label>
            <Input
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="rounded-xl text-xs font-mono"
            />
          </div>
        </Card>

        {/* Card 4: Defaults & SEO */}
        <Card className="rounded-2xl border bg-card p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 border-b pb-3">
            <BookOpen className="h-4 w-4 text-primary" />
            <h3 className="font-bold text-sm text-foreground">Course Defaults & Global SEO</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Platform Currency</label>
              <Input
                value={defaultCurrency}
                onChange={(e) => setDefaultCurrency(e.target.value)}
                className="rounded-xl text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Default Course Level</label>
              <select
                value={defaultCourseLevel}
                onChange={(e) => setDefaultCourseLevel(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border bg-background text-xs"
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
                <option value="ALL_LEVELS">All Levels</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold">Global SEO Title</label>
            <Input
              value={siteSeoTitle}
              onChange={(e) => setSiteSeoTitle(e.target.value)}
              className="rounded-xl text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Global SEO Meta Description</label>
            <Textarea
              value={siteSeoDesc}
              onChange={(e) => setSiteSeoDesc(e.target.value)}
              rows={3}
              className="rounded-xl text-xs"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
