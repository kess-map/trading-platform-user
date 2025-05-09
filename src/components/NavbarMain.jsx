import { Link } from 'react-router-dom';
import { Bell, Moon } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const NavbarMain = ({onMenuClick}) => {
  const {user} = useAuthStore()
  return (
    <nav className="bg-black shadow-md w-full py-4 px-6 flex justify-between items-center">
      <div className='flex'>
        <button onClick={onMenuClick} className="md:hidden text-white text-2xl ">
            ☰
          </button>
        <div className="ml-5 text-2xl font-bold text-white">Logo</div>
      </div>

      <ul className="hidden md:flex items-center space-x-6 text-sm font-medium text-white">
        <li><Link to="/home" className="hover:text-primary">Home</Link></li>
        <li><Link to="/orders" className="hover:text-primary">Orders</Link></li>
        <li><Link to="/investment" className="hover:text-primary">Investment</Link></li>
        <li><Link to="/affiliate" className="hover:text-primary">Affiliate & Referral</Link></li>
        <li><Link to="/settings" className="hover:text-primary">Settings</Link></li>
        <li><Link to="/support" className="hover:text-primary">Support</Link></li>
      </ul>

      <div className="flex items-center space-x-4">
        <Link to={'/notifications'}><Bell className="w-5 h-5 text-black fill-white cursor-pointer" /></Link>
        <Moon className="w-5 h-5 text-black fill-white cursor-pointer" />
        <div className="w-8 h-8 rounded-full bg-purple-300 text-white flex items-center justify-center font-bold">
          {user.username.charAt(0).toUpperCase()}
        </div>
      </div>
    </nav>
  );
};

export default NavbarMain;