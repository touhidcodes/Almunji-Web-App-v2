import { Suspense } from "react";
import AuthPageContent from "./AuthPageContent";

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthPageContent />
    </Suspense>
  );
}
