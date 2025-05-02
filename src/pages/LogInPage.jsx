import { useEffect, useState } from 'react';
import LiveSessionTimer from '../components/Timer'; // Reusable timer
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export default function LogInPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const {login, isLoading, user} = useAuthStore()

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
    await login(formData.email, formData.password)
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      <div className="flex-1 p-8 md:p-16 flex flex-col justify-center">
        <h2 className="text-3xl font-bold mb-8">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block mb-1 text-gray-700 font-medium">Email</label>
              <input
                type="email"
                name='email'
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400
"
                placeholder="Email address"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block mb-1 text-gray-700 font-medium">Password</label>
              <input
                type="password"
                name='password'
                value={formData.password}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400
"
                placeholder="Password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-lime-500 hover:bg-lime-600 text-white py-3 rounded-lg font-semibold transition"
          >
            Login
          </button >
        </form>
      </div>

      <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-white p-8">
        <div className="w-full max-w-sm">
          <LiveSessionTimer />
        </div>
      </div>

    </div>
  );
}