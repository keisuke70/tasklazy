// FormattedDateTime.tsx
"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";

interface FormattedDateTimeProps {
  isoString?: string;
}

export default function FormattedDateTime({
  isoString,
}: FormattedDateTimeProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder on the server to avoid hydration mismatch.
    return <span>-</span>;
  }

  try {
    return (
      <span>
        {isoString ? format(new Date(isoString), "MMM d, HH:mm") : "-"}
      </span>
    );
  } catch {
    return <span>-</span>;
  }
}
