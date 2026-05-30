import { Metadata } from "next";
import { AdminClient } from "@/features/dashboard/AdminClient";

export const metadata: Metadata = { title: "Administration" };

export default function AdminPage() {
  return <AdminClient />;
}
