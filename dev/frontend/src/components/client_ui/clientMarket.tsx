import { Button } from "../ui/button";
import { useCart } from "./cardContext";

type ItemCardProps = {
  id: number;
  name: string;
  price: number;
  duration?: number;
  type: "abonnement" | "produit" | "ticket";
};

export const ItemCard = ({ id, name, price, duration, type }: ItemCardProps) => {
  const { cartItems, addToCart, removeOneFromCart } = useCart();
  const quantity = cartItems.find((item) => item.id === id && item.type === type)?.quantity || 0;
  const color = "blue";

  return (
    <div
      className={`relative bg-white border rounded-xl shadow-sm p-4 transition-transform hover:shadow-md hover:scale-[1.01] cursor-pointer
        ${quantity > 0 ? `border-${color}-500 ring-1 ring-${color}-200 bg-${color}-50` : `hover:border-${color}-300`}
      `}
      onClick={() =>
        addToCart({
          id: id,
          name: name,
          price: price,
          type: type,
        })
      }
      onContextMenu={(e) => {
        e.preventDefault();
        removeOneFromCart(id, type);
      }}
    >
      {quantity > 0 && (
        <div className={`absolute top-2 right-2 bg-${color}-600 text-white text-xs px-2 py-0.5 rounded-full shadow`}>
          x{quantity}
        </div>
      )}

      <h3 className="text-lg font-semibold text-gray-800 mb-2">{name}</h3>

      <div className="text-sm text-gray-600">
        {type === "abonnement" && duration !== undefined && (
          <div>Durée : {duration} jours</div>
        )}
        {type === "ticket" && duration !== undefined && (
          <div>Séances : {duration}</div>
        )}
        <div>Prix : {price.toFixed(2)} €</div>
      </div>
    </div>
  );
};

export const ItemListCantainer = ({ titre, itemLenght, children }: { titre: string, itemLenght: number, children: React.ReactNode }) => {
  if (itemLenght === 0 || itemLenght < 0) {
    return (
      <p className="text-center text-gray-500">Aucun {titre} disponible.</p>
    );
  }
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{titre}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {children}
      </div>
    </div>

  );
}

export const ItemCartContainer = ({ type }: { type: string }) => {
  const { cartItems, addToCart, removeOneFromCart } = useCart();
  return (
          <div>
            <h4 className="text-lg font-semibold mb-2">{type.charAt(0).toUpperCase() + type.slice(1)}</h4>
            <ul className="space-y-2">
              {cartItems
                .filter((item) => item.type === type)
                .map((item) => (
                  <li
                    key={`${item.id}-${type}`}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        {(item.price * (item.quantity ?? 1)).toFixed(2)} €
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => removeOneFromCart(item.id, item.type)}
                      >
                        -
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => addToCart(item)}
                      >
                        +
                      </Button>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
  );
}