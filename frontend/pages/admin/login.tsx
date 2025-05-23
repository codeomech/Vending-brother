"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/contexts/AuthContext";
import { AdminLogin } from "@/components/AdminLogin";

export default function AdminLoginPage() {
  const { user } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/admin/dashboard");
    }
  }, [user, router]);

  if (user) {
    return null; // or loading spinner
  }

  return <AdminLogin />;
}
