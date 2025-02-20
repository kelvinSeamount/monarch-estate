import { Link } from "react-router-dom";
import Logo from "../assets/Logo.png";
import { FaSearch } from "react-icons/fa";
const Header = () => {
  return (
    <div className="bg-white shadow-md ">
      <div className="flex justify-between max-w-6xl mx-auto items-center p-3 h-[60px]">
        <Link to="/">
          <div className="font-bold">
            <img src={Logo} alt="logo" className="w-30 h-30 object-contain" />
          </div>
        </Link>

        <form className="bg-[#e2e8f0] p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <FaSearch className="text-slate-600" />
        </form>

        <ul className="flex gap-4">
          <Link to="/about">
            <li className="hidden sm:inline hover:underline text-slate-700">
              About
            </li>
          </Link>
          <Link to="/sign-in">
            <li className=" hover:underline text-slate-700">Sign in</li>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default Header;
