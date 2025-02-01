"use client";
import { Home, Archive, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  { name: "Home", icon: Home },
  { name: "Archived", icon: Archive },
  { name: "Settings", icon: Settings },
];

export function TaskManagementSidebar() {
  return (
    <Sidebar className="border-r border-accent/10">
      <SidebarHeader className="border-b border-accent/10 p-4">
        <h1 className="text-2xl font-bold text-primary">TaskLazy</h1>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                className="flex items-center gap-2 text-text hover:bg-primary/10"
              >
                <a href={`/${item.name.toLowerCase()}`}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <p className="text-sm text-text/60">© 2025 TaskLazy</p>
      </SidebarFooter>
    </Sidebar>
  );
}
