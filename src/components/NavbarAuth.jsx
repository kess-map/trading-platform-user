import { Link, useLocation } from 'react-router-dom';

const NavbarAuth = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <nav className="bg-[#FCFAFF] shadow-md w-full py-4 px-6 flex justify-between items-center">
      <div className="text-2xl font-bold text-[#0A0D03]">Logo</div>
      <Link
        to={isLoginPage ? '/signup' : '/login'}
        className=" text-gray-900 font-semibold px-4 py-2 rounded underline"
      >
        {isLoginPage ? 'Sign up' : 'Login'}
      </Link>
    </nav>
  );
};

export default NavbarAuth;
