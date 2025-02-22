"use client";

import { ChevronsUpDown, LogOut, User } from "lucide-react";
import { Logout } from "./Logout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserProfile() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-start px-2">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src="/path/to/avatar.png" alt="John Doe" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start flex-1 overflow-hidden">
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-muted-foreground truncate w-full">
              john.doe@example.com
            </p>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-muted-foreground ml-auto" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">John Doe</p>
            <p className="text-xs leading-none text-muted-foreground">
              john.doe@example.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <div>
            <LogOut className="mr-2 h-4 w-4" />
            <Logout />
          </div>
   
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
