import React, { useEffect, useState } from 'react'
import LiveSessionTimer from '../components/Timer'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'
import { Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOrderStore } from '../store/orderStore';

const HomePage = () => {
	const navigate = useNavigate()
	const {user} = useAuthStore()
	const {getPendingBuyOrders, getPendingSellOrders, pendingBuyOrders, pendingSellOrders} = useOrderStore()
	const refCode = user.referralCode || ''
	const refLink = `https://yourwebsite.com/signup?ref=${refCode}`
	const [pendingOrders, setPendingOrders] = useState([])

	useEffect(()=>{
		getPendingBuyOrders()
		getPendingSellOrders()
		if(pendingSellOrders.length > 0){
			setPendingOrders(pendingSellOrders)
		}
	},[getPendingBuyOrders, getPendingSellOrders, pendingSellOrders.length])

	const [selectedTab, setSelectedTab] = useState('sell');
	
	const handleCopy = (text)=>{
		navigator.clipboard.writeText(text)
		.then(()=>toast.success('Copied to clipboard'))
		.catch(err=>toast.error('Failed to copy', err))
	}

	const handleTabSelect = (type)=>{
		setSelectedTab(type)  
		if(type === 'sell'){
			setPendingOrders(pendingSellOrders)
		}else{
			setPendingOrders(pendingBuyOrders)
		}
	}
  return (
    <div className="w-full min-h-screen bg-white px-4 md:px-8 py-6">
      <h2 className="text-xl md:text-2xl font-bold mb-6">Welcome, {user.username}</h2>

      {!user ? <LoadingSpinner/> : <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="border p-4 rounded">
            <p className="text-gray-500 text-sm">Available Balance</p>
            <p className="text-xl font-semibold">{user.availableBalance}</p>
          </div>
          <div className="border p-4 rounded">
            <p className="text-gray-500 text-sm">Total Balance</p>
            <p className="text-xl font-semibold">{user.availableBalance + user.stakedBalance}</p>
          </div>
          <div className="border p-4 rounded">
            <p className="text-gray-500 text-sm">Staked Balance</p>
            <p className="text-xl font-semibold">{user.stakedBalance}</p>
          </div>
          <div className="border p-4 rounded">
            <p className="text-gray-500 text-sm">Referral Balance</p>
            <p className="text-xl font-semibold">{user.referralBonusBalance}</p>
          </div>
      </div>}

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-lime-100 p-4 rounded flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg mb-2">Earn up to 100% ROI on investment</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Acquire token</li>
              <li>Stake & Earn</li>
            </ul>
          </div>
          <button onClick={()=>navigate('/investment')} className="bg-black text-white px-4 py-2 rounded mt-4 w-fit">Invest Now</button>
        </div>

        <LiveSessionTimer/>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="border rounded p-4">
          <h4 className="font-semibold mb-2 text-purple-600">Earn from direct referrals</h4>
          <div className="mb-2">
            <label className="text-sm block mb-1">Referral link</label>
            <div className="flex">
              <input
                className="flex-1 border px-2 py-1 rounded-l"
                value={refLink}
                readOnly
              />
              <button onClick={()=>handleCopy(refLink)} className="bg-lime-400 px-3 py-1 rounded-r">Copy</button>
            </div>
          </div>
          <div>
            <label className="text-sm block mb-1">Referral ID</label>
            <div className="flex">
              <input className="flex-1 border px-2 py-1 rounded-l" value={refCode} readOnly />
              <button onClick={()=>handleCopy(refCode)} className="bg-lime-400 px-3 py-1 rounded-r">Copy</button>
            </div>
          </div>
        </div>

        <div className="border rounded p-4">
          <h4 className="font-semibold mb-2 text-purple-600">Identity verification</h4>
          <p className="text-sm text-gray-600 mb-2">Verification is simple and fast</p>
          <ul className="list-disc pl-5 mb-4 text-sm">
            <li>Create up to 10 sell orders</li>
            <li>Earn from referrals</li>
          </ul>
          <button className="bg-lime-400 px-4 py-2 rounded">Verify now</button>
        </div>
      </div>


      <div className="mb-6">
        <div className="flex gap-20 items-center mb-2">
          <h4 className="text-lg font-semibold">Pending Orders</h4>
          <a href="#" className="text-sm text-purple-600 underline">View all</a>
        </div>
        <div className="flex space-x-2 mb-4">
        {['sell', 'buy'].map(type => (
          <button
            key={type}
            onClick={() =>{handleTabSelect(type)}}
            className={`px-4 py-1 rounded capitalize ${
              selectedTab === type ? 'bg-green-200' : 'bg-gray-100'
            }`}
          >
            {type} orders
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {pendingOrders.map(order => (
          <div
            key={order._id}
            className="flex flex-col md:flex-row justify-between items-start md:items-center border p-4 rounded"
          >
            <div>
              <p className="font-medium flex items-center gap-2">
                Order #{order._id} | {order.user.phoneNumber}
                <Copy
                  className="w-4 h-4 cursor-pointer text-gray-500 hover:text-black"
                  onClick={() => handleCopy(order.user.phoneNumber)}
                />
              </p>
              {order.paymentMethod === 'bank' ?<> <p className="text-sm text-gray-500">Bank transfer {selectedTab === 'sell' && <span>• {order.bankName}</span>}</p>
              {selectedTab === 'sell' && <p className="text-sm text-gray-500 flex items-center gap-2">
                Account no: {order.accountNumber}
                <Copy
                  className="w-4 h-4 cursor-pointer text-gray-500 hover:text-black"
                  onClick={() => handleCopy(order.accountNumber)}
                />
              </p>}</> : <> <p className="text-sm text-gray-500">USDT {selectedTab === 'sell' && <span>• {order.cryptoNetwork}</span>}</p>
			  {selectedTab === 'sell' && <p className="text-sm text-gray-500 flex items-center gap-2">
                Wallet Address: {order.cryptoAddress}
                <Copy
                  className="w-4 h-4 cursor-pointer text-gray-500 hover:text-black"
                  onClick={() => handleCopy(order.cryptoAddress)}
                />
              </p>}</>}
            </div>
            <div className="mt-2 md:mt-0 flex items-center gap-4">
              <p className="font-semibold">{order.amount.toLocaleString()}</p>
              {order.status === 'pending' && (
                <button className="bg-rose-100 px-3 py-1 text-sm rounded">Cancel</button>
              )}
            </div>
          </div>
        ))}
      </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-10">
        <div>
          <h4 className="font-semibold mb-2">Recent notifications</h4>
          <div className="space-y-2 text-sm">
            {[
              'Password Changed Successfully',
              'Trade Session in Progress',
              'Investment Completed',
              'Referral Bonus Credited'
            ].map((msg, i) => (
              <div key={i} className="border p-3 rounded">
                <p>{msg}</p>
                <p className="text-xs text-gray-500">April 12, 2025</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-2">New announcements</h4>
          <div className="space-y-2 text-sm">
            {[1, 2, 3].map(i => (
              <div key={i} className="border p-3 rounded">
                <p>Earn More with Our New Referral Boost!</p>
                <p className="text-xs text-gray-500">April 20, 2025 11:00am</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage