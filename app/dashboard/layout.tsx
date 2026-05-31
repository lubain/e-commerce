import { Navbar } from "@/components/layout/Navbar";
import { DashboardSidebar } from "@/features/dashboard/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="flex min-h-screen pt-16">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </>
  );
}
