import Link from "next/link";
import { GraduationCap } from "lucide-react";

interface LogoProps {
  className?: string;
  isWhite?: boolean;
}

export function Logo({ className = "", isWhite = false }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 group ${className}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
        isWhite ? "bg-white text-black" : "bg-foreground text-background shadow-xs"
      }`}>
        <GraduationCap className="h-4 w-4" />
      </div>
      <div className="flex flex-col">
        <span className={`font-bold text-base tracking-tight leading-tight ${isWhite ? "text-white" : "text-foreground"}`}>
          IZBA
        </span>
        <span className="text-[9px] uppercase font-semibold tracking-wider text-muted-foreground">
          Learning Platform
        </span>
      </div>
    </Link>
  );
}
