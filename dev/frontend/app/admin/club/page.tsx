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
import { Card } from '@/src/components/ui/card';
import { Club } from '@/src/types&fields/types';
import { deleteClub, fetchClubs, postClub, updateClub } from '@/src/services/api';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/src/components/ui/LoadingSpinner';

const TOAST_MESSAGES = {
  DELETE_SUCCESS: 'Club supprimé avec succès',
  DELETE_ERROR: 'Erreur lors de la suppression du club',
  FETCH_ERROR: 'Erreur lors de la récupération des clubs',
  CREATE_ERROR: 'Erreur lors de la création du club',
  UPDATE_ERROR: 'Erreur lors de la mise à jour du club',
};

const FORM_INITIAL_STATE = {
  nomClub: '',
  codePostClub: '',
  villeClub: '',
  telClub: '',
  emailClub: '',
  adresseClub: '',
  siteInternet: '',
};

const isFormValid = (form: typeof FORM_INITIAL_STATE) => {
  return form.nomClub.trim().length > 0;
};

export default function ClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [form, setForm] = useState(FORM_INITIAL_STATE);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadClubs();
  }, []);

  const loadClubs = async () => {
    setIsLoading(true);
    try {
      const res = await fetchClubs();
      if (res.success && Array.isArray(res.data)) {
        setClubs(res.data);
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
    setSelectedClub(null);
    setEditMode(false);
    setConfirmDelete(false);
  };

  const openCreateDialog = () => {
    resetForm();
    setEditMode(true);
    setIsCreateDialogOpen(true);
  };

  const openDetailDialog = (club: Club) => {
    setSelectedClub(club);
    setForm({
      nomClub: club.NomClub,
      codePostClub: club.CodePostClub,
      villeClub: club.VilleClub,
      telClub: club.TelClub,
      emailClub: club.EmailClub,
      adresseClub: club.AdresseClub,
      siteInternet: club.SiteInternet,
    });
    setEditMode(false);
    setIsDetailDialogOpen(true);
  };

  const handleCreate = async () => {
    if (!isFormValid(form)) return;

    setIsLoading(true);
    try {
      const clubData = {
        NomClub: form.nomClub,
        CodePostClub: form.codePostClub,
        VilleClub: form.villeClub,
        TelClub: form.telClub,
        EmailClub: form.emailClub,
        AdresseClub: form.adresseClub,
        SiteInternet: form.siteInternet,
      };

      const res = await postClub(clubData);
      if (res.success) {
        await loadClubs();
        setIsCreateDialogOpen(false);
        toast.success('Club créé avec succès');
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
    if (!selectedClub || !isFormValid(form)) return;

    setIsLoading(true);
    try {
      const clubData = {
        NomClub: form.nomClub,
        CodePostClub: form.codePostClub,
        VilleClub: form.villeClub,
        TelClub: form.telClub,
        EmailClub: form.emailClub,
        AdresseClub: form.adresseClub,
        SiteInternet: form.siteInternet,
      };

      const res = await updateClub(selectedClub.IdClub, clubData);
      if (res.success) {
        await loadClubs();
        setEditMode(false);
        toast.success('Club mis à jour avec succès');
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
    if (!selectedClub) return;

    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    setIsLoading(true);
    try {
      const res = await deleteClub(selectedClub.IdClub);
      if (res.success) {
        toast.success(res.message || TOAST_MESSAGES.DELETE_SUCCESS);
        await loadClubs();
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
        <h1 className="text-3xl font-bold">Clubs</h1>
      </div>

      {isLoading ? (
        <LoadingSpinner />
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.isArray(clubs) && clubs.length === 0 ? (
            <Card className="col-span-full p-6">
              <p className="text-center text-gray-500">Aucun club disponible.</p>
            </Card>
          ) : (
            clubs.map((club) => (
              <Card
                key={club.IdClub}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => openDetailDialog(club)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  openDetailDialog(club);
                }}
              >
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold text-primary">
                    {club.NomClub}
                  </h3>
                  <div className="space-y-2 text-gray-600 text-sm">
                    <div className="flex flex-col">
                      <span className="font-medium">{club.AdresseClub}</span>
                      <span>{club.CodePostClub} {club.VilleClub}</span>
                    </div>
                    <div className="flex flex-col pt-2">
                      <span>Tél: {club.TelClub}</span>
                      <span>Email: {club.EmailClub}</span>
                      {club.SiteInternet && (
                        <a
                          href={club.SiteInternet}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-primary hover:underline"
                        >
                          Site web
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

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
            <DialogTitle>Nouveau club</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Nom du club</label>
              <Input
                value={form.nomClub}
                onChange={(e) => handleFormChange('nomClub', e.target.value)}
                className={form.nomClub.trim() === '' ? 'border-red-500' : ''}
              />
              {form.nomClub.trim() === '' && (
                <p className="text-red-500 text-sm mt-1">Le nom est requis</p>
              )}
            </div>
            <div>
              <label className="block font-semibold mb-1">Adresse</label>
              <Input
                value={form.adresseClub}
                onChange={(e) => handleFormChange('adresseClub', e.target.value)}
                className={''}
              />
              {form.adresseClub.trim() === '' && (
                <></>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Code postal</label>
                <Input
                  value={form.codePostClub}
                  onChange={(e) => handleFormChange('codePostClub', e.target.value)}
                  maxLength={5}
                  className={''}
                />
                {form.codePostClub.trim().length !== 5 && (
                  <></>
                )}
              </div>
              <div>
                <label className="block font-semibold mb-1">Ville</label>
                <Input
                  value={form.villeClub}
                  onChange={(e) => handleFormChange('villeClub', e.target.value)}
                  className={''}
                />
                {form.villeClub.trim() === '' && (
                  <></>
                )}
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-1">Téléphone</label>
              <Input
                value={form.telClub}
                onChange={(e) => handleFormChange('telClub', e.target.value)}
                className={''}
              />
              {form.telClub.trim() === '' && (
                <></>
              )}
            </div>
            <div>
              <label className="block font-semibold mb-1">Email</label>
              <Input
                type="email"
                value={form.emailClub}
                onChange={(e) => handleFormChange('emailClub', e.target.value)}
                className={''}
              />
              {form.emailClub.trim() === '' && (
                <></>
              )}
            </div>
            <div>
              <label className="block font-semibold mb-1">Site internet</label>
              <Input
                type="url"
                value={form.siteInternet}
                onChange={(e) => handleFormChange('siteInternet', e.target.value)}
                placeholder="https://"
              />
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
            <DialogTitle>Détails du club</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Nom du club</label>
              <Input
                value={form.nomClub}
                onChange={(e) => handleFormChange('nomClub', e.target.value)}
                disabled={!editMode}
                className={editMode && form.nomClub.trim() === '' ? 'border-red-500' : ''}
              />
              {editMode && form.nomClub.trim() === '' && (
                <p className="text-red-500 text-sm mt-1">Le nom est requis</p>
              )}
            </div>
            <div>
              <label className="block font-semibold mb-1">Adresse</label>
              <Input
                value={form.adresseClub}
                onChange={(e) => handleFormChange('adresseClub', e.target.value)}
                disabled={!editMode}
                className={''}
              />
              {editMode && form.adresseClub.trim() === '' && (
                <></>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Code postal</label>
                <Input
                  value={form.codePostClub}
                  onChange={(e) => handleFormChange('codePostClub', e.target.value)}
                  disabled={!editMode}
                  maxLength={5}
                  className={''}
                />
                {editMode && form.codePostClub.trim().length !== 5 && (
                  <></>
                )}
              </div>
              <div>
                <label className="block font-semibold mb-1">Ville</label>
                <Input
                  value={form.villeClub}
                  onChange={(e) => handleFormChange('villeClub', e.target.value)}
                  disabled={!editMode}
                  className={''}
                />
                {editMode && form.villeClub.trim() === '' && (
                  <></>
                )}
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-1">Téléphone</label>
              <Input
                value={form.telClub}
                onChange={(e) => handleFormChange('telClub', e.target.value)}
                disabled={!editMode}
                className={''}
              />
              {editMode && form.telClub.trim() === '' && (
                <></>
              )}
            </div>
            <div>
              <label className="block font-semibold mb-1">Email</label>
              <Input
                type="email"
                value={form.emailClub}
                onChange={(e) => handleFormChange('emailClub', e.target.value)}
                disabled={!editMode}
                className={''}
              />
              {editMode && form.emailClub.trim() === '' && (
                <></>
              )}
            </div>
            <div>
              <label className="block font-semibold mb-1">Site internet</label>
              <Input
                type="url"
                value={form.siteInternet}
                onChange={(e) => handleFormChange('siteInternet', e.target.value)}
                disabled={!editMode}
                placeholder="https://"
              />
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
        aria-label="Ajouter un club"
      >
        <Plus size={28} />
      </Button>
    </div>
  );
}