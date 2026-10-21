"use client";

import dynamic from "next/dynamic";

const AppRoot = dynamic(() => import("@/components/AppRoot"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#090d16] flex items-center justify-center text-slate-400 font-mono text-xs">
      Loading AbacusAI Bot ecosystem...
    </div>
  ),
});

export default function ClientOnly() {
  return <AppRoot />;
}
