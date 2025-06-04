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
import { Plus } from 'lucide-react';
import { deleteAbonnement, fetchAbonnements, postAbonnement, updateAbonnement } from '@/src/services/api';

interface Abonnement {
  IdAbo: number;
  TypeAbo: string;
  DureeAbo: number;
  PrixAbo: number;
}

export default function AbonnementsPage() {
  const [abonnements, setAbonnements] = useState<Abonnement[]>([]);
  const [selectedAbonnement, setSelectedAbonnement] = useState<Abonnement | null>(null);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [nomAbonnement, setNomAbonnement] = useState('');
  const [dureeAbonnement, setDureeAbonnement] = useState('');
  const [prixAbonnement, setPrixAbonnement] = useState('');

  useEffect(() => {
    storeAbo();
  }, []);

  const storeAbo = async () => {
    try {
      const data = await fetchAbonnements();
      setAbonnements(data);
    } catch (error) {
      console.error('Erreur fetch abonnements:', error);
    }
  };

  const openCreateDialog = () => {
    setSelectedAbonnement(null);
    setNomAbonnement('');
    setDureeAbonnement('');
    setPrixAbonnement('');
    setEditMode(true);
    setIsCreateDialogOpen(true);
    setConfirmDelete(false);
  };

  const openDetailDialog = (abonnement: Abonnement) => {
    setSelectedAbonnement(abonnement);
    setNomAbonnement(abonnement.TypeAbo);
    setDureeAbonnement(abonnement.DureeAbo.toString());
    setPrixAbonnement(abonnement.PrixAbo.toString());
    setEditMode(false);
    setIsDetailDialogOpen(true);
    setConfirmDelete(false);
  };

  const handleCreate = async () => {
    const body = {
      TypeAbo: nomAbonnement,
      DureeAbo: parseInt(dureeAbonnement),
      PrixAbo: parseFloat(prixAbonnement),
    };

    try {
      const res = await postAbonnement(body);
      if (res && res.ok) {
        storeAbo();
        setIsCreateDialogOpen(false);
      }
    } catch (error) {
      console.error('Erreur création abonnement:', error);
    }
  };

  const handleUpdate = async () => {
    if (!selectedAbonnement) return;

    const body = {
      TypeAbo: nomAbonnement,
      DureeAbo: parseInt(dureeAbonnement),
      PrixAbo: parseFloat(prixAbonnement),
    };

    try {
      const res = await updateAbonnement(selectedAbonnement.IdAbo, body);
      if (res && res.ok) {
        storeAbo();
        setEditMode(false);
      }
    } catch (error) {
      console.error('Erreur update abonnement:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedAbonnement) return;

    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    try {
      const res = await deleteAbonnement(selectedAbonnement.IdAbo);
      if (res && res.ok) {
        storeAbo();
        setIsDetailDialogOpen(false);
        setConfirmDelete(false);
      }
    } catch (error) {
      console.error('Erreur suppression abonnement:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 space-y-6">
      <h1 className="text-3xl font-semibold mb-4">Abonnements</h1>

      <div className="w-full max-w-2xl bg-white rounded shadow p-6 space-y-4">
        {Array.isArray(abonnements) && abonnements.length === 0 ? (
          <p className="text-center text-gray-500">Aucun abonnement disponible.</p>
        ) : (
          abonnements.map((abonnement) => (
            <div
              key={abonnement.IdAbo}
              className="flex justify-between items-center border-b py-3 cursor-pointer hover:bg-blue-50"
              onClick={() => openDetailDialog(abonnement)}
              onContextMenu={(e) => {
                e.preventDefault();
                openDetailDialog(abonnement);
              }}
            >
              <div className="font-medium">{abonnement.TypeAbo}</div>
              <div className="text-gray-600 flex gap-6 min-w-[150px] justify-end">
                <div>Durée: {abonnement.DureeAbo} jours</div>
                <div>Prix: {abonnement.PrixAbo.toFixed(2)} €</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bouton création + */}
      <Button
        onClick={openCreateDialog}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 shadow-lg"
        aria-label="Ajouter un abonnement"
      >
        <Plus size={28} />
      </Button>

      {/* Dialog Création */}
      <Dialog open={isCreateDialogOpen} onOpenChange={() => {
        setIsCreateDialogOpen(false);
        setEditMode(false);
        setConfirmDelete(false);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvel abonnement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Nom</label>
              <Input value={nomAbonnement} onChange={(e) => setNomAbonnement(e.target.value)} />
            </div>
            <div>
              <label className="block font-semibold mb-1">Durée (jours)</label>
              <Input type="number" min={1} value={dureeAbonnement} onChange={(e) => setDureeAbonnement(e.target.value)} />
            </div>
            <div>
              <label className="block font-semibold mb-1">Prix</label>
              <Input type="number" min={0} step="0.01" value={prixAbonnement} onChange={(e) => setPrixAbonnement(e.target.value)} />
            </div>
          </div>
          <DialogFooter className="flex justify-end mt-6 gap-2">
            <Button variant="secondary" onClick={() => setIsCreateDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleCreate} disabled={!nomAbonnement.trim() || !dureeAbonnement || !prixAbonnement}>
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Détail */}
      <Dialog open={isDetailDialogOpen} onOpenChange={() => {
        setIsDetailDialogOpen(false);
        setEditMode(false);
        setConfirmDelete(false);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails de l'abonnement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Nom</label>
              <Input value={nomAbonnement} onChange={(e) => setNomAbonnement(e.target.value)} disabled={!editMode} />
            </div>
            <div>
              <label className="block font-semibold mb-1">Durée (jours)</label>
              <Input type="number" min={1} value={dureeAbonnement} onChange={(e) => setDureeAbonnement(e.target.value)} disabled={!editMode} />
            </div>
            <div>
              <label className="block font-semibold mb-1">Prix</label>
              <Input type="number" step="0.01" value={prixAbonnement} onChange={(e) => setPrixAbonnement(e.target.value)} disabled={!editMode} />
            </div>
          </div>
          <DialogFooter className="flex justify-between mt-6">
            {!editMode ? (
              <>
                <Button onClick={() => setEditMode(true)}>Modifier</Button>
                <Button variant={confirmDelete ? 'destructive' : 'secondary'} onClick={handleDelete}>
                  {confirmDelete ? 'Confirmer suppression' : 'Supprimer'}
                </Button>
                <Button variant="secondary" onClick={() => setIsDetailDialogOpen(false)}>Fermer</Button>
              </>
            ) : (
              <>
                <Button variant="secondary" onClick={() => setEditMode(false)}>Annuler</Button>
                <Button onClick={handleUpdate} disabled={!nomAbonnement.trim() || !dureeAbonnement || !prixAbonnement}>
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