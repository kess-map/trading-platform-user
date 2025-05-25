import React, { useState } from 'react';
import toast, { LoaderIcon } from 'react-hot-toast';
import { useOrderStore } from '../store/orderStore';
import { useNavigate } from 'react-router-dom';

export default function CreateSellOrderForm() {
  const navigate = useNavigate()
  const {createBuyOrder, isLoading} = useOrderStore()
  const [paymentMethod, setPaymentMethod] = useState('');
  const [amount, setAmount] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async(e)=>{
    e.preventDefault()

    if(!paymentMethod || !amount)return toast.error('Select an amount and a payment method')

    await createBuyOrder({amount, paymentMethod})
    setAmount('')
    setPaymentMethod('')
    navigate('/orders')
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form className="w-full max-w-md p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-[#323844] text-left">Create buy order</h2>

        <div className="mb-3">
          <label className="block text-sm mb-1 text-[#5B6069]">Amount</label>
          <select 
          name="amount" 
          className="w-full border bg-[#FCFAFF] placeholder-[#84888F] focus:outline-none focus:ring-2 focus:ring-[#00000080] p-2 rounded-lg text-black" 
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
          <label className="block text-sm mb-1  text-[#5B6069]">Payment method</label>
          <select
            className="w-full border text-black bg-[#FCFAFF] placeholder-[#84888F] focus:outline-none focus:ring-2 focus:ring-[#00000080] p-2 rounded-lg"
            value={paymentMethod}
            onChange={(e) => {
              setPaymentMethod(e.target.value);
            }}
          >
            <option value="">Select</option>
            <option value="bank">Bank transfer</option>
            <option value="usdt">Crypto</option>
          </select>
        </div>

        <p className="text-sm text-[#E0742B] mt-2 text-center">Your order will go live in the next session</p>

        <div className='flex justify-center'>
          <button disabled={isLoading} onClick={handleSubmit} className="mt-4 bg-[#CAEB4B] text-[#1D2308] px-20 py-2 rounded-xl">
            {isLoading ? <LoaderIcon/> : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}