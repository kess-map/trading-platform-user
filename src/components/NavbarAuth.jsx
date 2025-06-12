import { Link, useLocation } from 'react-router-dom';

const NavbarAuth = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <nav className="w-full py-4 px-6 h-25 flex justify-between items-center">
      <div className='h-14 overflow-hidden'>
        <img src="/logo2.png" alt="logo" className='object-contain h-14'/>
      </div>
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
