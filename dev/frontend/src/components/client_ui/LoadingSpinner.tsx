import React from "react";

export default function LoadingSpinner({ className = "" }: { className?: string }) {
  return (
    <div className={`flex justify-center items-center h-96 ${className}`}>
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
    </div>
  );
}
