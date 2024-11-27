import { Link } from "react-router-dom";
// import { useUser } from "../context/AuthContext";

import SignIn from "@/components/SignIn";
import { Helmet } from "react-helmet";

const LoginPage = () => {
  //   const { user } = useUser();

  return (
    <>
      <Helmet>
        <title>Kirjaudu sisään | Ostis</title>
        <meta name="description" content="Kirjaudu sisään" />
      </Helmet>

      <div className="flex flex-col h-screen">
        <header className="px-4 py-3 bg-white text-black flex justify-between rounded-b-md shadow-sm h-13">
          <a href="/" className="flex gap-1 items-center">
            <div className="flex gap-1 items-center">
              <img src="/logo.svg" alt="logo" className="h-6" />
              <h1 className="text-xl font-poppinsMedium">ostis</h1>
            </div>
          </a>
          <Link to="/register">
            <button>Luo tili</button>
          </Link>
        </header>

        <main className="h-full  w-full lg:max-w-4xl lg:mx-auto">
          <div className="flex flex-col items-center px-1 py-32">
            <SignIn />
          </div>
        </main>
      </div>
    </>
  );
};

export default LoginPage;
