'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/src/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/src/components/ui/dialog';
import { Input } from '@/src/components/ui/input';
import { Folder, File } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface Produit {
  IdProduit: number;
  IdProduitParent: number | null;
  NomProduit: string;
  PrixProduit: number | null;
  IdReduc?: number | null;
}

type ProduitMap = {
  [id: number]: Produit & { enfants?: Produit[]; expanded?: boolean };
};

export default function ProduitsPage() {
  const [produits, setProduits] = useState<ProduitMap>({});
  const [racines, setRacines] = useState<number[]>([]);
  const [selection, setSelection] = useState<number | null>(null);
  const [dialogType, setDialogType] = useState<'parent' | 'produit' | null>(null);
  const [detailProduit, setDetailProduit] = useState<Produit | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [nom, setNom] = useState('');
  const [prix, setPrix] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
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

    if (!Array.isArray(data)) {
      console.warn('Réponse inattendue de /sousproduits/', data);
      return;
    }

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
      const collapseRecursive = (pid: number, map: ProduitMap): number[] => {
        const enfants = map[pid].enfants || [];
        let allDescendants: number[] = [];
        enfants.forEach(e => {
          allDescendants.push(e.IdProduit);
          allDescendants = [...allDescendants, ...collapseRecursive(e.IdProduit, map)];
          delete map[e.IdProduit];
        });
        map[pid].expanded = false;
        map[pid].enfants = [];
        return allDescendants;
      };

      const newMap = { ...produits };
      const descendants = collapseRecursive(id, newMap);

      if (selection !== null && descendants.includes(selection)) {
        setSelection(null);
      }

      setProduits(newMap);
    } else {
      await fetchEnfants(id);
    }
  };

  const IndentBars = ({ level }: { level: number }) => {
    return (
      <div
        style={{
          display: 'flex',
          position: 'relative',
          width: level * 16,
          marginRight: 8,
        }}
        aria-hidden="true"
      >
        {Array.from({ length: level }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 2,
              backgroundColor: '#cbd5e1',
              marginRight: 14,
              height: '100%',
              position: 'relative',
              top: 0,
            }}
          />
        ))}
      </div>
    );
  };

  const renderProduit = (id: number, level = 0) => {
    const p = produits[id];
    if (!p) return null;

    const isEnsemble = p.PrixProduit === null;
    const isExpanded = p.expanded;

    return (
      <div key={id}>
        <div
          className={`flex items-center space-x-1 py-1 cursor-pointer ${
            selection === id ? 'bg-blue-100' : ''
          }`}
          style={{ paddingLeft: 0 }}
          onClick={() => {
            if (isEnsemble) {
              toggleExpand(id);
            }
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            if (selection === id) {
              setSelection(null);
            } else {
              setSelection(id);
            }
          }}
          onDoubleClick={() => {
            // Ouvrir la popup détail
            setDetailProduit(p);
            setNom(p.NomProduit);
            setPrix(p.PrixProduit !== null ? p.PrixProduit.toString() : '');
            setEditMode(false);
          }}
        >
          <IndentBars level={level} />

          <div className="w-4">
            {isEnsemble ? (isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />) : <div style={{ width: 16 }} />}
          </div>

          <div className="w-4">{isEnsemble ? <Folder size={16} /> : <File size={16} />}</div>

          <div className="flex-1 flex justify-between pr-2">
            <span>{p.NomProduit}</span>
            {p.PrixProduit !== null && <span className="text-sm text-gray-500">{p.PrixProduit.toFixed(2)} €</span>}
          </div>
        </div>

        {isExpanded &&
          (p.enfants || [])
            .sort((a, b) => {
              const aIsProduit = produits[a.IdProduit]?.PrixProduit !== null;
              const bIsProduit = produits[b.IdProduit]?.PrixProduit !== null;
              if (aIsProduit && !bIsProduit) return -1;
              if (!aIsProduit && bIsProduit) return 1;
              return 0;
            })
            .map((e) => renderProduit(e.IdProduit, level + 1))}
      </div>
    );
  };

  const handleCreate = async () => {
    const body: any = {
      IdProduitParent:
        selection !== null
          ? produits[selection].PrixProduit !== null
            ? produits[selection].IdProduitParent
            : selection
          : null,
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

  const handleUpdate = async () => {
    if (!detailProduit) return;

    const body: any = { NomProduit: nom };
    if (detailProduit.PrixProduit !== null) {
      // feuille => prix modifiable
      body.PrixProduit = parseFloat(prix);
      if (isNaN(body.PrixProduit)) {
        return;
      }
    }

    const res = await fetch(`http://localhost:5000/produit/${detailProduit.IdProduit}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setEditMode(false);
      fetchProduits();
      // Mettre à jour detailProduit localement aussi
      setDetailProduit((prev) =>
        prev ? { ...prev, NomProduit: nom, PrixProduit: body.PrixProduit ?? prev.PrixProduit } : null
      );
    }
  };

  const handleDelete = async () => {
    if (!detailProduit) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    // Appel suppression API
    const res = await fetch(`http://localhost:5000/produit/${detailProduit.IdProduit}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setDetailProduit(null);
      setConfirmDelete(false);
      fetchProduits();
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-2/3 overflow-auto p-4">
        {[...racines]
          .sort((a, b) => {
            const aIsProduit = produits[a]?.PrixProduit !== null;
            const bIsProduit = produits[b]?.PrixProduit !== null;
            if (aIsProduit && !bIsProduit) return -1;
            if (!aIsProduit && bIsProduit) return 1;
            return 0;
          })
          .map((id) => renderProduit(id))}
      </div>
      <div className="w-1/3 border-l p-4 flex flex-col gap-4">
        <Button onClick={() => setDialogType('parent')} className="flex items-center gap-2">
          <Folder size={18} /> ajout ensemble de produit
        </Button>
        <Button onClick={() => setDialogType('produit')} className="flex items-center gap-2">
          <File size={18} /> ajout produit
        </Button>
      </div>

      {/* Dialog ajout */}
      <Dialog open={dialogType !== null} onOpenChange={() => setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogType === 'parent' ? 'Nouvel ensemble' : 'Nouveau produit'}</DialogTitle>
          </DialogHeader>
          <Input placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} className="mb-2" />
          {dialogType === 'produit' && (
            <Input
              placeholder="Prix"
              value={prix}
              onChange={(e) => setPrix(e.target.value)}
              type="number"
              className="mb-2"
            />
          )}
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setDialogType(null)}>
              Annuler
            </Button>
            <Button
              onClick={handleCreate}
              disabled={nom.trim() === '' || (dialogType === 'produit' && (!prix || isNaN(parseFloat(prix))))}
            >
              Créer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog détail produit */}
      <Dialog open={detailProduit !== null} onOpenChange={() => { setDetailProduit(null); setEditMode(false); setConfirmDelete(false); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{detailProduit?.PrixProduit === null ? 'Ensemble de produit' : 'Produit'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <div>
              <strong>IdProduit:</strong> {detailProduit?.IdProduit}
            </div>

            <div>
              <strong>Nom:</strong>{' '}
              {editMode ? (
                <Input value={nom} onChange={(e) => setNom(e.target.value)} />
              ) : (
                detailProduit?.NomProduit
              )}
            </div>

            {detailProduit?.PrixProduit !== null && (
              <div>
                <strong>Prix:</strong>{' '}
                {editMode ? (
                  <Input
                    type="number"
                    value={prix}
                    onChange={(e) => setPrix(e.target.value)}
                  />
                ) : (
                  detailProduit?.PrixProduit.toFixed(2) + ' €'
                )}
              </div>
            )}

            {detailProduit && detailProduit.IdProduitParent !== null && (
              <div>
                <strong>Parent:</strong> {detailProduit.IdProduitParent}
              </div>
            )}

            {detailProduit && detailProduit.IdReduc !== null && (
              <div>
                <strong>IdReduc:</strong> {detailProduit.IdReduc}
              </div>
            )}

          </div>

          <DialogFooter className="flex justify-between mt-4">
            {!editMode ? (
              <>
                <Button onClick={() => setEditMode(true)}>Modifier</Button>
                <Button
                  variant={confirmDelete ? 'destructive' : 'secondary'}
                  onClick={handleDelete}
                >
                  {confirmDelete ? 'Confirmer suppression' : 'Supprimer'}
                </Button>
                <Button variant="secondary" onClick={() => setDetailProduit(null)}>
                  Retour
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" onClick={() => setEditMode(false)}>
                  Annuler
                </Button>
                <Button onClick={handleUpdate} disabled={nom.trim() === '' || (detailProduit?.PrixProduit !== null && (prix === '' || isNaN(parseFloat(prix))))}>
                  Enregistrer
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
