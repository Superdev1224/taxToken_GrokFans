import { Suspense } from "react";
import { Dashboard } from "@/components/dashboard/Dashboard";

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center text-neon-cyan">
          Loading...
        </div>
      }
    >
      <Dashboard />
    </Suspense>
  );
}
