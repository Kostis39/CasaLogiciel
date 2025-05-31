"use client";

import { useCart } from "@/src/components/client_ui/cardContext";
import { Button } from "@/src/components/ui/button";

const Panier = () => {
const { cartItems, removeFromCart, addToCart, removeOneFromCart, clearCart } = useCart();

  return (
    <div>
      <Button
      onClick={() =>
        addToCart({ id: 1, name: "Entrée adulte", price: 10 })
      }
    >
      Ajouter au panier
    </Button>
    <Button
      onClick={() =>
        addToCart({ id: 2, name: "Entrée enfant", price: 8 })
      }
    >
      Ajouter au nn
    </Button>
      <h2>Panier</h2>
      {cartItems.length === 0 ? (
        <p>Panier vide</p>
      ) : (
        cartItems.map((item) => (
          <div key={item.id}>
            <p>{item.name} (x{item.quantity}) - {item.price} €</p>
            <button onClick={() => removeFromCart(item.id)}>Supprimer tout </button>
            <button onClick={() => removeOneFromCart(item.id)}>Supprimer 1</button>

          </div>
        ))
      )}
<Button
  onClick={() => {
    const currentCart = [...cartItems]; // on capture l’état actuel
    console.log("Panier items:", currentCart);
  }}
>
  Confirmer
</Button>

    </div>
  );
  
};

export default Panier;
