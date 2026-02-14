import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Login – ClubOps",
  description: "Login to the ClubOps dashboard",
};

export default function LoginPage() {
  return <LoginForm />;
}
