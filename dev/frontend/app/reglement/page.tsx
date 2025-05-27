import Image from 'next/image';
import React from 'react';

export default function ReglementPage() {
  return (
    <main className="flex justify-center items-center min-h-screen bg-white p-4">
      <Image
        src="/réglement intérieur.jpg"
        alt="Règlement intérieur"
        width={1000}
        height={1400}
        className="max-w-full h-auto rounded-lg shadow-lg"
      />
    </main>
  );
}
