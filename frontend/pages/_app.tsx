import Head from "next/head";
import { CartProvider } from "@/contexts/CartContext";
import { AdminProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Vending Brothers</title>
        <meta
          name="description"
          content="Your favorite snacks and drinks, delivered instantly"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <main className="flex-grow">
          <AdminProvider>
            <CartProvider>
              <Toaster position="top-right" />
              <Component {...pageProps} />
            </CartProvider>
          </AdminProvider>
        </main>
        <footer className="bg-gray-800 text-white py-4 text-center">
          <p>Copyright &copy; Vending Brothers {new Date().getFullYear()}</p>
        </footer>
      </div>
    </>
  );
}
