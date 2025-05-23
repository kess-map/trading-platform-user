import { useState } from 'react';
import {useLocation, useNavigate} from 'react-router-dom'
import {useAuthStore} from '../store/authStore'
import toast from 'react-hot-toast';

const SignupPage = () => {
    const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const referralCode = searchParams.get('ref')
  const {signup, isLoading} = useAuthStore()
  const [formData, setFormData] = useState({
    fullName: '',
    username: '', 
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
    
    if(!formData.fullName || !formData.username || !formData.phoneNumber || !formData.email || !formData.country || !formData.password || !formData.confirmPassword){
      return toast.error('Please fill in all fields')
    }

    if(formData.password !== formData.confirmPassword){
      return toast.error('Passwords must match')
    }

    if(!formData.agree){
      toast.error('Please read and accept the terms and conditions')
    }

    const res = await signup(formData)

    if(res.status === 200){
      navigate('/verify-phone')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FCFAFF] text-white px-4">
      <div className="w-full max-w-xl bg-[#FCFAFF] rounded-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-2 text-[#0A0D03]">Create account</h2>
        <p className="text-center text-sm text-[#0A0D03] mb-6">
          Join thousands of traders and investors thriving on our cutting-edge platform today!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm mb-1 block font-medium text-[#5B6069]">Full name</label>
            <input
              type="text"
              name='fullName'
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Denilson Rain"
              className="w-full px-4 py-2 rounded-md text-black bg-[#FCFAFF] border border-[#00000080] placeholder-[#84888F] focus:outline-none focus:ring-2 focus:ring-[#00000080]"
            />
          </div>

          <div>
            <label className="text-sm mb-1 block font-medium text-[#5B6069]">Username</label>
            <input
              type="text"
              name='username'
              value={formData.username}
              onChange={handleChange}
              placeholder="Denilson123"
              className="w-full px-4 py-2 rounded-md text-black bg-[#FCFAFF] border border-[#00000080] placeholder-[#84888F] focus:outline-none focus:ring-2 focus:ring-[#00000080]"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
              <label className="text-sm mb-1 block font-medium text-[#5B6069]">Phone number</label>
              <input
                type="tel"
                name='phoneNumber'
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="080123456789"
                className="w-full px-4 py-2 rounded-md text-black bg-[#FCFAFF] border border-[#00000080] placeholder-[#84888F] focus:outline-none focus:ring-2 focus:ring-[#00000080]"
              />
            </div>
            <div className="w-full md:w-1/2">
              <label className="text-sm mb-1 block font-medium text-[#5B6069]">Email</label>
              <input
                type="email"
                name='email'
                value={formData.email}
                onChange={handleChange}
                placeholder="denilson@gmail.com"
                className="w-full px-4 py-2 rounded-md text-black bg-[#FCFAFF] border border-[#00000080] placeholder-[#84888F] focus:outline-none focus:ring-2 focus:ring-[#00000080]"
              />
            </div>
          </div>

          <div>
            <label className="text-sm mb-1 block font-medium text-[#5B6069]">Country</label>
            <select name='country' value={formData.country} onChange={handleChange} className="w-full px-4 py-2 rounded-md text-[#84888F] bg-[#FCFAFF] border border-[#00000080] placeholder-[#84888F] focus:outline-none focus:ring-2 focus:ring-[#00000080]">
              <option value="">Select</option>
              <option value="nigeria">Nigeria</option>
              <option value="ghana">Ghana</option>
              <option value="kenya">Kenya</option>
            </select>
          </div>

          <div className="flex gap-4 flex-col md:flex-row">
            <div className="w-full md:w-1/2">
              <label className="text-sm mb-1 block font-medium text-[#5B6069]">Password</label>
              <input
                type="password"
                name='password'
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                className="w-full px-4 py-2 rounded-md text-black bg-[#FCFAFF] border border-[#00000080] placeholder-[#84888F] focus:outline-none focus:ring-2 focus:ring-[#00000080]"
              />
            </div>
            <div className="w-full md:w-1/2">
              <label className="text-sm mb-1 block font-medium text-[#5B6069]">Confirm password</label>
              <input
                type="password"
                name='confirmPassword'
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="********"
                className="w-full px-4 py-2 rounded-md text-black bg-[#FCFAFF] border border-[#00000080] placeholder-[#84888F] focus:outline-none focus:ring-2 focus:ring-[#00000080]"
              />
            </div>
          </div>

          <div>
            <label className="text-sm mb-1 block font-medium text-[#5B6069]">Referral code (optional)</label>
            <input
              type="text"
              name='referralCode'
              value={formData.referralCode}
              onChange={handleChange}
              placeholder="Denilson"
              className="w-full px-4 py-2 rounded-md text-black bg-[#FCFAFF] border border-[#00000080] placeholder-[#84888F] focus:outline-none focus:ring-2 focus:ring-[#00000080]"
            />
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" name='agree' value={formData.agree} onChange={handleChange} id="terms" className="accent-purple-700 w-4 h-4" />
            <label htmlFor="terms" className="text-sm text-[#5B6069]">
              I have read and agree to the terms & conditions
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 bg-[#CAEB4B] text-[#1D2308] font-semibold py-2 rounded-md transition"
          >
            {isLoading ?  'Loading...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;