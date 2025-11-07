"use client";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import LoadingSpinner from "@/src/components/client_ui/LoadingSpinner";
import { Abonnement, ApiResponse, Seance, Ticket, Transaction } from "@/src/types&fields/types";
import { ConfirmButton } from "@/src/components/client_ui/buttonConfirm";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Card } from "@/src/components/ui/card";
import Image from "next/image";
import {fetchAbonnements, fetchTickets } from "@/src/services/api";
import { API_URL } from "@/src/services/real";

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr; // si ce n’est pas une vraie date
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};


// Modal générique pour modifier
function EditModal<T extends object>({
  item,
  fields,
  onClose,
  onSave,
}: {
  item: T | null;
  fields: (keyof T)[];
  onClose: () => void;
  onSave: (updated: T) => void;
}) {
  const [formData, setFormData] = useState<T | null>(item);

  useEffect(() => {
    setFormData(item);
  }, [item]);

  if (!item || !formData) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <Card className="relative bg-white p-6 rounded-lg shadow-lg w-[480px] z-10 border-0">
        <h2 className="text-xl font-semibold mb-4">Modifier</h2>
        <div className="space-y-4">
          {fields.map((key) => (
            <div key={String(key)}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {String(key)}
              </label>
              <Input
                type="text"
                value={(formData as any)[key] ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, [key]: e.target.value })
                }
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Annuler
          </Button>
          <Button
            onClick={() => onSave(formData)}
          >
            Enregistrer
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default function AdminPage() {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editingSeance, setEditingSeance] = useState<Seance | null>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  // Pour stocker les noms des tickets/abonnements par id
  const [objectNames, setObjectNames] = useState<Record<string, string>>({});
  const [abonnements, setAbonnements] = useState<Abonnement[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const loadData = async () => {
        const aboRes = await fetchAbonnements();
      if (aboRes.success && aboRes.data) setAbonnements(aboRes.data);
        const ticketRes = await fetchTickets();
      if (ticketRes.success && ticketRes.data) setTickets(ticketRes.data);
    };
    loadData();
  }, []);

  useEffect(() => {
  const names: Record<string, string> = {};

  tickets.forEach((t) => {
    names[`ticket-${t.IdTicket}`] = t.TypeTicket;
  });

  abonnements.forEach((a) => {
    names[`abonnement-${a.IdAbo}`] = a.TypeAbo;
  });

  setObjectNames(names);
}, [tickets, abonnements]);


  // Récupère le nom du ticket ou abonnement pour une transaction
  const getObjectName = (type: "ticket" | "abonnement", id: number) => {
    if (type === "ticket") {
      const ticket = tickets.find((t) => t.IdTicket === id);
      return ticket?.TypeTicket || "Ticket inconnu";
    } else if (type === "abonnement") {
      const abo = abonnements.find((a) => a.IdAbo === id);
      return abo?.TypeAbo || "Abonnement inconnu";
    }
    return "-";
  };



  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [seances, setSeances] = useState<Seance[]>([]);
  const [tab, setTab] = useState<"transactions" | "seances">("transactions");
  const [totalTransactions, setTotalTransactions] = useState<number>(0);
  const [totalSeances, setTotalSeances] = useState<number>(0);

  const [filters, setFilters] = useState({
    type: "all",
    id: "",
    grimpeur: "",
    date: "",
    limit: 20,
    offset: 0,
  });

  const [hasMoreTransactions, setHasMoreTransactions] = useState(true);
  const [hasMoreSeances, setHasMoreSeances] = useState(true);

  // Précharge les noms à chaque chargement des transactions
  useEffect(() => {
    const fetchNames = async () => {
      const promises = transactions.map(async (t) => {
        if ((t.TypeObjet === "ticket" || t.TypeObjet === "abonnement") && t.IdObjet) {
          getObjectName(t.TypeObjet, t.IdObjet);
        }
      });
      await Promise.all(promises);
    };
    if (transactions.length) fetchNames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions]);

  // Précharge les noms à chaque chargement des transactions
  useEffect(() => {
    const fetchNames = async () => {
      const promises = transactions.map(async (t) => {
        if ((t.TypeObjet === "ticket" || t.TypeObjet === "abonnement") && t.IdObjet) {
          await getObjectName(t.TypeObjet, t.IdObjet);
        }
      });
      await Promise.all(promises);
    };
    if (transactions.length) fetchNames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions]);

  // -------------------------------
  // FETCH TRANSACTIONS
  // -------------------------------
  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      let url = `${API_URL}/transactions`;
      if (filters.type === "id" && filters.id)
        url = `${API_URL}/transactions/id/${filters.id}`;
      else if (filters.type === "grimpeur" && filters.grimpeur)
        url = `${API_URL}/transactions/grimpeur/${filters.grimpeur}`;
      else if (filters.type === "date" && filters.date)
        url = `${API_URL}/transactions/date/${filters.date}`;

      url += `?limit=${filters.limit}&offset=${filters.offset}`;

      const res = await fetch(url);
      const json: ApiResponse<Transaction[]> = await res.json();

      if (res.ok && json.data) {
        setTransactions(json.data);
        setTotalTransactions(json.total || 0);
        setHasMoreTransactions(filters.offset + filters.limit < (json.total || 0));
      } else {
        setTransactions([]);
        setTotalTransactions(0);
        setHasMoreTransactions(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors du chargement des transactions");
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------
  // FETCH SEANCES
  // -------------------------------
  const fetchSeances = async () => {
    setIsLoading(true);
    try {
      let url = `${API_URL}/seances`;
      if (filters.type === "id" && filters.id)
        url = `${API_URL}/seances/id/${filters.id}`;
      else if (filters.type === "grimpeur" && filters.grimpeur)
        url = `${API_URL}/seances/grimpeur/${filters.grimpeur}`;
      else if (filters.type === "date" && filters.date)
        url = `${API_URL}/seances/date/${filters.date}`;

      url += `?limit=${filters.limit}&offset=${filters.offset}`;

      const res = await fetch(url);
      const json: ApiResponse<Seance[]> = await res.json();

      if (res.ok && json.data) {
        setSeances(json.data);
        setTotalSeances(json.total || 0);
        setHasMoreSeances(filters.offset + filters.limit < (json.total || 0));
      } else {
        setSeances([]);
        setTotalSeances(0);
        setHasMoreSeances(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors du chargement des séances");
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------
  // AUTO-REFRESH LORSQUE FILTRES OU ONGLET CHANGE
  // -------------------------------
  useEffect(() => {
    if (tab === "transactions") fetchTransactions();
    else fetchSeances();
  }, [filters, tab]);

  // -------------------------------
  // SAVE / DELETE
  // -------------------------------
  const handleSaveTransaction = async (t: Transaction) => {
    const res = await fetch(`${API_URL}/transactions`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(t),
    });
    const response = await res.json();
    if (res.ok) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
    setEditingTransaction(null);
    fetchTransactions();
  };

  const handleSaveSeance = async (s: Seance) => {
    const res = await fetch(`${API_URL}/seances`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(s),
    });
    const response = await res.json();
    if (res.ok) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
    setEditingSeance(null);
    fetchSeances();
  };

  const handleDeleteTransaction = async (id: number) => {
    const res = await fetch(`${API_URL}/transactions/id/${id}`, {
      method: "DELETE",
    });
    const response = await res.json();
    if (res.ok) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
    fetchTransactions();
  };

  const handleDeleteSeance = async (id: number) => {
    const res = await fetch(`${API_URL}/seances/id/${id}`, { method: "DELETE" });
    const response = await res.json();
    if (res.ok) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
    fetchSeances();
  };

  // -------------------------------
  // UI
  // -------------------------------
  return (
    <div className="p-6 overflow-auto bg-gray-50/30 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Historique</h1>

      <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-sm">
        {/* Onglets */}
        <div className="mb-6 flex flex-col gap-4" ref={tableContainerRef}>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setTab("transactions");
                setFilters((prev) => ({ ...prev, offset: 0 }));
              }}
              variant={tab === "transactions" ? "default" : "outline"}
              className="w-32 transition-all duration-200"
            >
              Transactions
            </Button>

            <Button
              onClick={() => {
                setTab("seances");
                setFilters((prev) => ({ ...prev, offset: 0 }));
              }}
              variant={tab === "seances" ? "default" : "outline"}
              className="w-32 transition-all duration-200"
            >
              Séances
            </Button>
          </div>

          {/* Filtres dynamiques */}
          <div className="flex flex-wrap gap-3 items-center">
            <Select 
              value={filters.type}
              onValueChange={(value) =>
                setFilters({
                  ...filters,
                  type: value,
                  id: "",
                  grimpeur: "",
                  date: "",
                  offset: 0,
                })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type de filtre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="id">Par ID</SelectItem>
                <SelectItem value="grimpeur">Par Grimpeur</SelectItem>
                <SelectItem value="date">Par Date</SelectItem>
              </SelectContent>
            </Select>

          {filters.type !== "all" && (
            <Input
              type={filters.type === "date" ? "date" : "number"}
              placeholder={
                filters.type === "id"
                  ? tab === "transactions"
                    ? "ID Transaction"
                    : "ID Séance"
                  : filters.type === "grimpeur"
                  ? "Num Grimpeur"
                  : "Date"
              }
              value={
                filters.type === "id"
                  ? filters.id
                  : filters.type === "grimpeur"
                  ? filters.grimpeur
                  : filters.date
              }
              onChange={(e) =>
                setFilters({
                  ...filters,
                  id: filters.type === "id" ? e.target.value : "",
                  grimpeur:
                    filters.type === "grimpeur" ? e.target.value : "",
                  date: filters.type === "date" ? e.target.value : "",
                  offset: 0,
                })
              }
              className="w-full md:w-64"
            />
          )}
          </div>
        </div>

      {/* TABLEAUX */}
      {isLoading ? (
        <LoadingSpinner />
      ) : tab === "transactions" ? (
        transactions.length ? (
          <div className="relative overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th className="p-4"><div className="flex items-center gap-2"><Image src="/hash.svg" alt="ID" width={16} height={16} /> ID</div></th>
                  <th className="p-4"><div className="flex items-center gap-2"><Image src="/user.svg" alt="Grimpeur" width={16} height={16} /> Grimpeur</div></th>
                  <th className="p-4">Type</th>
                  <th className="p-4"><div className="flex items-center gap-2"><Image src="/calendar.svg" alt="Date" width={16} height={16} /> Date</div></th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.IdTransac} className="border-t border-gray-200 bg-white hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium">{t.IdTransac}</td>
                    <td className="p-4">{t.NumGrimpeur ?? "-"}</td>
                      <td className={`p-4 rounded font-medium ${
                        t.TypeObjet === "ticket"
                          ? "text-blue-500"
                          : t.TypeObjet === "abonnement"
                          ? "text-green-500"
                          : "text-gray-500"
                      }`}>
                        {(t.TypeObjet === "ticket" || t.TypeObjet === "abonnement") && t.IdObjet
                          ? objectNames[`${t.TypeObjet}-${t.IdObjet}`] || t.TypeObjet
                          : t.TypeObjet}
                      </td>
                    <td className="p-4">{formatDate(t.DateTransac)}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingTransaction(t)}
                          className="h-8 px-2"
                        >
                          <Image src="/inscription.svg" alt="Modifier" width={16} height={16} className="mr-1" />
                          Modifier
                        </Button>
                        <ConfirmButton
                          triggerText={
                            <div className="flex items-center gap-1">
                              <Image src="/trash-2.svg" alt="Supprimer" width={16} height={16} />
                              <span>Supprimer</span>
                            </div>
                          }
                          title="Confirmation de suppression"
                          description={`Voulez-vous vraiment supprimer la transaction ${t.IdTransac} ?`}
                          onConfirm={() => handleDeleteTransaction(t.IdTransac)}
                          variantConfirm="destructive"
                          triggerSize="sm"
                          triggerVariant="outline"
                          triggerClassName="h-8 px-2"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 mt-4">Aucune transaction trouvée.</p>
        )
      ) : seances.length ? (
        <div className="relative overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="p-4"><div className="flex items-center gap-2"><Image src="/hash.svg" alt="ID" width={16} height={16} /> ID</div></th>
                <th className="p-4"><div className="flex items-center gap-2"><Image src="/user.svg" alt="Grimpeur" width={16} height={16} /> Grimpeur</div></th>
                <th className="p-4">Type</th>
                <th className="p-4"><div className="flex items-center gap-2"><Image src="/calendar.svg" alt="Date" width={16} height={16} /> Date</div></th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {seances.map((s) => (
                <tr key={s.IdSeance} className="border-t border-gray-200 bg-white hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium">{s.IdSeance}</td>
                  <td className="p-4">{s.NumGrimpeur}</td>
<td className={`p-4 rounded font-medium ${
  s.AboId ? "text-green-500" : s.TicketId ? "text-blue-500" : "text-gray-500"
}`}>
  {s.AboId
    ? getObjectName("abonnement", s.AboId)
    : s.TicketId
    ? getObjectName("ticket", s.TicketId)
    : "-"}
</td>


                  <td className="p-4">{formatDate(s.DateSeance)}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingSeance(s)}
                        className="h-8 px-2"
                      >
                        <Image src="/inscription.svg" alt="Modifier" width={16} height={16} className="mr-1" />
                        Modifier
                      </Button>
                      <ConfirmButton
                        triggerText={
                          <div className="flex items-center gap-1">
                            <Image src="/trash-2.svg" alt="Supprimer" width={16} height={16} />
                            <span>Supprimer</span>
                          </div>
                        }
                        title="Confirmation de suppression"
                        description={`Voulez-vous vraiment supprimer la séance ${s.IdSeance} ?`}
                        onConfirm={() => handleDeleteSeance(s.IdSeance)}
                        variantConfirm="destructive"
                        triggerSize="sm"
                        triggerVariant="outline"
                        triggerClassName="h-8 px-2"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 mt-4">Aucune séance trouvée.</p>
      )}

      {/* PAGINATION */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={filters.offset === 0}
            onClick={() => setFilters((prev) => ({ ...prev, offset: 0 }))}
          >
            <Image src="/chevrons-left.svg" alt="Premier" width={16} height={16} />
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={filters.offset === 0}
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                offset: Math.max(0, prev.offset - prev.limit),
              }))
            }
          >
            <Image src="/chevron-left.svg" alt="Précédent" width={16} height={16} className="mr-1" />
            Précédent
          </Button>

          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-md border">
            <span className="text-gray-500">Page</span>
            <Input
              type="number"
              min="1"
              max={Math.ceil((tab === "transactions" ? totalTransactions : totalSeances) / filters.limit)}
              className="w-16 h-8 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={Math.floor(filters.offset / filters.limit) + 1}
              onChange={(e) => {
                const page = parseInt(e.target.value) || 1;
                const maxPage = Math.ceil((tab === "transactions" ? totalTransactions : totalSeances) / filters.limit);
                const targetPage = Math.min(Math.max(1, page), maxPage);
                setFilters((prev) => ({
                  ...prev,
                  offset: (targetPage - 1) * prev.limit,
                }));
              }}
            />
            <span className="text-gray-500">sur {Math.ceil((tab === "transactions" ? totalTransactions : totalSeances) / filters.limit)}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={tab === "transactions" ? !hasMoreTransactions : !hasMoreSeances}
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                offset: prev.offset + prev.limit,
              }))
            }
          >
            Suivant
            <Image src="/chevron-right.svg" alt="Suivant" width={16} height={16} className="ml-1" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={filters.offset === Math.floor((tab === "transactions" ? totalTransactions : totalSeances) / filters.limit) * filters.limit}
            onClick={() => {
              const total = tab === "transactions" ? totalTransactions : totalSeances;
              const maxOffset = Math.floor(total / filters.limit) * filters.limit;
              setFilters((prev) => ({
                ...prev,
                offset: maxOffset,
              }));
            }}
          >
            <Image src="/chevrons-right.svg" alt="Dernier" width={16} height={16} />
          </Button>
        </div>

        <div className="text-gray-500">
          Total : {tab === "transactions" ? totalTransactions : totalSeances} {tab === "transactions" ? "transactions" : "séances"}
        </div>
      </div>
      </Card>

      {/* MODALS */}
      {editingTransaction && (
        <EditModal
          item={editingTransaction}
          fields={Object.keys(editingTransaction as Transaction).filter(
            (k) => k !== "IdTransac"
          ) as (keyof Transaction)[]}
          onClose={() => setEditingTransaction(null)}
          onSave={handleSaveTransaction}
        />
      )}
      {editingSeance && (
        <EditModal
          item={editingSeance}
          fields={Object.keys(editingSeance as Seance).filter(
            (k) => k !== "IdSeance"
          ) as (keyof Seance)[]}
          onClose={() => setEditingSeance(null)}
          onSave={handleSaveSeance}
        />
      )}
    </div>
  );
}
