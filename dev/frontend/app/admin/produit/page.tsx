'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/src/components/ui/dialog';
import { Input } from '@/src/components/ui/input';
import { Folder, File } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Produit {
  IdProduit: number;
  IdProduitParent: number | null;
  NomProduit: string;
  PrixProduit: number | null;
}

type ProduitMap = {
  [id: number]: Produit & { enfants?: Produit[]; expanded?: boolean };
};

export default function ProduitsPage() {
  const [produits, setProduits] = useState<ProduitMap>({});
  const [racines, setRacines] = useState<number[]>([]);
  const [selection, setSelection] = useState<number | null>(null);
  const [dialogType, setDialogType] = useState<'parent' | 'produit' | null>(null);
  const [nom, setNom] = useState('');
  const [prix, setPrix] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchProduits();
  }, []);

  const fetchProduits = async () => {
    const res = await fetch('http://localhost:5000/racineproduits');
    const data = await res.json();
    const map: ProduitMap = {};
    data.forEach((p: Produit) => {
      map[p.IdProduit] = p;
    });
    setProduits(map);
    setRacines(data.map((p: Produit) => p.IdProduit));
  };

  const fetchEnfants = async (idParent: number) => {
    const res = await fetch(`http://localhost:5000/sousproduits/${idParent}`);
    const data = await res.json();
    const nouveaux = { ...produits };
    nouveaux[idParent].enfants = data;
    nouveaux[idParent].expanded = true;
    data.forEach((p: Produit) => {
      nouveaux[p.IdProduit] = p;
    });
    setProduits(nouveaux);
  };

  const toggleExpand = async (id: number) => {
    const p = produits[id];
    if (p.expanded) {
      const collapseRecursive = (pid: number, map: ProduitMap) => {
        const enfants = map[pid].enfants || [];
        enfants.forEach(e => {
          collapseRecursive(e.IdProduit, map);
          delete map[e.IdProduit];
        });
        map[pid].expanded = false;
        map[pid].enfants = [];
      };
      const newMap = { ...produits };
      collapseRecursive(id, newMap);
      setProduits(newMap);
    } else {
      await fetchEnfants(id);
    }
  };

  const renderProduit = (id: number, level = 0) => {
    const p = produits[id];
    return (
      <div key={id} className={`pl-${level * 4} py-2 cursor-pointer ${selection === id ? 'bg-gray-300' : ''}`}>
        <div
          className={`flex justify-between items-center ${p.PrixProduit === null ? 'bg-gray-100 px-2 py-1 rounded' : ''}`}
          onClick={() => {
            if (p.PrixProduit === null) toggleExpand(id);
            setSelection(selection === id ? null : id);
          }}
          onDoubleClick={() => router.push(`/admin/produit/${id}`)}
        >
          <span>{p.NomProduit}</span>
          {p.PrixProduit !== null && <span>{p.PrixProduit.toFixed(2)} €</span>}
        </div>
        {p.expanded && p.enfants?.map(e => renderProduit(e.IdProduit, level + 1))}
      </div>
    );
  };

  const handleCreate = async () => {
    console.log("en cours de créeation");
    const body: any = {
      IdProduitParent: selection,
      NomProduit: nom,
      IdReduc: null,
      PrixProduit: dialogType === 'produit' ? parseFloat(prix) : null,
    };
    await fetch('http://localhost:5000/produits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    setDialogType(null);
    setNom('');
    setPrix('');
    fetchProduits();
  };

  return (
    <div className="flex h-screen">
      <div className="w-2/3 overflow-auto p-4">
        {racines.map(id => renderProduit(id))}
      </div>
      <div className="w-1/3 border-l p-4 flex flex-col gap-4">
        <Button onClick={() => setDialogType('parent')} className="flex items-center gap-2">
          <Folder size={18} /> ajout ensemble de produit
        </Button>
        <Button onClick={() => setDialogType('produit')} className="flex items-center gap-2">
          <File size={18} /> ajout produit
        </Button>
      </div>

      <Dialog open={dialogType !== null} onOpenChange={() => setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogType === 'parent' ? 'Nouvel ensemble' : 'Nouveau produit'}</DialogTitle>
          </DialogHeader>
          <Input placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} className="mb-2" />
          {dialogType === 'produit' && (
            <Input placeholder="Prix" value={prix} onChange={e => setPrix(e.target.value)} type="number" className="mb-2" />
          )}
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setDialogType(null)}>Annuler</Button>
            <Button onClick={handleCreate}>Créer</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
