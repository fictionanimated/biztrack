import { Loader } from 'lucide-react';

export default function Loading() {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm">
      <Loader className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
