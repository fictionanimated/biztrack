"use client";

import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <main className="flex flex-1 items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
    </main>
  );
}
