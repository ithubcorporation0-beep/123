"use client";

import { useState, useEffect, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Code2,
  Globe,
  TrendingUp,
  Palette,
  ShoppingCart,
  Send,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

const SERVICES_LIST = [
  { id: "software-solutions", label: "Software Solutions", icon: Code2 },
  { id: "website-solutions", label: "Website Solutions", icon: Globe },
  { id: "digital-marketing", label: "Digital Marketing", icon: TrendingUp },
  { id: "graphic-design", label: "Graphic Design", icon: Palette },
  { id: "ecommerce-solutions", label: "E-Commerce Solutions", icon: ShoppingCart },
  { id: "custom-suite", label: "Custom Full-Stack Suite", icon: Sparkles },
];

const BUDGET_OPTIONS = [
  "Under $1,500",
  "$1,500 - $4,000",
  "$4,000 - $10,000",
  "$10,000 - $25,000",
  "$25,000+",
];

const TIMELINE_OPTIONS = [
  "Urgent (< 2 weeks)",
  "Standard (3 - 5 weeks)",
  "Flexible (2 - 3 months)",
  "Ongoing Retainer / Partnership",
];

export function ServiceInquiryForm() {
  const searchParams = useSearchParams();
  const [selectedService, setSelectedService] = useState<string>("software-solutions");
  const [selectedBudget, setSelectedBudget] = useState<string>("$1,500 - $4,000");
  const [selectedTimeline, setSelectedTimeline] = useState<string>("Standard (3 - 5 weeks)");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [isPending, startTransition] = useTransition();
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const inquireParam = searchParams.get("inquire");
    if (inquireParam) {
      const match = SERVICES_LIST.find((s) => s.id === inquireParam);
      if (match) {
        setSelectedService(match.id);
      }
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please provide a valid email address.");
      return;
    }
    if (!message.trim() || message.length < 10) {
      toast.error("Please describe your project in at least 10 characters.");
      return;
    }

    startTransition(async () => {
      try {
        const serviceLabel =
          SERVICES_LIST.find((s) => s.id === selectedService)?.label || selectedService;

        const res = await fetch("/api/services/inquiry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: fullName,
            email,
            phone,
            service: serviceLabel,
            budget: selectedBudget,
            timeline: selectedTimeline,
            message,
          }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setIsSubmitted(true);
          toast.success(
            "Service inquiry received! Our technical team will reach out within 24 hours."
          );
        } else {
          toast.error(data.message || "Failed to submit inquiry. Please try again.");
        }
      } catch (err) {
        console.error("Inquiry submission error:", err);
        toast.error("Network error. Please try again or email us directly at support@izba.app.");
      }
    });
  };

  return (
    <div id="inquiry-form" className="scroll-mt-24">
      {isSubmitted ? (
        <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-8 sm:p-12 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div className="space-y-2 max-w-lg mx-auto">
            <h3 className="text-2xl font-bold text-foreground">Inquiry Received Successfully!</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Thank you, <span className="font-semibold text-foreground">{fullName}</span>. We have
              logged your request for{" "}
              <span className="font-semibold text-primary">
                {SERVICES_LIST.find((s) => s.id === selectedService)?.label}
              </span>
              . Our solutions architect will review your project requirements and reply to{" "}
              <span className="font-semibold text-foreground">{email}</span> within 24 hours.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setIsSubmitted(false);
              setMessage("");
            }}
            className="rounded-full font-semibold"
          >
            Submit Another Project Inquiry
          </Button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl p-6 sm:p-10 shadow-2xl space-y-8"
        >
          {/* Step 1: Select Service */}
          <div className="space-y-3">
            <Label className="text-sm font-bold text-foreground">
              1. Choose IT Service Required <span className="text-primary">*</span>
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {SERVICES_LIST.map((srv) => {
                const Icon = srv.icon;
                const isSelected = selectedService === srv.id;
                return (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => setSelectedService(srv.id)}
                    className={`flex items-center gap-2.5 p-3 sm:p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                        : "border-border/60 bg-background/50 hover:bg-muted/70 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="truncate">{srv.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Budget & Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-sm font-bold text-foreground">
                2. Estimated Budget Range
              </Label>
              <div className="flex flex-wrap gap-2">
                {BUDGET_OPTIONS.map((bg) => (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => setSelectedBudget(bg)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      selectedBudget === bg
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border/60 bg-background hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-bold text-foreground">
                3. Expected Timeline
              </Label>
              <div className="flex flex-wrap gap-2">
                {TIMELINE_OPTIONS.map((tm) => (
                  <button
                    key={tm}
                    type="button"
                    onClick={() => setSelectedTimeline(tm)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      selectedTimeline === tm
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border/60 bg-background hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    {tm}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 3: Contact Info */}
          <div className="space-y-4 pt-4 border-t border-border/60">
            <Label className="text-sm font-bold text-foreground">
              4. Contact & Project Specifications <span className="text-primary">*</span>
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="srv-name" className="text-xs text-muted-foreground">
                  Your Full Name
                </Label>
                <Input
                  id="srv-name"
                  placeholder="e.g. Sarah Jenkins"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="srv-email" className="text-xs text-muted-foreground">
                  Work / Personal Email
                </Label>
                <Input
                  id="srv-email"
                  type="email"
                  placeholder="sarah@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="srv-phone" className="text-xs text-muted-foreground">
                  Phone / WhatsApp (Optional)
                </Label>
                <Input
                  id="srv-phone"
                  placeholder="+1 (555) 019-2834"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <Label htmlFor="srv-message" className="text-xs text-muted-foreground">
                Describe your goals, requirements, or reference links
              </Label>
              <Textarea
                id="srv-message"
                placeholder="Share your deliverables, tech stack preference, existing challenges, or current site URL..."
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="rounded-xl resize-none"
              />
            </div>
          </div>

          {/* Submission and Trust Guarantees */}
          <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>Strict Non-Disclosure (NDA)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-indigo-500" />
                <span>Response in &lt;24 hours</span>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              size="lg"
              className="w-full sm:w-auto px-8 rounded-full font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-xl shadow-indigo-500/25 gap-2"
            >
              {isPending ? (
                <span>Submitting Project Brief...</span>
              ) : (
                <>
                  <span>Request Custom Proposal</span>
                  <Send className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
