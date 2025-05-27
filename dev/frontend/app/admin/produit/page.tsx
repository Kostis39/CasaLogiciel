'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Produit = {
  IdProduit: number;
  NomProduit: string;
  PrixProduit: number | null;
};

export default function ProduitsPage() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [sousProduits, setSousProduits] = useState<{ [key: number]: Produit[] }>({});
  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost:5000/racineproduits')
      .then((res) => res.json())
      .then((data) => setProduits(data));
  }, []);

  const handleClick = async (produit: Produit) => {
    if (produit.PrixProduit !== null) {
      router.push(`/admin/produit/${produit.IdProduit}`);
      return;
    }

    if (sousProduits[produit.IdProduit]) {
      setSousProduits((prev) => {
        const { [produit.IdProduit]: _, ...rest } = prev;
        return rest;
      });
    } else {
      const res = await fetch(`http://localhost:5000/sousproduits/${produit.IdProduit}`);
      const data = await res.json();
      setSousProduits((prev) => ({ ...prev, [produit.IdProduit]: data }));
    }
  };

  const handleDoubleClick = (produit: Produit) => {
    router.push(`/admin/produit/${produit.IdProduit}`);
  };

  const renderProduits = (items: Produit[]) => (
    <ul className="space-y-2">
      {items.map((produit) => (
        <li key={produit.IdProduit}>
          <div className="flex justify-between items-center">
            <div
              className={`cursor-pointer border p-2 rounded-md w-full ${
                produit.PrixProduit === null ? 'bg-gray-200' : 'bg-white hover:bg-gray-100'
              }`}
              onClick={() => handleClick(produit)}
              onDoubleClick={() => handleDoubleClick(produit)}
            >
              {produit.NomProduit}
            </div>

            {produit.PrixProduit !== null && (
              <div className="ml-4 text-right text-green-600 font-semibold min-w-[80px]">
                {produit.PrixProduit.toFixed(2)} €
              </div>
            )}
          </div>

          {/* Affichage des sous-produits juste en dessous du parent */}
          {sousProduits[produit.IdProduit] && (
            <div className="ml-6 mt-2 border-l pl-4">
              {renderProduits(sousProduits[produit.IdProduit])}
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Produits</h1>
      {renderProduits(produits)}
    </div>
  );
}
