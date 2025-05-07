import { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom'
import {useAuthStore} from '../store/authStore'
import toast from 'react-hot-toast';
import LiveSessionTimer from '../components/Timer';

const SignupPage = () => {
  const navigate = useNavigate()
  const {login, isLoading, user} = useAuthStore()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(()=>{
        if(user){
          navigate('/')
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
    await login(formData.email, formData.password)
    navigate('/home')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-xl bg-black rounded-xl shadow-lg p-8 border border-zinc-700">
        <h2 className="text-4xl font-bold text-left mb-6">Welcome back</h2>

        <form onSubmit={handleSubmit} >
            <div className="w-full">
              <label className="text-sm mb-1 block text-[#ADAFB4]">Email</label>
              <input
                type="email"
                name='email'
                value={formData.email}
                onChange={handleChange}
                placeholder="denilson@gmail.com"
                className="w-full mb-8 px-4 py-2 rounded-md bg-zinc-900 border border-zinc-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400"
              />
            </div>

            <div className="w-full mb-10">
              <label className="text-sm mb-1 block text-[#ADAFB4]">Password</label>
              <input
                type="password"
                name='password'
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                className="w-full px-4 py-2 rounded-md bg-zinc-900 border border-zinc-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400"
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
      <div className='mt-5'>
        <LiveSessionTimer redBgColour={'bg-black'} greenBgColor={'bg-black'} primaryTextColour={'text-[#ADAFB4]'} greenTextColour={'text-white'} redTextColour={'text-white'} labelTextColour={'text-[#ADAFB4]'} bottomLabelColour={'text-[#ADAFB4]'}/>
      </div>
    </div>
  );
};

export default SignupPage;