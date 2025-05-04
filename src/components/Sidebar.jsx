import { Link } from 'react-router-dom';
import {useAuthStore} from '../store/authStore'

const Sidebar = ({ isOpen, onClose }) => {
  const {user} = useAuthStore()
  return (
    <div
      className={`fixed inset-y-0 left-0 w-screen bg-black text-white p-6 z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:hidden`}
    >

      <div className="flex justify-end mb-6">
        <button onClick={onClose} className="text-white text-2xl font-bold">
          &times;
        </button>
      </div>

      {/* User Info */}
      <div className="mb-8">
        <div className="text-lg font-semibold">{user.fullName}</div>
        <span className={`text-xs mt-1 inline-block px-2 py-1 ${user.isDocumentVerified ? 'bg-green-700' : 'bg-red-700'} text-white rounded-md`}>
          {user.isDocumentVerified ? 'Verified' : 'Unverified'}
        </span>
      </div>

      {/* Nav Links */}
      <nav className="space-y-4 text-sm">
        <Link to="/orders" className="block hover:text-gray-400">Orders</Link>
        <Link to="/investment" className="block hover:text-gray-400">Investment</Link>
        <Link to="/affiliate" className="block hover:text-gray-400">Affiliate & Referral</Link>
        <Link to="/announcement" className="block hover:text-gray-400">Announcement</Link>
        <Link to="/settings" className="block hover:text-gray-400">Settings</Link>
        <Link to="/support" className="block hover:text-gray-400">Support</Link>
      </nav>
    </div>
  );
};

export default Sidebar;
