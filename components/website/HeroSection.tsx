import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ShieldCheck,
  Code2,
  Terminal,
  Lock,
  Layers,
  Server,
  Sparkles,
} from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-14 pb-20 md:pt-24 md:pb-28 border-b border-[#DEDEDE] bg-white">
      <div className="max-w-[1585px] mx-auto px-5 sm:px-8 lg:px-12 flex flex-col items-center text-center">
        {/* Vibrant Rounded Announcement Chip */}
        <div className="animate-fade-in-down inline-flex items-center gap-2.5 px-4 py-1.5 rounded-[30px] border border-[#DEDEDE] bg-[#F2F2F2] text-[#282828] text-xs font-semibold mb-8 hover:bg-[#EAEAEA] transition-colors cursor-default">
          <span className="flex h-2 w-2 rounded-full bg-[#FF9F59]" />
          <span className="text-[#545454] font-normal">Next-Gen LMS Platform</span>
          <span className="h-3 w-px bg-[#DEDEDE]" />
          <span className="text-[11px] font-bold tracking-wide uppercase text-[#194866]">
            Enterprise Edition
          </span>
        </div>

        {/* Main Heading in DM Serif Display */}
        <h1 className="animate-fade-in-up font-serif text-[42px] sm:text-[50px] md:text-[56px] text-[#194866] font-normal tracking-tight max-w-4xl leading-[1.05]">
          Master modern software engineering and cloud infrastructure.
        </h1>

        {/* Subtitle with Generous Line-Height (1.6) in Open Sans */}
        <p className="animate-fade-in-up delay-100 mt-6 text-base sm:text-lg text-[#545454] max-w-2xl font-normal leading-[1.6]">
          Structured technical curriculums, production-ready modules, and cryptographically verified certifications designed for ambitious developers and technical teams.
        </p>

        {/* CTA Buttons - 40px radius, 12px 25px padding */}
        <div className="animate-fade-in-up delay-200 mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link href="/courses" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto rounded-[40px] px-[25px] py-[12px] h-auto text-sm font-semibold bg-[#194866] hover:bg-[#194866]/90 text-white shadow-none gap-2"
            >
              <span>Explore All Curriculums</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>

          <Link href="/services" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto rounded-[40px] px-[25px] py-[12px] h-auto text-sm font-semibold border-[#DEDEDE] bg-[#F2F2F2] hover:bg-[#EAEAEA] text-[#194866] shadow-none gap-2"
            >
              <Layers className="h-4 w-4 text-[#194866]" />
              <span>Enterprise IT Services</span>
            </Button>
          </Link>

          <Link href="/pricing" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto rounded-[40px] px-[25px] py-[12px] h-auto text-sm font-semibold bg-[#FF9F59] hover:bg-[#FF9F59]/90 text-[#194866] shadow-none gap-1.5"
            >
              <Sparkles className="h-4 w-4" />
              <span>Free Access Tier</span>
            </Button>
          </Link>
        </div>

        {/* Trust Metrics Bar */}
        <div className="animate-fade-in-up delay-300 mt-12 pt-8 border-t border-[#DEDEDE] flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-[#545454] w-full max-w-3xl">
          <div className="flex items-center gap-2 font-medium text-[#282828]">
            <ShieldCheck className="h-4 w-4 text-[#194866]" />
            <span>Cryptographic QR Verification</span>
          </div>
          <div className="h-3.5 w-px bg-[#DEDEDE] hidden sm:block" />
          <div className="flex items-center gap-2 font-medium text-[#282828]">
            <Lock className="h-4 w-4 text-[#194866]" />
            <span>Strict Role-Based Multi-Tenant Panels</span>
          </div>
          <div className="h-3.5 w-px bg-[#DEDEDE] hidden sm:block" />
          <div className="flex items-center gap-2 font-medium text-[#282828]">
            <Server className="h-4 w-4 text-[#194866]" />
            <span>High-Def Video Streaming & Sandbox</span>
          </div>
        </div>

        {/* Flat 16px Rounded Product UI Console */}
        <div className="animate-fade-in-up delay-400 mt-14 w-full max-w-5xl rounded-[16px] border border-[#DEDEDE] bg-[#FFFFFF] shadow-none overflow-hidden text-left relative">
          {/* Mockup Window Header */}
          <div className="flex items-center justify-between border-b border-[#DEDEDE] px-5 py-3.5 bg-[#F2F2F2] text-xs text-[#545454]">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-[#DEDEDE]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#DEDEDE]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#DEDEDE]" />
              <span className="ml-2 font-mono text-[11px] text-[#545454]">izba.app / lms-console</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="h-2 w-2 rounded-full bg-[#FF9F59]" />
              <span className="text-[#282828] font-medium">Production Cluster • Online</span>
            </div>
          </div>

          {/* Mockup Body: 16px Cards with 1px border #DEDEDE */}
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#FFFFFF]">
            <div className="p-5 rounded-[16px] bg-[#F2F2F2] border border-[#DEDEDE] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#194866] flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-[#194866]" /> Architecture Track
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-[4px] bg-white border border-[#DEDEDE] text-[#545454]">MOD-01</span>
              </div>
              <p className="text-xs text-[#545454] leading-[1.6]">
                Full-stack system architecture, microservices, containerization, and enterprise Next.js pipelines.
              </p>
              <div className="pt-2 border-t border-[#DEDEDE] flex items-center justify-between text-[11px] text-[#545454] font-mono">
                <span>Progress: 100%</span>
                <span className="text-[#194866] font-bold">Completed</span>
              </div>
            </div>

            <div className="p-5 rounded-[16px] bg-[#F2F2F2] border border-[#DEDEDE] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#194866] flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-[#194866]" /> Cloud & Security
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-[4px] bg-white border border-[#DEDEDE] text-[#545454]">MOD-02</span>
              </div>
              <p className="text-xs text-[#545454] leading-[1.6]">
                TCP/IP routing, cloud infrastructure administration, and database optimization.
              </p>
              <div className="pt-2 border-t border-[#DEDEDE] flex items-center justify-between text-[11px] text-[#545454] font-mono">
                <span>Progress: 75%</span>
                <span className="text-[#FF9F59] font-bold">Active Session</span>
              </div>
            </div>

            <div className="p-5 rounded-[16px] bg-[#F2F2F2] border border-[#DEDEDE] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#194866] flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#194866]" /> Verifiable Certs
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-[4px] bg-[#FF9F59]/20 text-[#194866] font-bold">VERIFIED</span>
              </div>
              <p className="text-xs text-[#545454] leading-[1.6]">
                Tamper-proof digital certificates signed with unique cryptographic hash identification.
              </p>
              <div className="pt-2 border-t border-[#DEDEDE] flex items-center justify-between text-[11px] text-[#545454] font-mono">
                <span>Verification ID:</span>
                <span className="text-[#282828] font-bold">#IZB-84920</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
