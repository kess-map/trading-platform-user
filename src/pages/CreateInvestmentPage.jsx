import React, { useState } from 'react';
import toast, { LoaderIcon } from 'react-hot-toast';
import { useOrderStore } from '../store/orderStore';
import { useNavigate } from 'react-router-dom';

export default function CreateSellOrderForm() {
  const navigate = useNavigate()
  const {createInvestment, isLoading} = useOrderStore()
  const [duration, setDuration] = useState({ days: '', roi: '' });
  const [amount, setAmount] = useState(0);

  const handleSubmit = async(e)=>{
    e.preventDefault()

    if(!duration.days || !duration.roi || !amount)return toast.error('Select an amount and a duration')

    await createInvestment({amount, planDurationDays: duration.days, roiPercentage: duration.roi})
    setAmount('')
    setDuration({days: "", roi: ''})
    navigate('/investment')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form className="w-full max-w-md p-6 bg-black rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-[#D6D7DA] text-left">Stake token and earn</h2>

        <div className="mb-3">
          <label className="block text-sm mb-1 text-[#ADAFB4]">Amount</label>
          <select 
          name="amount" 
          className="w-full border border-[#5B6069] p-2 rounded-lg bg-black text-[#ADAFB4]" 
          value={amount} 
          onChange={(e) => {
            setAmount(e.target.value);
          }}>
            <option value="">Select</option>
            <option value={25000}>25,000</option>
            <option value={50000}>50,000</option>
            <option value={75000}>75,000</option>
            <option value={100000}>100,000</option>
            <option value={150000}>150,000</option>
            <option value={200000}>200,000</option>
            <option value={250000}>250,000</option>
            <option value={300000}>300,000</option>
            <option value={400000}>400,000</option>
            <option value={500000}>500,000</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="block text-sm mb-1  text-[#ADAFB4]">Duration</label>
            <select
                className="w-full border border-[#5B6069] p-2 rounded-lg bg-black text-[#ADAFB4]"
                value={JSON.stringify(duration)}
                onChange={(e) => setDuration(JSON.parse(e.target.value))}
                >
                <option value="">Select</option>
                <option value={JSON.stringify({ days: 6, roi: 15 })}>6 days - 15%</option>
                <option value={JSON.stringify({ days: 10, roi: 30 })}>10 days - 30%</option>
                <option value={JSON.stringify({ days: 14, roi: 50 })}>14 days - 50%</option>
            </select>
        </div>

        <p className="text-sm text-[#D6D7DA] mt-2 text-center">Your are staking <span className='text-[#E0742B] text-sm'>{amount.toLocaleString()}</span> for <span className='text-[#E0742B] text-sm'>{duration.days !== '' ? duration.days : 0} day(s)</span> to earn {duration.roi !== '' ? duration.roi : 0}% ROI</p>

        <div className='flex justify-center'>
          <button disabled={isLoading} onClick={handleSubmit} className="mt-4 bg-[#CAEB4B] text-[#1D2308] px-20 py-2 rounded-xl">
            {isLoading ? <LoaderIcon/> : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}