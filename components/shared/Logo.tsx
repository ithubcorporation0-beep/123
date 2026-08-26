import Link from "next/link";
import { GraduationCap } from "lucide-react";

interface LogoProps {
  className?: string;
  isWhite?: boolean;
}

export function Logo({ className = "", isWhite = false }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 group ${className}`}>
      <div className={`p-2 rounded-xl transition-transform group-hover:scale-105 shadow-sm ${
        isWhite ? "bg-white text-primary" : "bg-primary text-primary-foreground"
      }`}>
        <GraduationCap className="h-5 w-5" />
      </div>
      <div className="flex flex-col">
        <span className={`font-extrabold text-xl tracking-tight leading-none ${isWhite ? "text-white" : "text-foreground"}`}>
          EduFlow
        </span>
        <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">
          Learning
        </span>
      </div>
    </Link>
  );
}
