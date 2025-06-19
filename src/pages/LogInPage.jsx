import { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom'
import {useAuthStore} from '../store/authStore'
import toast from 'react-hot-toast';
import LiveSessionTimer from '../components/Timer';
import axiosInstance from '../utils/axios';

const SignupPage = () => {
  const navigate = useNavigate()
  const {user, setUser} = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(()=>{
        if(user && user.isPhoneVerified){
          navigate('/home')
        }
      },[user])

  const handleChange = (e)=>{
    const {name, value, type, checked} = e.target

    setFormData((prev)=>({
      ...prev, [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    if(!formData.email || !formData.password){
      return toast.error('Fill in all fields')
    }
    try {
      setIsLoading(true);
      const response = await axiosInstance.post('/auth/login', formData);
      const user = response.data.data.user;

      toast.success(response.data.message);

      // Optional: Save user globally, if needed later
      setUser(user);

      // ✅ Navigate only after everything is done
      navigate('/home', { replace: true});
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4">
      <div className="w-full max-w-xl  rounded-xl p-8 mt-10">
        <h2 className="text-4xl font-bold text-left mb-6 text-[#0A0D03]">Welcome back</h2>

        <form onSubmit={handleSubmit} >
            <div className="w-full">
              <label className="text-sm mb-1 block text-[#5B6069]">Email</label>
              <input
                type="email"
                name='email'
                value={formData.email}
                onChange={handleChange}
                placeholder="denilson@gmail.com"
                className="w-full mb-8 px-4 py-2 rounded-md text-black bg-[#FCFAFF] border border-[#00000080] placeholder-[#84888F] focus:outline-none focus:ring-2 focus:ring-[#00000080]"
              />
            </div>

            <div className="w-full mb-10">
              <label className="text-sm mb-1 block text-[#5B6069]">Password</label>
              <input
                type="password"
                name='password'
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                className="w-full px-4 py-2 rounded-md text-black bg-[#FCFAFF] border border-[#00000080] placeholder-[#84888F] focus:outline-none focus:ring-2 focus:ring-[#00000080]"
              />
            </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-lime-400 text-black font-semibold rounded-md hover:bg-lime-300 transition"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;