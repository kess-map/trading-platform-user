import { useState } from 'react';
import LiveSessionTimer from '../components/Timer'; 
import {useLocation, useNavigate} from 'react-router-dom'
import {useAuthStore} from '../store/authStore'
import toast from 'react-hot-toast';

export default function SignupPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const referralCode = searchParams.get('ref')
  const {signup, isLoading} = useAuthStore()
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    countryCode: '', 
    phoneNumber: '',
    email: '',
    country: '',
    password: '',
    confirmPassword: '',
    referralCode: referralCode || '',
    agree: false,
  });

  const handleChange = (e)=>{
    const {name, value, type, checked} = e.target

    setFormData((prev)=>({
      ...prev, [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    
    if(!formData.fullName || !formData.username || !formData.countryCode || !formData.phoneNumber || !formData.email || !formData.country || !formData.password || !formData .confirmPassword){
      return toast.error('Please fill in all fields')
    }

    if(formData.password !== formData.confirmPassword){
      return toast.error('Passwords must match')
    }

    if(!formData.agree){
      toast.error('Please read and accept the terms and conditions')
    }

    let sanitizedNumber = formData.phoneNumber
    if(sanitizedNumber.startsWith('0')){
      sanitizedNumber = sanitizedNumber.slice(1)
    }

    const fullPhoneNumber = `${formData.countryCode}${sanitizedNumber}`
    await signup({...formData, phoneNumber: fullPhoneNumber})
    navigate('/verify-phone')
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      <div className="flex-1 p-8 md:p-16 flex flex-col justify-center">
        <h2 className="text-3xl font-bold mb-8">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 text-gray-700 font-medium">Full Name</label>
            <input
              type="text"
              name='fullName'
              value={formData.fullName}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400
"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-medium">Username</label>
            <input
              type="text"
              name='username'
              value={formData.username}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400
"
              placeholder="Enter username"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block mb-1 text-gray-700 font-medium">Phone Number</label>
              <div className='flex'>
                <input
                  type="text"
                  name='countryCode'
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="w-1/4 mr-2 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400"
                  placeholder="+234"
                />
                <input
                  type="text"
                  name='phoneNumber'
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400"
                />
              </div>
            </div>
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

          <div>
            <label className="block mb-1 text-gray-700 font-medium">Country</label>
            <select name='country' value={formData.country} onChange={handleChange} className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400
">
              <option value=''>Select</option>
              <option value='Nigeria'>Nigeria</option>
            </select>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block mb-1 text-gray-700 font-medium">Password</label>
              <input
                type="password"
                name='password'
                value={formData.password}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400"
                placeholder="Password"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-gray-700 font-medium">Confirm Password</label>
              <input
                type="password"
                name='confirmPassword'
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400"
                placeholder="Confirm Password"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-medium">Referral Code (optional)</label>
            <input
              type="text"
              name='referralCode'
              value={formData.referralCode}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400
"
              placeholder="Referral code"
            />
          </div>

          <div className="flex items-center">
            <input type="checkbox" name='agree' value={formData.agree} onChange={handleChange} className="h-5 w-5 mr-2" />
            <p className="text-gray-600 text-sm">
              I have read and agree to the <span className="underline cursor-pointer">terms & conditions</span>.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-lime-500 hover:bg-lime-600 text-white py-3 rounded-lg font-semibold transition"
          >
            Create Account
          </button>
        </form>
      </div>

      <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-white p-8">
        <h2 className="text-2xl font-bold text-lime-400 mb-4 text-center">Earn up to <span className="text-purple-400">100%</span> ROI</h2>
        <div className="w-full max-w-sm">
          <LiveSessionTimer />
        </div>
      </div>

    </div>
  );
}