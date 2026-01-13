import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { AuthProvider } from "@/context/AuthContext";
import "../styles/globals.css";
import { Toaster } from "react-hot-toast";

// This component handles the conditional rendering of navbar/footer
function AppLayout({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // List of routes where navbar should not be displayed
  const noNavbarRoutes = ["/login", "/signup"];
  const showNavbar = !noNavbarRoutes.includes(router.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {showNavbar && <Navbar />}
      <main className="flex-grow">
        <Component {...pageProps} />
      </main>
      {showNavbar && <Footer />}
    </div>
  );
}

export default function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <AuthProvider>
      <AppLayout Component={Component} pageProps={pageProps} router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            style: {
              background: "#10b981", // green-500
              color: "white",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#10b981",
            },
          },
          error: {
            duration: 4000,
            style: {
              background: "#ef4444", // red-500
              color: "white",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#ef4444",
            },
          },
        }}
      />
    </AuthProvider>
  );
}
