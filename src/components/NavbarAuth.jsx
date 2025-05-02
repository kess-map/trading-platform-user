import { Link, useLocation } from 'react-router-dom';

const NavbarAuth = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <nav className="bg-white shadow-md w-full py-4 px-6 flex justify-between items-center">
      <div className="text-2xl font-bold text-gray-900">Logo</div>
      <ul className="flex items-center space-x-8 text-sm font-medium text-gray-700">
        <li><Link to="/why-us" className="hover:text-primary">Why us?</Link></li>
        <li><Link to="/how-it-works" className="hover:text-primary">How it works</Link></li>
        <li><Link to="/faqs" className="hover:text-primary">FAQs</Link></li>
      </ul>
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
