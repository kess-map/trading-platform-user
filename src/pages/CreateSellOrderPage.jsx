import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useOrderStore } from '../store/orderStore';

export default function CreateSellOrderForm() {
  const {createSellOrder} = useOrderStore()
  const [paymentMethod, setPaymentMethod] = useState('');
  const [formData, setFormData] = useState({
    amount: '',
    bankName: '',
    accountName: '',
    accountNumber: '',
    network: '',
    walletAddress: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async(e)=>{
    e.preventDefault()

    if(!paymentMethod || !formData.amount)return toast.error('Select an amount and a payment method')

    if(paymentMethod === 'bank'){
      if(!formData.accountName || !formData.bankName || !formData.accountNumber)return toast.error('Fill in neccessary bank details')
    }

    if(paymentMethod === 'crypto'){
      if(!formData.network || !formData.walletAddress)
      return toast.error('Fill in neccessary crypto transaction details')
    }

    await createSellOrder()
    toast.success('Sell Order Created Successfully')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-center">Create sell order</h2>

        <div className="mb-3">
          <label className="block text-sm mb-1">Amount</label>
          <select name="amount" className="w-full border p-2 rounded" value={formData.amount} onChange={handleChange}>
            <option value="">Select</option>
            <option value={20000}>25,000</option>
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
          <label className="block text-sm mb-1">Payment method</label>
          <select
            className="w-full border p-2 rounded"
            value={paymentMethod}
            onChange={(e) => {
              setPaymentMethod(e.target.value);
            }}
          >
            <option value="">Select</option>
            <option value="bank">Bank transfer</option>
            <option value="crypto">Crypto</option>
          </select>
        </div>

        {paymentMethod === 'bank' && (
          <>
            <div className="mb-3">
              <label className="block text-sm mb-1">Bank name</label>
              <select name="bankName" className="w-full border p-2 rounded" value={formData.bankName} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Access Bank">Access Bank</option>
                <option value="GTBank">GTBank</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="block text-sm mb-1">Account name</label>
              <input
                type="text"
                name="accountName"
                value={formData.accountName}
                onChange={handleChange}
                placeholder="e.g. Nicole Soft"
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm mb-1">Account number</label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="e.g. 5467454654"
                className="w-full border p-2 rounded"
              />
            </div>
          </>
        )}

        {paymentMethod === 'crypto' && (
          <>
            <div className="mb-3">
              <label className="block text-sm mb-1">Network</label>
              <select name="network" className="w-full border p-2 rounded" value={formData.network} onChange={handleChange}>
                <option value="">Select</option>
                <option value="TRC20">TRC20</option>
                <option value="ERC20">ERC20</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="block text-sm mb-1">Wallet address</label>
              <input
                type="text"
                name="walletAddress"
                value={formData.walletAddress}
                onChange={handleChange}
                placeholder="e.g. Your crypto wallet"
                className="w-full border p-2 rounded"
              />
            </div>
          </>
        )}

        <p className="text-sm text-orange-600 mt-2 text-center">Your order will go live in the next session</p>

        <button type="submit" className="mt-4 w-full bg-lime-400 hover:bg-lime-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
}