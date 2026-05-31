import { Metadata } from "next";
import { DashboardOverview } from "@/features/dashboard/DashboardOverview";

export const metadata: Metadata = { title: "Mon Dashboard" };

export default function DashboardPage() {
  return <DashboardOverview />;
}
