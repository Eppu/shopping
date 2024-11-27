import { useUser } from "../context/AuthContext";
import { auth } from "../firebase/firebase";

import List from "@/components/List";
import { useShoppingList } from "@/context/ShoppingListContext";
import { Toaster } from "@/components/ui/sonner";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import LandingPageContent from "@/components/LandingPageContent";

const HomePage = () => {
  const { user } = useUser();
  const { selectedShoppingList } = useShoppingList();

  return (
    <>
      <Helmet>
        <title>
          {selectedShoppingList ? selectedShoppingList.name : "Ostis"}
        </title>
        <meta name="description" content="Kotisivu" />
      </Helmet>

      <div className="flex flex-col h-screen">
        <Toaster
          closeButton
          richColors
          position="bottom-center"
          expand
          visibleToasts={9}
        />
        <header className="px-4 py-3 bg-white text-black flex justify-between rounded-b-md shadow-sm h-13">
          <a href="/" className="flex gap-1 items-center">
            <div className="flex gap-1 items-center">
              <img src="/logo.svg" alt="logo" className="h-6" />
              <h1 className="text-xl font-poppinsMedium">ostis</h1>
            </div>
          </a>
          {!user ? (
            <Link to="/login">Kirjaudu sisään</Link>
          ) : (
            <button onClick={() => auth.signOut()}>Kirjaudu ulos</button>
          )}
        </header>

        <main className="h-full  w-full lg:max-w-4xl lg:mx-auto">
          {!user ? (
            <LandingPageContent />
          ) : (
            // align this div to the center of the entire page
            // <div className="flex flex-col items-center px-1 py-32">
            //   Tähän tulee landing pagen sisällöt
            // </div>
            <div className="h-full pt-0 2xl:pt-8 lg:pt-4 overflow-none">
              <List />
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default HomePage;
