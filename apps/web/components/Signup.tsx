"use client";

import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { AuthUser } from "@aws-amplify/auth";

const Signup = ({ user }: { user?: AuthUser }) => {
  useEffect(() => {
    if (user) {
      redirect("/dashboard");
    }
  });
  return null;
};

export default withAuthenticator(Signup);
