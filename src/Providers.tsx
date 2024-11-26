import { Outlet } from "react-router-dom";
import { UserDataProvider } from "./context/AuthContext";
import { ShoppingListProvider } from "./context/ShoppingListContext";

const Providers = () => {
  return (
    <UserDataProvider>
      <ShoppingListProvider>
        <Outlet />
      </ShoppingListProvider>
    </UserDataProvider>
  );
};

export default Providers;
