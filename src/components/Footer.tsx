import { Link } from "react-router-dom";
export default function Footer() {
  return (
    // <footer className="bg-white text-black py-4 px-4">
    //   <div className="flex justify-between items-center">
    //     <div className="flex gap-1 items-center">
    //       <img src="/logo.svg" alt="logo" className="h-6" />
    //       <h1 className="text-xl font-poppinsMedium">ostis</h1>
    //     </div>
    //     <div className="flex gap-4">
    //       <a href=" ">Tietosuojaseloste</a>
    //       <a href=" ">Käyttöehdot</a>
    //     </div>
    //   </div>
    // </footer>

    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        💚:lla Eetu Eskelinen
      </p>
      <nav className="sm:ml-auto flex gap-4 sm:gap-6 text-gray-500 dark:text-gray-400">
        <Link className="text-xs hover:underline underline-offset-4" to="#">
          Käyttöehdot
        </Link>
        <Link className="text-xs hover:underline underline-offset-4" to="#">
          Yksityisyys
        </Link>
      </nav>
    </footer>
  );
}
