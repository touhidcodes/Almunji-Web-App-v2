import React, { Suspense } from "react";
import LoginPageContent from "./loginPageContent";

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
