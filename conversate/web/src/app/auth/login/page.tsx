import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="p-8 text-sm">Loading…</p>}>
      <LoginForm />
    </Suspense>
  );
}
