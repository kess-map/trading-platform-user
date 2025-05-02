import React, { useState } from 'react';

export default function CreateBuyOrderForm() {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-center">Create sell order</h2>

        <div className="mb-3">
          <label className="block text-sm mb-1">Amount</label>
          <select name="amount" className="w-full border p-2 rounded" value={formData.amount} onChange={handleChange}>
            <option value="">Select</option>
            <option value="25000">25,000</option>
            <option value="50000">50,000</option>
            {/* Add more options if needed */}
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

        <p className="text-sm text-orange-600 mt-2 text-center">Your order will go live in the next session</p>

        <button type="submit" className="mt-4 w-full bg-lime-400 hover:bg-lime-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
}