"use client";

import { signOut } from "@aws-amplify/auth";
import React from "react";
import { useRouter } from "next/navigation";

export const Logout = () => {
  const router = useRouter();
  return (
    <span
      onClick={async () => {
        await signOut();
        router.push("/signup");
      }}
      className="cursor-pointer"
    >
      Logout
    </span>
  );
};
