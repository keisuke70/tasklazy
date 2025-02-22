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
import { UserProfile } from "./user-profile";

const menuItems = [
  { name: "Home", icon: Home, href: "/dashboard" },
  { name: "Archived", icon: Archive, href: "/dashboard/archived" },
  { name: "Settings", icon: Settings, href: "/dashboard/setting" },
];

export function TaskManagementSidebar() {
  return (
    <Sidebar className="bg-background text-text border-r border-accent h-full">
      <SidebarHeader className="p-4 border-b border-accent">
        <h1 className="text-2xl pl-3 font-bold text-primary">TaskLazy</h1>
      </SidebarHeader>
      <SidebarContent className="p-4 mt-4">
        <SidebarMenu className="flex flex-col space-y-6">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                className="flex items-center gap-3 w-full py-6 pl-3 rounded-md transition-colors duration-200 hover:bg-accent hover:text-white"
              >
                <a href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className=" pt-8 mb-6 border-t border-accent">
        <UserProfile />
      </SidebarFooter>
    </Sidebar>
  );
}
