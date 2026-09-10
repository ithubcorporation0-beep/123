"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Globe,
  Plus,
  Save,
  Trash2,
  Edit2,
  Upload,
  Loader2,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmModal } from "@/components/shared/ConfirmModal";

export interface ContentBlock {
  id: string;
  section: string;
  key: string;
  title?: string | null;
  subtitle?: string | null;
  content?: string | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
  linkUrl?: string | null;
  linkText?: string | null;
  isPublished: boolean;
  position: number;
}

interface WebsiteContentManagerProps {
  initialBlocks: ContentBlock[];
}

export function WebsiteContentManager({ initialBlocks }: WebsiteContentManagerProps) {
  const [blocks, setBlocks] = useState<ContentBlock[]>(initialBlocks);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Dialog State
  const [isOpen, setIsOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);

  // Form State
  const [key, setKey] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  const sections = [
    { key: "hero", label: "Homepage Hero" },
    { key: "about", label: "About Section" },
    { key: "features", label: "Features & Services" },
    { key: "testimonials", label: "Testimonials" },
    { key: "faq", label: "FAQ Items" },
    { key: "contact", label: "Contact Info" },
    { key: "footer", label: "Footer Content" },
  ];

  const currentSectionBlocks = blocks.filter((b) => b.section === activeSection);

  const openCreateDialog = () => {
    setEditingBlock(null);
    setKey(`${activeSection}_${Date.now()}`);
    setTitle("");
    setSubtitle("");
    setContent("");
    setImageUrl("");
    setVideoUrl("");
    setLinkUrl("");
    setLinkText("");
    setIsPublished(true);
    setIsOpen(true);
  };

  const openEditDialog = (b: ContentBlock) => {
    setEditingBlock(b);
    setKey(b.key);
    setTitle(b.title || "");
    setSubtitle(b.subtitle || "");
    setContent(b.content || "");
    setImageUrl(b.imageUrl || "");
    setVideoUrl(b.videoUrl || "");
    setLinkUrl(b.linkUrl || "");
    setLinkText(b.linkText || "");
    setIsPublished(b.isPublished);
    setIsOpen(true);
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "image");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setImageUrl(data.url);
      toast.success("Image uploaded!");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!key.trim()) {
      toast.error("Unique key is required");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: activeSection,
          key,
          title,
          subtitle,
          content,
          imageUrl,
          videoUrl,
          linkUrl,
          linkText,
          isPublished,
        }),
      });

      if (!res.ok) throw new Error("Failed to save block");
      const saved = await res.json();

      setBlocks((prev) => {
        const index = prev.findIndex((b) => b.id === saved.id || b.key === saved.key);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = saved;
          return updated;
        }
        return [...prev, saved];
      });

      setIsOpen(false);
      toast.success("Content saved! Changes are live on the website.");
    } catch (error: any) {
      toast.error(error.message || "Failed to save block");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/content/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete content block");

      setBlocks((prev) => prev.filter((b) => b.id !== id));
      toast.success("Content block removed");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete block");
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Filter Pills */}
      <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-card border shadow-xs">
        {sections.map((s) => (
          <Button
            key={s.key}
            variant={activeSection === s.key ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveSection(s.key)}
            className="rounded-xl text-xs font-semibold h-8"
          >
            {s.label}
          </Button>
        ))}
      </div>

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-card border shadow-xs">
        <div>
          <h3 className="text-sm font-bold text-foreground capitalize">
            {sections.find((s) => s.key === activeSection)?.label} Items
          </h3>
          <p className="text-xs text-muted-foreground">
            Edit text, headings, and images directly displayed across the public portal.
          </p>
        </div>

        <Button onClick={openCreateDialog} size="sm" className="rounded-xl text-xs gap-1.5 font-bold shadow-xs">
          <Plus className="h-3.5 w-3.5" />
          Add Content Block
        </Button>
      </div>

      {/* Blocks List */}
      {currentSectionBlocks.length === 0 ? (
        <Card className="rounded-2xl border p-10 text-center bg-card">
          <div className="max-w-sm mx-auto space-y-3">
            <Globe className="h-10 w-10 text-muted-foreground mx-auto" />
            <h3 className="text-base font-bold">No Custom Content Blocks Yet</h3>
            <p className="text-xs text-muted-foreground">
              Add a content block to override default static website text with dynamic CMS values.
            </p>
            <Button onClick={openCreateDialog} size="sm" className="rounded-xl text-xs gap-1.5 font-bold">
              <Plus className="h-3.5 w-3.5" />
              Add First Block
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentSectionBlocks.map((b) => (
            <Card key={b.id} className="rounded-2xl border bg-card p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="font-mono text-[10px]">
                  {b.key}
                </Badge>
                <div className="flex items-center gap-1.5">
                  <Badge variant={b.isPublished ? "default" : "secondary"} className="text-[10px] uppercase font-bold">
                    {b.isPublished ? "Published" : "Draft"}
                  </Badge>
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(b)} className="h-7 w-7 rounded-lg">
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                  <ConfirmModal
                    onConfirm={() => handleDelete(b.id)}
                    title="Delete Content Block"
                    description={`Delete "${b.title || b.key}"?`}
                  >
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-destructive hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </ConfirmModal>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-foreground">{b.title || "Untitled Block"}</h4>
                {b.subtitle && <p className="text-xs text-muted-foreground font-medium mt-0.5">{b.subtitle}</p>}
                {b.content && <p className="text-xs text-muted-foreground mt-1 line-clamp-3 leading-relaxed">{b.content}</p>}
              </div>

              {b.imageUrl && (
                <div className="relative w-full h-32 rounded-xl overflow-hidden border bg-muted">
                  <Image src={b.imageUrl} alt={b.title || "Content Image"} fill unoptimized className="object-cover" />
                </div>
              )}

              {b.linkUrl && (
                <div className="text-[11px] text-primary underline truncate font-medium">
                  Link: {b.linkText || b.linkUrl} ({b.linkUrl})
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* --- Add / Edit Dialog --- */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="rounded-2xl max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBlock ? "Edit Content Block" : "Add Content Block"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Unique Key Identifier *</label>
              <Input
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="e.g. hero_headline or about_story"
                className="rounded-xl text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Title / Headline</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Section main heading"
                className="rounded-xl text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Subtitle / Tagline</label>
              <Input
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Secondary heading or badge label"
                className="rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Text Content / Description</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Body text or markdown content..."
                rows={4}
                className="rounded-xl text-sm"
              />
            </div>

            {/* Media Image Upload */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold flex items-center justify-between">
                <span>Associated Image URL</span>
                {uploading && (
                  <span className="text-[10px] text-primary flex items-center gap-1 font-medium">
                    <Loader2 className="h-3 w-3 animate-spin" /> Uploading...
                  </span>
                )}
              </label>
              <div className="flex gap-2">
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... or upload photo"
                  className="rounded-xl text-xs"
                />
                <label className="cursor-pointer shrink-0">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleImageUpload(f);
                    }}
                  />
                  <div className="h-9 px-3 rounded-xl border bg-card hover:bg-muted text-xs font-medium flex items-center gap-1.5">
                    <Upload className="h-3.5 w-3.5" />
                  </div>
                </label>
              </div>
            </div>

            {/* CTA Button Link */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Button / Link Label</label>
                <Input
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="e.g. Explore Courses"
                  className="rounded-xl text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Button URL</label>
                <Input
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="e.g. /courses or /about"
                  className="rounded-xl text-xs"
                />
              </div>
            </div>

            {/* Publication Toggle */}
            <div
              onClick={() => setIsPublished(!isPublished)}
              className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-colors ${
                isPublished ? "bg-primary/5 border-primary/40" : "bg-muted/20"
              }`}
            >
              <div>
                <p className="text-xs font-bold">Published Live</p>
                <p className="text-[10px] text-muted-foreground">Display this content on public website</p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  isPublished ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/40"
                }`}
              >
                {isPublished && <CheckCircle2 className="h-3.5 w-3.5" />}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading} className="rounded-xl font-bold">
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
              Save Block
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
