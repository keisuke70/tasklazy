import { TaskManagementSidebar } from "@/components/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="h-screen w-screen">
      <TaskManagementSidebar />
      {/* Main container */}
      <div className="flex-1 flex flex-col h-full w-full relative overflow-hidden">
        <SidebarTrigger className="absolute top-7 left-4 z-20">
          <Menu className="h-6 w-6" />
        </SidebarTrigger>
        <main className="h-full w-full p-6">{children}</main>
      </div>
    </SidebarProvider>
  );
}
