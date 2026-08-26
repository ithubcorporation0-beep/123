import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <SignIn routing="path" path="/login" signUpUrl="/register" />
    </main>
  );
}
