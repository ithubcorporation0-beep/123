import { UnifiedLogin } from "@/components/auth/UnifiedLogin";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#F2F2F2] p-4 sm:p-6">
      <UnifiedLogin />
    </main>
  );
}
