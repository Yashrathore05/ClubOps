import type { Metadata } from "next";
import SignupForm from "./SignupForm";

export const metadata: Metadata = {
  title: "Register your club – ClubOps",
  description: "Create your club account and start managing events, attendance, and certificates",
};

export default function SignupPage() {
  return <SignupForm />;
}
