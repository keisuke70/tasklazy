import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div>
      <header
        style={{
          padding: "20px",
          backgroundColor: "#f0f0f0",
          textAlign: "center",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ margin: "0", fontSize: "24px", color: "#333" }}>
          TaskLazy
        </h1>
        <p style={{ margin: "5px 0 15px", fontSize: "14px", color: "#666" }}>
          Flexible, adaptive scheduling for real life.
        </p>
        <Link href="/dashboard">
          <Button>Log In</Button>
        </Link>
      </header>
      <main
        style={{
          padding: "20px",
          textAlign: "center",
          backgroundColor: "#ffffff",
        }}
      >
        <h2 style={{ fontSize: "20px", color: "#333" }}>Simplify Your Day</h2>
        <p style={{ margin: "10px 0", fontSize: "16px", color: "#555" }}>
          Add tasks or make changes naturally—just type or speak. TaskLazy
          adjusts your schedule to fit your life, not the other way around.
        </p>
        <Link href="/learn-more">
          <Button variant="outline">Learn More</Button>
        </Link>
      </main>
    </div>
  );
}
