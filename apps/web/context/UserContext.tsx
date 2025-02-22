"use client";

import { createContext, useContext } from "react";
import { AuthUser } from "@aws-amplify/auth";

const UserContext = createContext<AuthUser | undefined>(undefined);

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({
  user,
  children,
}: {
  user: AuthUser | undefined;
  children: React.ReactNode;
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
