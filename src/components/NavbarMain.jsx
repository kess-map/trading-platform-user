import { Link } from 'react-router-dom';
import { Bell, Moon, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const NavbarMain = ({onMenuClick}) => {
  const {logout} = useAuthStore()
  return (
    <nav className="w-full py-4 px-6 flex justify-between items-center">
      <div className='flex'>
        <button onClick={onMenuClick} className="md:hidden text-white text-2xl ">
            ☰
          </button>
        <div className="ml-5 text-2xl font-bold text-[#0A0D03]">Logo</div>
      </div>

      <ul className="hidden md:flex items-center space-x-6 text-sm font-medium text-[#0A0D03]">
        <li><Link to="/home" className="hover:text-primary">Home</Link></li>
        <li><Link to="/orders" className="hover:text-primary">Orders</Link></li>
        <li><Link to="/investment" className="hover:text-primary">Investment</Link></li>
        <li><Link to="/affiliate" className="hover:text-primary">Affiliate & Referral</Link></li>
        <li><Link to="/settings" className="hover:text-primary">Settings</Link></li>
        <li><Link to="/support" className="hover:text-primary">Support</Link></li>
      </ul>

      <div className="flex items-center space-x-4">
        <Link to={'/notifications'}><Bell className="w-5 h-5 text-black fill-white cursor-pointer" /></Link>
        {/* <Moon className="w-5 h-5 text-black fill-white cursor-pointer" /> */}
        <span onClick={logout} className='hidden sm:block cursor-pointer'>Logout</span>
        <LogOut onClick={logout} className='sm:hidden cursor-pointer'/>
      </div>
    </nav>
  );
};

export default NavbarMain;