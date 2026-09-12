"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Award,
  Search,
  Plus,
  Settings,
  Save,
  Loader2,
  Upload,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export interface IssuedCertificate {
  id: string;
  certificateCode: string;
  issuedAt: Date | string;
  status: string;
  profile: { id: string; name: string | null; email: string };
  course: { id: string; title: string; slug: string };
}

interface CertificateManagementViewProps {
  initialCertificates: IssuedCertificate[];
  initialSettings: Record<string, string>;
  allCourses: { id: string; title: string }[];
  allStudents: { id: string; name: string | null; email: string }[];
}

export function CertificateManagementView({
  initialCertificates,
  initialSettings,
  allCourses,
  allStudents,
}: CertificateManagementViewProps) {
  const [activeTab, setActiveTab] = useState<"issued" | "settings">("issued");
  const [certificates, setCertificates] = useState<IssuedCertificate[]>(initialCertificates);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  // Issue Certificate Dialog
  const [isIssueOpen, setIsIssueOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(allStudents[0]?.id || "");
  const [selectedCourseId, setSelectedCourseId] = useState(allCourses[0]?.id || "");

  // Settings state
  const [certTitle, setCertTitle] = useState(initialSettings.cert_title || "Certificate of Completion");
  const [certIssuer, setCertIssuer] = useState(initialSettings.cert_issuer || "IZBA Learning HUB");
  const [certSignTitle, setCertSignTitle] = useState(initialSettings.cert_signature_title || "Academic Director");
  const [certLogo, setCertLogo] = useState(initialSettings.cert_logo_url || "");
  const [certEnabled, setCertEnabled] = useState(initialSettings.cert_enabled !== "false");

  const filteredCerts = certificates.filter((c) => {
    const q = search.toLowerCase();
    const code = c.certificateCode || "";
    const profileName = c.profile?.name || "";
    const profileEmail = c.profile?.email || "";
    const courseTitle = c.course?.title || "";

    return (
      code.toLowerCase().includes(q) ||
      profileName.toLowerCase().includes(q) ||
      profileEmail.toLowerCase().includes(q) ||
      courseTitle.toLowerCase().includes(q)
    );
  });

  const handleIssueCertificate = async () => {
    if (!selectedStudentId || !selectedCourseId) {
      toast.error("Select both student and course");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch("/api/admin/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: selectedStudentId,
          courseId: selectedCourseId,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to issue certificate");
      }

      const issued = await res.json();
      setCertificates((prev) => [issued, ...prev]);
      setIsIssueOpen(false);
      toast.success("Certificate issued successfully! 🏆");
    } catch (error: any) {
      toast.error(error.message || "Failed to issue certificate");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/admin/certificates/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cert_title: certTitle,
          cert_issuer: certIssuer,
          cert_signature_title: certSignTitle,
          cert_logo_url: certLogo,
          cert_enabled: certEnabled ? "true" : "false",
        }),
      });

      if (!res.ok) throw new Error("Failed to save settings");

      toast.success("Certificate template configuration saved! ✨");
    } catch (error: any) {
      toast.error(error.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <Button
          variant={activeTab === "issued" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("issued")}
          className="rounded-[10px] text-xs gap-1.5 font-bold bg-primary text-primary-foreground"
        >
          <Award className="h-3.5 w-3.5" />
          Issued Certificates ({certificates.length})
        </Button>
        <Button
          variant={activeTab === "settings" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("settings")}
          className="rounded-[10px] text-xs gap-1.5 font-bold"
        >
          <Settings className="h-3.5 w-3.5" />
          Template & Design Settings
        </Button>
      </div>

      {activeTab === "issued" ? (
        <div className="space-y-4">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-[10px] bg-card border border-border shadow-xs">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search certificate code, student, course..."
                className="pl-8 h-8 rounded-[10px] text-xs bg-background border-border"
              />
            </div>

            <Button
              onClick={() => setIsIssueOpen(true)}
              size="sm"
              className="rounded-[10px] text-xs gap-1.5 font-bold shadow-xs shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-250 hover:-translate-y-[2px] hover:shadow-[0_0_6px_1px_rgba(23,121,186,0.4)]"
            >
              <Plus className="h-3.5 w-3.5" />
              Issue Certificate
            </Button>
          </div>

          {/* Table */}
          <div className="rounded-[10px] border border-border overflow-hidden bg-card shadow-xs">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="text-xs font-bold text-foreground">Certificate Code</TableHead>
                  <TableHead className="text-xs font-bold text-foreground">Recipient</TableHead>
                  <TableHead className="text-xs font-bold text-foreground">Course Completed</TableHead>
                  <TableHead className="text-xs font-bold text-foreground">Date Issued</TableHead>
                  <TableHead className="text-xs font-bold text-foreground">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCerts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-xs text-muted-foreground">
                      No issued certificates found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCerts.map((c) => {
                    const dateFormatted = c.issuedAt
                      ? new Date(c.issuedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Recent";

                    return (
                      <TableRow key={c.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="py-3.5 font-mono text-xs font-bold text-primary">
                          {c.certificateCode}
                        </TableCell>

                        <TableCell className="py-3.5 text-xs">
                          <p className="font-bold text-foreground">{c.profile?.name || "Student"}</p>
                          <p className="text-[11px] text-muted-foreground">{c.profile?.email || ""}</p>
                        </TableCell>

                        <TableCell className="py-3.5 text-xs font-semibold text-foreground">
                          {c.course?.title || "Course"}
                        </TableCell>

                        <TableCell className="py-3.5 text-xs text-muted-foreground">
                          {dateFormatted}
                        </TableCell>

                        <TableCell className="py-3.5">
                          <Badge variant="default" className="text-[10px] uppercase font-bold bg-emerald-600 rounded-[10px]">
                            {c.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        /* Settings Tab */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Settings Form */}
          <Card className="rounded-[10px] border border-border bg-card p-6 space-y-4 shadow-xs">
            <h3 className="font-bold text-base text-foreground">Certificate Configuration</h3>

            <div
              onClick={() => setCertEnabled(!certEnabled)}
              className={`p-3.5 rounded-[10px] border cursor-pointer flex items-center justify-between transition-colors ${
                certEnabled ? "bg-primary/5 border-primary/40" : "bg-muted/20 border-border"
              }`}
            >
              <div>
                <p className="text-xs font-bold">Certificate Issuance Enabled</p>
                <p className="text-[10px] text-muted-foreground">Allow students to receive verified certificates</p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  certEnabled ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/40"
                }`}
              >
                {certEnabled && <CheckCircle2 className="h-3.5 w-3.5" />}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Certificate Title</label>
              <Input
                value={certTitle}
                onChange={(e) => setCertTitle(e.target.value)}
                className="rounded-[10px] text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Issuing Organization / Academy Name</label>
              <Input
                value={certIssuer}
                onChange={(e) => setCertIssuer(e.target.value)}
                className="rounded-[10px] text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Signatory Title</label>
              <Input
                value={certSignTitle}
                onChange={(e) => setCertSignTitle(e.target.value)}
                className="rounded-[10px] text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Certificate Logo URL</label>
              <Input
                value={certLogo}
                onChange={(e) => setCertLogo(e.target.value)}
                placeholder="https://... logo URL"
                className="rounded-[10px] text-sm"
              />
            </div>

            <div className="pt-3 border-t">
              <Button onClick={handleSaveSettings} disabled={saving} className="rounded-[10px] text-xs font-bold gap-1.5 shadow-xs bg-primary hover:bg-primary/90 text-primary-foreground">
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                Save Certificate Settings
              </Button>
            </div>
          </Card>

          {/* Certificate Live Preview */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Live Certificate Preview
            </h3>
            <div className="rounded-[10px] border-4 border-amber-600/30 p-8 bg-amber-500/5 text-center space-y-4 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-center">
                <Award className="h-12 w-12 text-amber-600" />
              </div>

              <div>
                <p className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground">
                  {certIssuer}
                </p>
                <h2 className="text-2xl font-serif font-extrabold text-foreground mt-1">
                  {certTitle}
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  This certifies that
                </p>
                <p className="text-lg font-bold text-primary mt-1 border-b border-muted-foreground/30 inline-block px-4 pb-0.5">
                  Jane Doe (Sample Student)
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  has successfully completed all requirements for
                </p>
                <p className="text-sm font-extrabold text-foreground mt-0.5">
                  Master Course Curriculum
                </p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-muted-foreground/20 text-xs text-muted-foreground">
                <div className="text-left">
                  <p className="font-mono text-[10px]">CODE: CERT-SAMPLE-2026</p>
                  <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> Authenticated
                  </p>
                </div>
                <div className="text-right">
                  <p className="border-t border-foreground/50 pt-1 font-semibold text-[11px] text-foreground">
                    {certSignTitle}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Issue Certificate Modal --- */}
      <Dialog open={isIssueOpen} onOpenChange={setIsIssueOpen}>
        <DialogContent className="rounded-[10px] max-w-md">
          <DialogHeader>
            <DialogTitle>Issue Verified Certificate</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Select Student</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full h-10 px-3 rounded-[10px] border border-border bg-background text-sm"
              >
                {allStudents.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name || s.email} ({s.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Select Course</label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full h-10 px-3 rounded-[10px] border border-border bg-background text-sm"
              >
                {allCourses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsIssueOpen(false)} className="rounded-[10px]">
              Cancel
            </Button>
            <Button onClick={handleIssueCertificate} disabled={saving} className="rounded-[10px] font-bold bg-primary hover:bg-primary/90 text-primary-foreground">
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
              Issue Certificate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
