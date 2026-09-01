"use client";

import { useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, ExternalLink, Printer, ShieldCheck, Sparkles } from "lucide-react";

export interface CertificateData {
  id: string;
  certificateCode: string;
  issuedAt: Date | string;
  studentName: string;
  courseTitle: string;
  instructorName: string;
}

interface CertificateCardProps {
  certificate: CertificateData;
}

export function CertificateCard({ certificate }: CertificateCardProps) {
  const certificateRef = useRef<HTMLDivElement>(null);

  const formattedDate = new Date(certificate.issuedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const verifyUrl = `/verify/${certificate.certificateCode}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Action Header */}
      <div className="flex items-center justify-between no-print">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-mono font-bold tracking-wider">
            {certificate.certificateCode}
          </Badge>
          <Badge variant="secondary" className="gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verified Credential
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Link href={verifyUrl} target="_blank">
            <Button variant="ghost" size="sm" className="rounded-xl text-xs gap-1.5 h-9">
              <ExternalLink className="h-3.5 w-3.5" />
              Public Link
            </Button>
          </Link>
          <Button
            onClick={handlePrint}
            variant="default"
            size="sm"
            className="rounded-xl text-xs gap-1.5 font-bold shadow-xs h-9"
          >
            <Printer className="h-3.5 w-3.5" />
            Download / Print PDF
          </Button>
        </div>
      </div>

      {/* Printable Certificate Frame */}
      <div
        ref={certificateRef}
        id={`certificate-${certificate.certificateCode}`}
        className="certificate-container relative bg-white text-slate-900 border-8 border-double border-amber-600/60 rounded-3xl p-8 sm:p-12 md:p-16 shadow-xl aspect-[1.414/1] flex flex-col justify-between overflow-hidden select-none print:m-0 print:border-8 print:shadow-none print:rounded-none"
      >
        {/* Subtle Background Watermark & Corner Ornaments */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-600/40 rounded-tl-xl pointer-events-none" />
        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-600/40 rounded-tr-xl pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-600/40 rounded-bl-xl pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-600/40 rounded-br-xl pointer-events-none" />

        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <Award className="w-96 h-96 text-amber-950" />
        </div>

        {/* Certificate Top Header */}
        <div className="text-center space-y-2 relative z-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-extrabold text-sm shadow-xs">
              E
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              IZBA Learning HUB
            </span>
          </div>

          <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-amber-700 font-bold">
            Certificate of Completion
          </p>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mt-1" />
        </div>

        {/* Certificate Body: Student Name & Course */}
        <div className="text-center space-y-4 my-auto relative z-10 py-4">
          <p className="text-xs sm:text-sm text-slate-500 italic font-serif">
            This is proudly presented to
          </p>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight capitalize">
            {certificate.studentName}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            for successfully completing all curriculum requirements, interactive lectures, and lessons for
          </p>

          <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-primary tracking-tight">
            {certificate.courseTitle}
          </h3>
        </div>

        {/* Certificate Footer: Signatures & Verification */}
        <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-4 items-end text-xs text-slate-600 relative z-10">
          {/* Issue Date */}
          <div className="text-left space-y-1">
            <p className="font-semibold text-slate-900 text-xs sm:text-sm">{formattedDate}</p>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider">Date Issued</p>
          </div>

          {/* Center Badge / Seal */}
          <div className="text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-2 border-amber-600/50 bg-amber-50 flex items-center justify-center text-amber-700 shadow-inner mb-1">
              <Award className="h-6 w-6" />
            </div>
            <p className="text-[10px] font-bold text-amber-800 tracking-wider uppercase">Official Seal</p>
          </div>

          {/* Instructor Signature */}
          <div className="text-right space-y-1">
            <p className="font-serif italic font-bold text-slate-900 text-sm sm:text-base">{certificate.instructorName}</p>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider">Lead Instructor</p>
          </div>
        </div>

        {/* Verification Link Bar at Bottom */}
        <div className="text-center pt-3 text-[10px] text-slate-400 flex items-center justify-center gap-2">
          <span>Credential ID: <strong className="font-mono text-slate-600">{certificate.certificateCode}</strong></span>
          <span>•</span>
          <span className="truncate">Verify at izba.app{verifyUrl}</span>
        </div>
      </div>
    </div>
  );
}
