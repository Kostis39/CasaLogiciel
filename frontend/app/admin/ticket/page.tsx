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
import { deleteTicket, fetchTickets, postTicket, updateTicket } from '@/src/services/api';
import { toast } from 'react-toastify';
import { Ticket } from '@/src/types&fields/types';
import { Card } from '@/src/components/ui/card';
import LoadingSpinner from '@/src/components/client_ui/LoadingSpinner';

const TOAST_MESSAGES = {
  DELETE_SUCCESS: 'Ticket supprimé avec succès',
  DELETE_ERROR: 'Erreur lors de la suppression du ticket',
  FETCH_ERROR: 'Impossible de récupérer les tickets',
  CREATE_ERROR: 'Erreur lors de la création du ticket',
  UPDATE_ERROR: 'Erreur lors de la mise à jour du ticket',
};

const FORM_INITIAL_STATE = {
  typeTicket: '',
  nbSeanceTicket: '',
  prixTicket: '',
};

const isFormValid = (form: typeof FORM_INITIAL_STATE) => {
  return (
    form.typeTicket.trim().length > 0 &&
    !isNaN(parseInt(form.nbSeanceTicket)) &&
    parseInt(form.nbSeanceTicket) > 0 &&
    !form.prixTicket || (!isNaN(parseFloat(form.prixTicket)) && parseFloat(form.prixTicket) >= 0)
  );
};

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [form, setForm] = useState(FORM_INITIAL_STATE);
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    setIsLoading(true);
    try {
      const res = await fetchTickets();
      if (res.success && Array.isArray(res.data)) {
        setTickets(res.data);
      } else {
        toast.error(res.message || TOAST_MESSAGES.FETCH_ERROR);
      }
    } catch (error) {
      console.error(error);
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
    setSelectedTicket(null);
    setEditMode(false);
    setConfirmDelete(false);
  };

  const openCreateDialog = () => {
    resetForm();
    setEditMode(true);
    setIsCreateDialogOpen(true);
  };

  const openDetailDialog = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setForm({
      typeTicket: ticket.TypeTicket,
      nbSeanceTicket: ticket.NbSeanceTicket.toString(),
      prixTicket: (ticket.PrixTicket !== null && ticket.PrixTicket !== undefined) ? ticket.PrixTicket.toString() : '',
    });
    setEditMode(false);
    setIsDetailDialogOpen(true);
  };

  const handleCreate = async () => {
    if (!isFormValid(form)) return;

    setIsLoading(true);
    try {
      const body = {
        TypeTicket: form.typeTicket,
        NbSeanceTicket: parseInt(form.nbSeanceTicket),
        PrixTicket: parseFloat(form.prixTicket),
      };

      const res = await postTicket(body);
      if (res.success) {
        await loadTickets();
        setIsCreateDialogOpen(false);
        toast.success('Ticket créé avec succès');
      } else {
        toast.error(res.message || TOAST_MESSAGES.CREATE_ERROR);
      }
    } catch (error) {
      console.error(error);
      toast.error(TOAST_MESSAGES.CREATE_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedTicket || !isFormValid(form)) return;

    setIsLoading(true);
    try {
      const body = {
        TypeTicket: form.typeTicket,
        NbSeanceTicket: parseInt(form.nbSeanceTicket),
        PrixTicket: parseFloat(form.prixTicket),
      };

      const res = await updateTicket(selectedTicket.IdTicket, body);
      if (res.success) {
        await loadTickets();
        setEditMode(false);
        toast.success('Ticket mis à jour avec succès');
      } else {
        toast.error(res.message || TOAST_MESSAGES.UPDATE_ERROR);
      }
    } catch (error) {
      console.error(error);
      toast.error(TOAST_MESSAGES.UPDATE_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedTicket) return;

    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    setIsLoading(true);
    try {
      const res = await deleteTicket(selectedTicket.IdTicket);
      if (res.success) {
        toast.success(res.message || TOAST_MESSAGES.DELETE_SUCCESS);
        await loadTickets();
        setIsDetailDialogOpen(false);
        setConfirmDelete(false);
      } else {
        toast.error(res.message || TOAST_MESSAGES.DELETE_ERROR);
      }
    } catch (error) {
      console.error(error);
      toast.error(TOAST_MESSAGES.DELETE_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tickets</h1>
      </div>
      {isLoading ? (
        <LoadingSpinner />
        ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.isArray(tickets) && tickets.length === 0 ? (
          <Card className="col-span-full p-6">
            <p className="text-center text-gray-500">Aucun ticket disponible.</p>
          </Card>
        ) : (
          tickets.map((ticket) => (
            <Card
              key={ticket.IdTicket}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => openDetailDialog(ticket)}
              onContextMenu={(e) => {
                e.preventDefault();
                openDetailDialog(ticket);
              }}
            >
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-semibold text-primary">
                  {ticket.TypeTicket}
                </h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between items-center">
                    <span>Séances</span>
                    <span className="font-medium">{ticket.NbSeanceTicket}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Prix</span>
                    <span className="font-medium">
                      {ticket.PrixTicket != null ? `${ticket.PrixTicket.toFixed(2)} €` : '—'}
                    </span>
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
            <DialogTitle>Nouveau ticket</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Nom</label>
              <Input
                value={form.typeTicket}
                onChange={(e) => handleFormChange('typeTicket', e.target.value)}
                className={form.typeTicket.trim() === '' ? 'border-red-500' : ''}
              />
              {form.typeTicket.trim() === '' && (
                <p className="text-red-500 text-sm mt-1">Le nom est requis</p>
              )}
            </div>
            <div>
              <label className="block font-semibold mb-1">Nombre de séances</label>
              <Input
                type="number"
                min={1}
                value={form.nbSeanceTicket}
                onChange={(e) => handleFormChange('nbSeanceTicket', e.target.value)}
                className={Number(form.nbSeanceTicket) <= 0 ? 'border-red-500' : ''}
              />
              {Number(form.nbSeanceTicket) <= 0 && (
                <p className="text-red-500 text-sm mt-1">Le nombre de séances doit être supérieur à 0</p>
              )}
            </div>
            <div>
              <label className="block font-semibold mb-1">Prix</label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={form.prixTicket}
                onChange={(e) => handleFormChange('prixTicket', e.target.value)}
                className={Number(form.prixTicket) < 0 ? 'border-red-500' : ''}
              />
              {Number(form.prixTicket) < 0 && (
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
            <DialogTitle>Détails du ticket</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Nom</label>
              <Input
                value={form.typeTicket}
                onChange={(e) => handleFormChange('typeTicket', e.target.value)}
                disabled={!editMode}
                className={editMode && form.typeTicket.trim() === '' ? 'border-red-500' : ''}
              />
              {editMode && form.typeTicket.trim() === '' && (
                <p className="text-red-500 text-sm mt-1">Le nom est requis</p>
              )}
            </div>
            <div>
              <label className="block font-semibold mb-1">Nombre de séances</label>
              <Input
                type="number"
                min={1}
                value={form.nbSeanceTicket}
                onChange={(e) => handleFormChange('nbSeanceTicket', e.target.value)}
                disabled={!editMode}
                className={editMode && Number(form.nbSeanceTicket) <= 0 ? 'border-red-500' : ''}
              />
              {editMode && Number(form.nbSeanceTicket) <= 0 && (
                <p className="text-red-500 text-sm mt-1">Le nombre de séances doit être supérieur à 0</p>
              )}
            </div>
            <div>
              <label className="block font-semibold mb-1">Prix</label>
              <Input
                type="number"
                step="0.01"
                value={form.prixTicket}
                onChange={(e) => handleFormChange('prixTicket', e.target.value)}
                disabled={!editMode}
                className={editMode && Number(form.prixTicket) < 0 ? 'border-red-500' : ''}
              />
              {editMode && Number(form.prixTicket) < 0 && (
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
        aria-label="Ajouter un ticket"
      >
        <Plus size={28} />
      </Button>
    </div>
  );
}
