import { CartProvider } from "@/src/components/client_ui/cardContext";

export default function ProfilLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <CartProvider>
            {children}
      </CartProvider>   
    </div>
  );
}
