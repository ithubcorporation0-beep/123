"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Upload,
  Search,
  Trash2,
  Copy,
  ExternalLink,
  FileText,
  Video,
  Image as ImageIcon,
  File,
  Check,
  Loader2,
  X,
  Eye,
  Calendar,
  HardDrive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export interface MediaRecord {
  id: string;
  name: string;
  url: string;
  publicId?: string | null;
  type: string; // image, video, pdf, document
  size?: number | null;
  mimeType?: string | null;
  createdAt: Date | string;
}

interface MediaLibraryManagerProps {
  initialItems: MediaRecord[];
}

export function MediaLibraryManager({ initialItems }: MediaLibraryManagerProps) {
  const [items, setItems] = useState<MediaRecord[]>(initialItems);
  const [activeType, setActiveType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Upload state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState<string>("image");

  // Preview state
  const [previewItem, setPreviewItem] = useState<MediaRecord | null>(null);

  const filteredItems = items.filter((item) => {
    const matchesType = activeType === "all" || item.type === activeType;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleCopyUrl = (item: MediaRecord) => {
    const fullUrl = item.url.startsWith("http")
      ? item.url
      : `${window.location.origin}${item.url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(item.id);
    toast.success("File URL copied to clipboard! 📋");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("type", uploadType);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }

      const createdItem = await res.json();
      setItems((prev) => [createdItem, ...prev]);
      setIsUploadOpen(false);
      setSelectedFile(null);
      toast.success("File uploaded and added to Media Library!");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/media/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete media item");

      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("File deleted from library");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete file");
    }
  };

  const formatFileSize = (bytes?: number | null) => {
    if (!bytes) return "Unknown size";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-4 w-4 text-emerald-500" />;
      case "video":
        return <Video className="h-4 w-4 text-blue-500" />;
      case "pdf":
        return <FileText className="h-4 w-4 text-rose-500" />;
      default:
        return <File className="h-4 w-4 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-card border shadow-xs">
        {/* Type Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {["all", "image", "video", "pdf", "document"].map((t) => (
            <Button
              key={t}
              variant={activeType === t ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveType(t)}
              className="rounded-xl text-xs capitalize h-8 font-medium"
            >
              {t === "all" ? "All Files" : `${t}s`}
            </Button>
          ))}
        </div>

        {/* Search & Upload */}
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files by name..."
              className="pl-8 pr-8 h-8 rounded-xl text-xs bg-background"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <Button
            onClick={() => setIsUploadOpen(true)}
            size="sm"
            className="rounded-xl text-xs gap-1.5 font-bold shadow-xs shrink-0"
          >
            <Upload className="h-3.5 w-3.5" />
            Upload File
          </Button>
        </div>
      </div>

      {/* Media Items Grid */}
      {filteredItems.length === 0 ? (
        <Card className="rounded-2xl border p-12 text-center bg-card">
          <div className="max-w-sm mx-auto space-y-3">
            <HardDrive className="h-10 w-10 text-muted-foreground mx-auto" />
            <h3 className="text-base font-bold">No Media Files Found</h3>
            <p className="text-xs text-muted-foreground">
              {searchQuery
                ? "No media files match your search query."
                : "Upload course thumbnails, banners, videos, or PDFs to manage them from one central library."}
            </p>
            <Button
              onClick={() => setIsUploadOpen(true)}
              size="sm"
              className="rounded-xl text-xs gap-1.5 font-bold"
            >
              <Upload className="h-3.5 w-3.5" />
              Upload First Media
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="rounded-2xl border bg-card shadow-xs overflow-hidden flex flex-col justify-between group hover:border-primary/40 hover:shadow-md transition-all"
            >
              {/* Preview Thumbnail Container */}
              <div
                onClick={() => setPreviewItem(item)}
                className="relative w-full h-36 bg-muted/50 border-b flex items-center justify-center cursor-pointer overflow-hidden"
              >
                {item.type === "image" ? (
                  <Image
                    src={item.url}
                    alt={item.name}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : item.type === "video" ? (
                  <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
                    <Video className="h-8 w-8 text-blue-500" />
                    <span className="text-[10px] uppercase font-mono font-bold">Video File</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
                    {getTypeIcon(item.type)}
                    <span className="text-[10px] uppercase font-mono font-bold">
                      {item.type === "pdf" ? "PDF Document" : "Attachment"}
                    </span>
                  </div>
                )}

                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="text-[9px] uppercase font-bold py-0.5 px-1.5 shadow-xs">
                    {item.type}
                  </Badge>
                </div>
              </div>

              {/* Item Info and Actions */}
              <CardContent className="p-3.5 space-y-2">
                <div>
                  <h4 className="text-xs font-bold text-foreground truncate" title={item.name}>
                    {item.name}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-1">
                    <span>{formatFileSize(item.size)}</span>
                    <span>
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyUrl(item)}
                    className="h-7 px-2 text-[11px] rounded-lg gap-1 flex-1 font-medium"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600" />
                        <span className="text-emerald-600 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setPreviewItem(item)}
                    className="h-7 w-7 rounded-lg"
                    title="View Preview"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>

                  <ConfirmModal
                    onConfirm={() => handleDeleteItem(item.id)}
                    title="Delete Media Item"
                    description={`Permanently delete "${item.name}" from library?`}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-lg text-destructive hover:text-destructive"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </ConfirmModal>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* --- Upload Modal --- */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle>Upload File to Media Library</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Media Type</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { key: "image", label: "Image" },
                  { key: "video", label: "Video" },
                  { key: "pdf", label: "PDF" },
                  { key: "document", label: "Doc" },
                ].map((t) => (
                  <Button
                    key={t.key}
                    type="button"
                    variant={uploadType === t.key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setUploadType(t.key)}
                    className="rounded-xl text-xs capitalize h-8"
                  >
                    {t.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Select File *</label>
              <label className="border-2 border-dashed rounded-2xl p-6 text-center block cursor-pointer hover:border-primary/50 transition-colors bg-muted/20">
                <input
                  type="file"
                  accept={
                    uploadType === "image"
                      ? "image/*"
                      : uploadType === "video"
                      ? "video/*"
                      : uploadType === "pdf"
                      ? ".pdf"
                      : "*/*"
                  }
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setSelectedFile(f);
                  }}
                />
                <Upload className="h-8 w-8 text-primary mx-auto mb-2" />
                {selectedFile ? (
                  <div>
                    <p className="text-xs font-bold text-foreground truncate">{selectedFile.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-semibold text-foreground">Click to browse or drop file</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Images (15MB), Videos (100MB), PDFs (30MB)
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsUploadOpen(false);
                setSelectedFile(null);
              }}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUploadSubmit}
              disabled={uploading || !selectedFile}
              className="rounded-xl font-bold"
            >
              {uploading && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
              Upload to Library
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- Preview Modal --- */}
      <Dialog open={Boolean(previewItem)} onOpenChange={(open) => !open && setPreviewItem(null)}>
        <DialogContent className="rounded-2xl max-w-2xl">
          <DialogHeader>
            <DialogTitle className="truncate pr-4">{previewItem?.name}</DialogTitle>
          </DialogHeader>

          {previewItem && (
            <div className="space-y-4 py-2">
              <div className="rounded-xl overflow-hidden border bg-muted flex items-center justify-center min-h-[250px] max-h-[400px]">
                {previewItem.type === "image" ? (
                  <div className="relative w-full h-[350px]">
                    <Image
                      src={previewItem.url}
                      alt={previewItem.name}
                      fill
                      unoptimized
                      className="object-contain"
                    />
                  </div>
                ) : previewItem.type === "video" ? (
                  <video src={previewItem.url} controls className="w-full max-h-[350px]" />
                ) : (
                  <div className="p-8 text-center space-y-2">
                    <FileText className="h-16 w-16 text-primary mx-auto" />
                    <p className="text-sm font-semibold">{previewItem.name}</p>
                    <a
                      href={previewItem.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary underline font-bold"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open file in new tab
                    </a>
                  </div>
                )}
              </div>

              <div className="p-3 rounded-xl border bg-muted/20 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-semibold">Direct URL:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyUrl(previewItem)}
                    className="h-6 text-[11px] font-bold"
                  >
                    Copy
                  </Button>
                </div>
                <p className="font-mono text-[11px] text-foreground truncate">{previewItem.url}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewItem(null)} className="rounded-xl">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
