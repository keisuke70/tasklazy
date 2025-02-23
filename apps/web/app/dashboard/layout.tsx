// app/dashboard/layout.tsx
import { TaskManagementSidebar } from "@/components/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";
import { GetAuthCurrentUserServer } from "@/lib/amplifyServerUtil";
import { UserProvider } from "@/context/UserContext";
import { NextResponse } from "next/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await GetAuthCurrentUserServer();

  if (!user) {
    return NextResponse.redirect(new URL("/signup", process.env.BASE_URL));
  }

  return (
    <SidebarProvider className="h-screen w-screen">
      <TaskManagementSidebar />
      <UserProvider user={user}>
        <div className="flex-1 flex flex-col h-full w-full relative overflow-hidden">
          <SidebarTrigger className="absolute top-7 left-4 z-20">
            <Menu className="h-6 w-6" />
          </SidebarTrigger>
          <main className="h-full w-full p-6">{children}</main>
        </div>
      </UserProvider>
    </SidebarProvider>
  );
}
