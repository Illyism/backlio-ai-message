"use client";

import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Input type="email" placeholder="Email" />
    </main>
  );
}
