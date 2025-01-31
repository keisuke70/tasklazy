"use client";

import dynamic from "next/dynamic";

// Dynamically import the default export from TaskRowInternal
const TaskRowInternal = dynamic(() => import("./TaskRowInternal"), {
  ssr: false,
});

// Just re-export it as default
export default TaskRowInternal;
