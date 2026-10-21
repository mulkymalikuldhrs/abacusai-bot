"use client";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#090d16] text-white flex flex-col items-center justify-center p-4">
      <h2 className="text-xl font-bold mb-2">Page Not Found</h2>
      <p className="text-sm text-slate-400 mb-4">The requested page could not be located in this ecosystem.</p>
      <a
        href="/"
        className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition"
      >
        Return to Dashboard
      </a>
    </div>
  );
}
