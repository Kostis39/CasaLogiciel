"use client";
import { Suspense } from "react";
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

// Composant qui utilise useSearchParams
const MarketPageContent = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const id = searchParams.get("id") || "";

  const { cartItems, clearCart, totalPrice, totalQuantity } = useCart();

  const [viewType, setViewType] = useState<"abo&ticket" | "produits">("abo&ticket");
  const [items, setItems] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    fetchTickets().then(setTickets);
    fetchAbonnements().then(setItems);
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
              <ShoppingCart />
              {cartItems.length > 0 && (
                <p className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {totalQuantity()}
                </p>
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
                {cartItems.some((item) => item.type === "abonnement") && (
                  <ItemCartContainer type="abonnement" />
                )}

                {cartItems.some((item) => item.type === "ticket") && (
                  <ItemCartContainer type="ticket" />
                )}

                {cartItems.some((item) => item.type === "produit") && (
                  <ItemCartContainer type="produit" />
                )}

                <div className="mt-4 font-bold flex justify-between">
                  <p>Total :</p>
                  <p> {`${totalPrice().toFixed(2)} €`} </p>
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

      <div className="mt-4 space-y-2">
        {viewType === "abo&ticket" && (
          <div className="space-y-8">
            <ItemListCantainer titre="Abonnements" itemLenght={items.length}>
              {items.map((abonnement) => (
                <ItemCard
                  key={`abo-${abonnement.IdAbo}`}
                  id={abonnement.IdAbo}
                  name={abonnement.TypeAbo}
                  price={abonnement.PrixAbo}
                  duration={abonnement.DureeAbo}
                  type="abonnement"
                />
              ))}
            </ItemListCantainer>

            <ItemListCantainer titre="Tickets" itemLenght={tickets.length}>
              {tickets.map((ticket) => (
                <ItemCard
                  key={`ticket-${ticket.IdTicket}`}
                  id={ticket.IdTicket}
                  name={ticket.TypeTicket}
                  price={ticket.PrixTicket}
                  duration={ticket.NbSeanceTicket}
                  type="ticket"
                />
              ))}
            </ItemListCantainer>
          </div>
        )}

        {viewType === "produits" && (
          <ItemListCantainer titre="Produits" itemLenght={items.length}>
            {items.map((prod) => (
              <ItemCard
                key={`prod-${prod.IdProduit}`}
                id={prod.IdProduit}
                name={prod.NomProduit}
                price={prod.PrixProduit}
                type="produit"
              />
            ))}
          </ItemListCantainer>
        )}
      </div>
    </div>
  );
};

// Composant principal avec Suspense
const MarketPage = () => {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <MarketPageContent />
    </Suspense>
  );
};

export default MarketPage;
