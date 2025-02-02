"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";

// A helper to parse a date-only string (assumed in local time)
// e.g. "2025-02-15" -> local Date corresponding to Feb 15 at 00:00 local time.
function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year!, month! - 1, day);
}

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
    // Render a placeholder on the server to avoid hydration mismatches.
    return <span>-</span>;
  }

  try {
    if (!isoString) return <span>-</span>;

    // Check if the isoString contains a "T", indicating a time part.
    const isDateOnly = !isoString.includes("T");

    if (isDateOnly) {
      // For a date-only string, parse it as a local date
      // and format without a time component.
      const localDate = parseLocalDate(isoString);
      return <span>{format(localDate, "MMM d")}</span>;
    } else {
      // For full ISO strings (with time), create a Date normally.
      return <span>{format(new Date(isoString), "MMM d, HH:mm")}</span>;
    }
  } catch {
    return <span>-</span>;
  }
}
