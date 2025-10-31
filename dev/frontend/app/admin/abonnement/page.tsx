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
import {
  deleteAbonnement,
  fetchAbonnements,
  postAbonnement,
  updateAbonnement,
} from '@/src/services/api';
import { toast } from 'react-toastify';
import { Abonnement, ApiResponse } from '@/src/types&fields/types';
import { Card } from '@/src/components/ui/card';
import LoadingSpinner from '@/src/components/client_ui/LoadingSpinner';

const TOAST_MESSAGES = {
  DELETE_SUCCESS: 'Abonnement supprimé avec succès',
  DELETE_ERROR: 'Erreur lors de la suppression de l\'abonnement',
  FETCH_ERROR: 'Erreur lors de la récupération des abonnements',
  CREATE_ERROR: 'Erreur lors de la création de l\'abonnement',
  UPDATE_ERROR: 'Erreur lors de la mise à jour de l\'abonnement',
};

const FORM_INITIAL_STATE = {
  nomAbonnement: '',
  dureeAbonnement: '',
  prixAbonnement: '',
};

const isFormValid = (form: typeof FORM_INITIAL_STATE) => {
  return (
    form.nomAbonnement.trim().length > 0 &&
    Number(form.dureeAbonnement) > 0 &&
    (form.prixAbonnement === '' || Number(form.prixAbonnement) >= 0)
  );
};

export default function AbonnementsPage() {
  const [abonnements, setAbonnements] = useState<Abonnement[]>([]);
  const [selectedAbonnement, setSelectedAbonnement] = useState<Abonnement | null>(null);
  const [form, setForm] = useState(FORM_INITIAL_STATE);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAbonnements();
  }, []);

  const loadAbonnements = async () => {
    setIsLoading(true);
    try {
      const res = await fetchAbonnements();
      if (res.success && Array.isArray(res.data)) {
        setAbonnements(res.data);
      } else {
        toast.error(res.message || TOAST_MESSAGES.FETCH_ERROR);
      }
    } catch (error) {
      toast.error(TOAST_MESSAGES.FETCH_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (field: keyof typeof FORM_INITIAL_STATE, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm(FORM_INITIAL_STATE);
    setSelectedAbonnement(null);
    setEditMode(false);
    setConfirmDelete(false);
  };

  const openCreateDialog = () => {
    resetForm();
    setEditMode(true);
    setIsCreateDialogOpen(true);
  };

  const openDetailDialog = (abonnement: Abonnement) => {
    setSelectedAbonnement(abonnement);
    setForm({
      nomAbonnement: abonnement.TypeAbo,
      dureeAbonnement: abonnement.DureeAbo.toString(),
     prixAbonnement: abonnement.PrixAbo != null ? abonnement.PrixAbo.toString() : '',
    });
    setEditMode(false);
    setIsDetailDialogOpen(true);
  };

  const handleCreate = async () => {
    if (!isFormValid(form)) return;

    setIsLoading(true);
    try {
      const body = {
        TypeAbo: form.nomAbonnement,
        DureeAbo: parseInt(form.dureeAbonnement),
        PrixAbo: parseFloat(form.prixAbonnement),
      };

      const res = await postAbonnement(body);
      if (res.success) {
        await loadAbonnements();
        setIsCreateDialogOpen(false);
        toast.success('Abonnement créé avec succès');
      } else {
        toast.error(res.message || TOAST_MESSAGES.CREATE_ERROR);
      }
    } catch (error) {
      toast.error(TOAST_MESSAGES.CREATE_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedAbonnement || !isFormValid(form)) return;

    setIsLoading(true);
    try {
      const body = {
        TypeAbo: form.nomAbonnement,
        DureeAbo: parseInt(form.dureeAbonnement),
        PrixAbo: parseFloat(form.prixAbonnement),
      };

      const res = await updateAbonnement(selectedAbonnement.IdAbo, body);
      if (res.success) {
        await loadAbonnements();
        setEditMode(false);
        toast.success('Abonnement mis à jour avec succès');
      } else {
        toast.error(res.message || TOAST_MESSAGES.UPDATE_ERROR);
      }
    } catch (error) {
      toast.error(TOAST_MESSAGES.UPDATE_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedAbonnement) return;

    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    setIsLoading(true);
    try {
      const res = await deleteAbonnement(selectedAbonnement.IdAbo);
      if (res.success) {
        toast.success(res.message || TOAST_MESSAGES.DELETE_SUCCESS);
        await loadAbonnements();
        setIsDetailDialogOpen(false);
        setConfirmDelete(false);
      } else {
        toast.error(res.message || TOAST_MESSAGES.DELETE_ERROR);
      }
    } catch (error) {
      toast.error(TOAST_MESSAGES.DELETE_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Abonnements</h1>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.isArray(abonnements) && abonnements.length === 0 ? (
            <Card className="col-span-full p-6">
              <p className="text-center text-gray-500">Aucun abonnement disponible.</p>
            </Card>
          ) : (
            abonnements.map((abonnement) => (
              <Card
                key={abonnement.IdAbo}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => openDetailDialog(abonnement)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  openDetailDialog(abonnement);
                }}
              >
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold text-primary">
                    {abonnement.TypeAbo}
                  </h3>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex justify-between items-center">
                      <span>Durée</span>
                      <span className="font-medium">{abonnement.DureeAbo} jours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Prix</span>
                      <span className="font-medium">
                        {abonnement.PrixAbo != null ? `${abonnement.PrixAbo.toFixed(2)} €` : '—'}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Bouton création + */}
      <Button
        onClick={openCreateDialog}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 shadow-lg"
        aria-label="Ajouter un abonnement"
      >
        <Plus size={28} />
      </Button>

      {/* Dialog Création */}
      <Dialog
        open={isCreateDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            resetForm();
            setIsCreateDialogOpen(false);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvel abonnement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Nom</label>
              <Input
                value={form.nomAbonnement}
                onChange={(e) => handleFormChange('nomAbonnement', e.target.value)}
                className={form.nomAbonnement.trim() === '' ? 'border-red-500' : ''}
              />
              {form.nomAbonnement.trim() === '' && (
                <p className="text-red-500 text-sm mt-1">Le nom est requis</p>
              )}
            </div>
            <div>
              <label className="block font-semibold mb-1">Durée (jours)</label>
              <Input
                type="number"
                min={1}
                value={form.dureeAbonnement}
                onChange={(e) => handleFormChange('dureeAbonnement', e.target.value)}
                className={Number(form.dureeAbonnement) <= 0 ? 'border-red-500' : ''}
              />
              {Number(form.dureeAbonnement) <= 0 && (
                <p className="text-red-500 text-sm mt-1">La durée doit être supérieure à 0</p>
              )}
            </div>
            <div>
              <label className="block font-semibold mb-1">Prix</label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={form.prixAbonnement}
                onChange={(e) => handleFormChange('prixAbonnement', e.target.value)}
                className={Number(form.prixAbonnement) < 0 ? 'border-red-500' : ''}
              />
              {Number(form.prixAbonnement) < 0 && (
                <p className="text-red-500 text-sm mt-1">Le prix ne peut pas être négatif</p>
              )}
            </div>
          </div>
          <DialogFooter className="flex justify-end mt-6 gap-2">
            <Button variant="secondary" onClick={() => setIsCreateDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!isFormValid(form) || isLoading}
              className="min-w-[100px]"
            >
              {isLoading ? 'Création...' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Détail */}
      <Dialog
        open={isDetailDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            resetForm();
            setIsDetailDialogOpen(false);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails de l'abonnement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Nom</label>
              <Input
                value={form.nomAbonnement}
                onChange={(e) => handleFormChange('nomAbonnement', e.target.value)}
                disabled={!editMode}
                className={editMode && form.nomAbonnement.trim() === '' ? 'border-red-500' : ''}
              />
              {editMode && form.nomAbonnement.trim() === '' && (
                <p className="text-red-500 text-sm mt-1">Le nom est requis</p>
              )}
            </div>
            <div>
              <label className="block font-semibold mb-1">Durée (jours)</label>
              <Input
                type="number"
                min={1}
                value={form.dureeAbonnement}
                onChange={(e) => handleFormChange('dureeAbonnement', e.target.value)}
                disabled={!editMode}
                className={editMode && Number(form.dureeAbonnement) <= 0 ? 'border-red-500' : ''}
              />
              {editMode && Number(form.dureeAbonnement) <= 0 && (
                <p className="text-red-500 text-sm mt-1">La durée doit être supérieure à 0</p>
              )}
            </div>
            <div>
              <label className="block font-semibold mb-1">Prix</label>
              <Input
                type="number"
                step="0.01"
                value={form.prixAbonnement}
                onChange={(e) => handleFormChange('prixAbonnement', e.target.value)}
                disabled={!editMode}
                className={editMode && Number(form.prixAbonnement) < 0 ? 'border-red-500' : ''}
              />
              {editMode && Number(form.prixAbonnement) < 0 && (
                <p className="text-red-500 text-sm mt-1">Le prix ne peut pas être négatif</p>
              )}
            </div>
          </div>
          <DialogFooter className="flex justify-between mt-6">
            {!editMode ? (
              <>
                <Button onClick={() => setEditMode(true)}>Modifier</Button>
                <Button
                  variant={confirmDelete ? 'destructive' : 'secondary'}
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="min-w-[140px]"
                >
                  {isLoading ? 'Suppression...' : 
                    confirmDelete ? 'Confirmer suppression' : 'Supprimer'}
                </Button>
                <Button variant="secondary" onClick={() => setIsDetailDialogOpen(false)}>
                  Fermer
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" onClick={() => setEditMode(false)}>
                  Annuler
                </Button>
                <Button
                  onClick={handleUpdate}
                  disabled={!isFormValid(form) || isLoading}
                  className="min-w-[120px]"
                >
                  {isLoading ? 'Mise à jour...' : 'Enregistrer'}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button
        onClick={openCreateDialog}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 flex items-center justify-center text-white bg-primary hover:bg-primary/90 shadow-lg"
        aria-label="Ajouter un abonnement"
      >
        <Plus size={28} />
      </Button>
    </div>
  );
}
