import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // → d'abord
import "./globals.css";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full">
      <body
        className="font-sans antialiased"
      >
      {children}
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