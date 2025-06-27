import { Loader } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Loader className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
