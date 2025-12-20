import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import ProtectedRoute from "@/src/components/ProtectionRoute";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full overflow-hidden">
      <body className="font-sans antialiased h-full">
        {/* Ajoutez h-full au body */}
        <ProtectedRoute>
          <div className="h-full">
            {children}
          </div>
        </ProtectedRoute>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Zoom}
        />
      </body>
    </html>
  );
}