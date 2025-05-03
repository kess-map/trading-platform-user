import { Link, useLocation } from 'react-router-dom';

const NavbarAuth = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <nav className="bg-black shadow-md w-full py-4 px-6 flex justify-between items-center">
      <div className="text-2xl font-bold text-white">Logo</div>
      <Link
        to={isLoginPage ? '/signup' : '/login'}
        className="bg-lime-400 text-gray-900 font-semibold px-4 py-2 rounded hover:bg-lime-500 transition"
      >
        {isLoginPage ? 'Sign up' : 'Login'}
      </Link>
    </nav>
  );
};

export default NavbarAuth;
