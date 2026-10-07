import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <AuthShell title="Start your library" subtitle="Create an account to buy, read, and collect books.">
      <RegisterForm />
    </AuthShell>
  );
}