import { SignUp } from "@clerk/nextjs";

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <SignUp routing="path" path="/register" signInUrl="/login" />
    </main>
  );
}
