"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/components/ui/dialog';

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/src/components/client_ui/cardContext";
import { Button, buttonVariants } from "@/src/components/ui/button";
import { fetchAbonnements, fetchProduits, fetchTickets } from "@/src/services/api";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ItemCard, ItemCartContainer, ItemListCantainer } from "@/src/components/client_ui/clientMarket";

const MarketPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const id = searchParams.get("id") || "";

  const { cartItems, clearCart } = useCart();

  const [viewType, setViewType] = useState<"abo&ticket" | "produits">("abo&ticket");
  const [items, setItems] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    fetchTickets().then(setTickets); // tickets toujours chargés au chargement de la page
    fetchAbonnements().then(setItems); // abonnements chargés par défaut dans items
    setViewType("abo&ticket");
  }, []);


  const handleLoadAbonnements = async () => {
    const data = await fetchAbonnements();
    setItems(data);
    setViewType("abo&ticket");
  };

  const handleLoadProduits = async () => {
    const data = await fetchProduits();
    setItems(data);
    setViewType("produits");
  };

  return (
    <div className="w-full flex flex-col p-4 gap-4">
      <div className="flex gap-2">
        <Button className="flex-1" size="lg" variant="outline" onClick={handleLoadAbonnements}>
          Achat Entrée
        </Button>

        <Button className="flex-1" size="lg" variant="outline" onClick={handleLoadProduits}>
          Achat Annexe
        </Button>

        <Link
          href={`/client?query=${query}&id=${id}`}
          className={`${buttonVariants({ size: "lg", variant: "outline" })} flex-1`}
        >
          Retour
        </Link>

        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg" variant="secondary" className="relative">
              <ShoppingCart className="w-6 h-6" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
                  {cartItems.reduce((total, item) => total + (item.quantity ?? 1), 0)}
                </span>
              )}
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Contenu du panier</DialogTitle>
            </DialogHeader>

        {cartItems.length === 0 ? (
          <p className="text-sm italic">Votre panier est vide</p>
        ) : (
          <>
            {/* Groupe Abonnements */}
            {cartItems.some((item) => item.type === "abonnement") && (
              <ItemCartContainer type="abonnement" />
            )}

            {/* Groupe Tickets */}
            {cartItems.some((item) => item.type === "ticket") && (
              <ItemCartContainer type="ticket" />
            )}

            {/* Groupe Produits */}
            {cartItems.some((item) => item.type === "produit") && (
              <ItemCartContainer type="produit" />
            )}

            {/* Total & Actions */}
            <div className="mt-4 font-bold flex justify-between">
              <span>Total :</span>
              <span>
                {cartItems
                  .reduce((acc, item) => acc + item.price * (item.quantity ?? 1), 0)
                  .toFixed(2)}{" "}
                €
              </span>
            </div>

            <Button
              variant="destructive"
              onClick={clearCart}
              className="mt-2 w-full"
            >
              Vider le panier
            </Button>
          </>
        )}

          </DialogContent>
        </Dialog>

      </div>

      {/* ✅ Affichage des produits/abonnements */}
      <div className="mt-4 space-y-2">
        
        {viewType === "abo&ticket" && (
          <div className="space-y-8">
            {/* Section abonnements */}
            <ItemListCantainer titre="Abonnements" itemLenght={items.length}>
                {items.map((abonnement) => {
                  return (
                    <ItemCard
                      key={`abo-${abonnement.IdAbo}`}
                      id={abonnement.IdAbo}
                      name={abonnement.TypeAbo}
                      price={abonnement.PrixAbo}
                      duration={abonnement.DureeAbo}
                      type="abonnement"
                    />
                  );
                })}
            </ItemListCantainer>

            {/* Section tickets */}
            <ItemListCantainer titre="Tickets" itemLenght={tickets.length}>
                {tickets.map((ticket) => {
                  return (
                    <ItemCard
                      key={`ticket-${ticket.IdTicket}`}
                      id={ticket.IdTicket}
                      name={ticket.TypeTicket}
                      price={ticket.PrixTicket}
                      duration={ticket.NbSeanceTicket}
                      type="ticket"
                    />
                  );
                })}
            </ItemListCantainer>
          </div>
        )}

        {viewType === "produits" && (
          <ItemListCantainer titre="Produits" itemLenght={items.length}>
              {items.map((prod) => {
                return (
                  <ItemCard
                  key={`prod-${prod.IdProduit}`}
                  id={prod.IdProduit}
                  name={prod.NomProduit}
                  price={prod.PrixProduit}
                  type="produit"
                  />
                );
              })}
        </ItemListCantainer>
        )}
    </div>
  </div>

  );
};

export default MarketPage;



