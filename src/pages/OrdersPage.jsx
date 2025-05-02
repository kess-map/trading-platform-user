import React, { useEffect, useState } from 'react';
import LiveSessionTimer from '../components/Timer';
import axiosInstance from '../utils/axios';
import LoadingSpinner from '../components/LoadingSpinner'
import { useOrderStore } from '../store/orderStore';
import { useNavigate } from 'react-router-dom';

export default function MyOrdersOverview() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState({
    buyOrders: { pending: [], approved: [], completed: [] },
    sellOrders: { pending: [], approved: [], completed: [] }
  });
  const [orderType, setOrderType] = useState('buy');
  const [activeTab, setActiveTab] = useState('pending');

  const {isLive} = useOrderStore()

  const fetchOrders = async()=>{
    const res = await axiosInstance.get('/buy-orders/all')
    console.log(res.data.data)
    setOrders(res.data.data)
  }

  useEffect(() => {
    fetchOrders()
  }, []);
  

  return (
    <div className="p-4 md:p-8 w-full max-w-full overflow-x-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button className="text-sm sm:text-base bg-white border border-gray-300 text-gray-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md shadow-sm hover:bg-gray-50 transition">
            Create Buy Request
          </button>
          <button onClick={()=>{navigate('/create-sell-order')}} className="text-sm sm:text-base bg-lime-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md hover:bg-lime-600 transition">
            Create Sell Request
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-full h-full gap-6 mt-6">
        <div className="grid grid-cols-1 gap-4 md:w-1/2 w-full">
          <div className="rounded-lg p-4 shadow-sm border border-gray-300">
            <h3 className="text-gray-600">Pending Sell Orders</h3>
            <p className="text-2xl font-bold text-green-800 mt-2">{orders.sellOrders.pending.length || 0}</p>
          </div>
          <div className="border rounded-lg p-4 shadow-sm">
            <h3 className="text-gray-600">Pending Buy Orders</h3>
            <p className="text-2xl font-bold text-yellow-800 mt-2">{orders.buyOrders.pending.length || 0}</p>
          </div>
        </div>
        <div className="md:w-1/2 w-full">
          <LiveSessionTimer otherStyles={'pb-20'}/>
        </div>
      </div>

      <div className="flex gap-4 mb-4 mt-4">
    <button
      onClick={() => setOrderType('buy')}
      className={`px-4 py-2 rounded ${orderType === 'buy' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}
    >
      Buy Orders
    </button>
    <button
      onClick={() => setOrderType('sell')}
      className={`px-4 py-2 rounded ${orderType === 'sell' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}
    >
      Sell Orders
    </button>
  </div>

  <div className="flex gap-6 border-b mb-4">
    {['pending', ...(isLive ? ['approved'] : []), 'completed'].map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`pb-2 capitalize transition ${
          activeTab === tab
            ? 'border-b-2 border-black font-semibold text-black'
            : 'text-gray-500'
        }`}
      >
        {tab}
      </button>
    ))}
  </div>

  {!orders ? <LoadingSpinner/> :<div className="space-y-4">
    {orders[`${orderType}Orders`][activeTab].map((order) => {
  const isMatched = order.sellOrder && order.buyOrder; // matched order
  const displayOrder = isMatched ? order.sellOrder : order; // show sellOrder info if matched

  return (
    <div key={order._id} className="border rounded p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
      <div>
        <p className="font-medium">Order #{order._id} | {order.user?.phoneNumber}</p>
        <p className="text-sm text-gray-500">
          {displayOrder.paymentMethod === 'bank' ? 'Bank Transfer' : "Crypto(USDT)"} 
          {displayOrder.paymentMethod !== 'bank' && <span> • {displayOrder.cryptoNetwork}</span>}
        </p>
        <p className="text-sm text-gray-500">
          {displayOrder.paymentMethod === 'bank' 
            ? `Account no: ${displayOrder.accountNumber}` 
            : `Wallet Address: ${displayOrder.cryptoAddress}`}
        </p>
      </div>
      
      <div className="mt-2 md:mt-0 flex items-center gap-4">
        <p className="font-semibold">{order.amount?.toLocaleString()}</p>
        
        {!isMatched && order.status === 'pending' && (
          <button className="bg-rose-100 px-3 py-1 text-sm rounded">Cancel</button>
        )}

        {isMatched && (
          <>
            {orderType === 'buy' && order.status === 'pending' && (
              <button className="bg-blue-500 text-white px-3 py-1 text-sm rounded">Mark as Paid</button>
            )}

            {orderType === 'sell' && order.status === 'paid' && (
              <>
                <button className="bg-gray-100 px-3 py-1 text-sm rounded">View Proof</button>
                <button className="bg-orange-100 px-3 py-1 text-sm rounded">Appeal</button>
                <button className="bg-green-500 text-white px-3 py-1 text-sm rounded">Confirm Payment</button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
})}
  </div>}
</div>
  );
}