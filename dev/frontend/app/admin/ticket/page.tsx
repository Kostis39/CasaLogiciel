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

interface Ticket {
  IdTicket: number;
  TypeTicket: string;
  NbSeanceTicket: number;
  PrixTicket: number;
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [typeTicket, setTypeTicket] = useState('');
  const [nbSeanceTicket, setNbSeanceTicket] = useState('');
  const [prixTicket, setPrixTicket] = useState('');

  useEffect(() => {
    storeTickets();
  }, []);

  const storeTickets = async () => {
    const res = await fetchTickets();
    if (res.success && Array.isArray(res.data)) {
      setTickets(res.data);
    } else {
      toast.warning(res.message || 'Impossible de récupérer les tickets');
    }
  };

  const openCreateDialog = () => {
    setSelectedTicket(null);
    setTypeTicket('');
    setNbSeanceTicket('');
    setPrixTicket('');
    setEditMode(true);
    setIsCreateDialogOpen(true);
    setConfirmDelete(false);
  };

  const openDetailDialog = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setTypeTicket(ticket.TypeTicket);
    setNbSeanceTicket(ticket.NbSeanceTicket.toString());
    setPrixTicket(ticket.PrixTicket.toString());
    setEditMode(false);
    setIsDetailDialogOpen(true);
    setConfirmDelete(false);
  };

  const handleCreate = async () => {
    if (!typeTicket || !nbSeanceTicket || !prixTicket) return;

    const body = {
      TypeTicket: typeTicket,
      NbSeanceTicket: parseInt(nbSeanceTicket),
      PrixTicket: parseFloat(prixTicket),
    };

    const res = await postTicket(body);
    if (res.success) {
      await storeTickets();
      setIsCreateDialogOpen(false);
    } else {
      toast.warning(res.message);
    }
  };

  const handleUpdate = async () => {
    if (!selectedTicket) return;

    const body = {
      TypeTicket: typeTicket,
      NbSeanceTicket: parseInt(nbSeanceTicket),
      PrixTicket: parseFloat(prixTicket),
    };

    const res = await updateTicket(selectedTicket.IdTicket, body);
    if (res.success) {
      await storeTickets();
      setEditMode(false);
    } else {
      toast.warning(res.message);
    }
  };

  const handleDelete = async () => {
    if (!selectedTicket) return;

    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    const res = await deleteTicket(selectedTicket.IdTicket);
    if (res.success) {
      await storeTickets();
      setIsDetailDialogOpen(false);
      setConfirmDelete(false);
    } else {
      toast.warning(res.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 space-y-6">
      <h1 className="text-3xl font-semibold mb-4">Tickets</h1>

      <div className="w-full max-w-2xl bg-white rounded shadow p-6 space-y-4">
        {Array.isArray(tickets) && tickets.length === 0 ? (
          <p className="text-center text-gray-500">Aucun ticket disponible.</p>
        ) : (
          tickets.map((ticket) => (
            <div
              key={ticket.IdTicket}
              className="flex justify-between items-center border-b py-3 cursor-pointer hover:bg-blue-50"
              onClick={() => openDetailDialog(ticket)}
              onContextMenu={(e) => {
                e.preventDefault();
                openDetailDialog(ticket);
              }}
            >
              <div className="font-medium">{ticket.TypeTicket}</div>
              <div className="text-gray-600 flex gap-6 min-w-[150px] justify-end">
                <div>Quantité: {ticket.NbSeanceTicket} séance(s)</div>
                <div>Prix: {ticket.PrixTicket.toFixed(2)} €</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bouton création + */}
      <Button
        onClick={openCreateDialog}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 shadow-lg"
        aria-label="Ajouter un ticket"
      >
        <Plus size={28} />
      </Button>

      {/* Dialog Création */}
      <Dialog
        open={isCreateDialogOpen}
        onOpenChange={() => {
          setIsCreateDialogOpen(false);
          setEditMode(false);
          setConfirmDelete(false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouveau ticket</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-1" htmlFor="typeTicketCreate">
                Nom
              </label>
              <Input
                id="typeTicketCreate"
                value={typeTicket}
                onChange={(e) => setTypeTicket(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1" htmlFor="nbSeanceTicketCreate">
                Nombre de séances
              </label>
              <Input
                id="nbSeanceTicketCreate"
                type="number"
                min={1}
                value={nbSeanceTicket}
                onChange={(e) => setNbSeanceTicket(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1" htmlFor="prixTicketCreate">
                Prix
              </label>
              <Input
                id="prixTicketCreate"
                type="number"
                step="0.01"
                min={0}
                value={prixTicket}
                onChange={(e) => setPrixTicket(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="flex justify-end mt-6 gap-2">
            <Button variant="secondary" onClick={() => setIsCreateDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleCreate}
              disabled={
                !typeTicket.trim() ||
                !nbSeanceTicket ||
                isNaN(parseInt(nbSeanceTicket)) ||
                !prixTicket ||
                isNaN(parseFloat(prixTicket))
              }
            >
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Détail */}
      <Dialog
        open={isDetailDialogOpen}
        onOpenChange={() => {
          setIsDetailDialogOpen(false);
          setEditMode(false);
          setConfirmDelete(false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails du ticket</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-1" htmlFor="typeTicketDetail">
                Nom
              </label>
              <Input
                id="typeTicketDetail"
                value={typeTicket}
                onChange={(e) => setTypeTicket(e.target.value)}
                disabled={!editMode}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1" htmlFor="nbSeanceTicketDetail">
                Nombre de séances
              </label>
              <Input
                id="nbSeanceTicketDetail"
                type="number"
                min={1}
                value={nbSeanceTicket}
                onChange={(e) => setNbSeanceTicket(e.target.value)}
                disabled={!editMode}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1" htmlFor="prixTicketDetail">
                Prix
              </label>
              <Input
                id="prixTicketDetail"
                type="number"
                step="0.01"
                min={0}
                value={prixTicket}
                onChange={(e) => setPrixTicket(e.target.value)}
                disabled={!editMode}
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
                >
                  {confirmDelete ? 'Confirmer suppression' : 'Supprimer'}
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
                  disabled={
                    !typeTicket.trim() ||
                    !nbSeanceTicket ||
                    isNaN(parseInt(nbSeanceTicket)) ||
                    !prixTicket ||
                    isNaN(parseFloat(prixTicket))
                  }
                >
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
