import React, { useEffect, useState } from 'react';
import LiveSessionTimer from '../components/Timer';
import axiosInstance from '../utils/axios';
import LoadingSpinner from '../components/LoadingSpinner'
import { useOrderStore } from '../store/orderStore';
import { useNavigate } from 'react-router-dom';
import { Copy } from 'lucide-react';
import toast from 'react-hot-toast';

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
  
  const handleCopy = (text)=>{
		navigator.clipboard.writeText(text)
		.then(()=>toast.success('Copied to clipboard'))
		.catch(err=>toast.error('Failed to copy', err))
	}

  return (
    <div className="p-4 md:p-8 min-h-screen w-full max-w-full overflow-x-hidden bg-black">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-[#D6D7DA]">My Orders</h1>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button onClick={()=>{navigate('/create-buy-order')}} className="text-sm sm:text-base font-semibold bg-black border border-[#57661F] text-[#57661F] px-3 sm:px-4 py-1.5 sm:py-2 rounded-md shadow-sm hover:bg-gray-50 transition">
            Create Buy Request
          </button>
          <button onClick={()=>{navigate('/create-sell-order')}} className="text-sm sm:text-base bg-[#CAEB4B] text-black font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-md hover:bg-lime-600 transition">
            Create Sell Request
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-full h-full gap-6 mt-6">
        <div className="grid grid-cols-1 gap-4 md:w-1/2 w-full">
          <div className="rounded-lg p-4 shadow-sm border border-[#5B6069]">
            <h3 className="text-[#ADAFB4]">Pending Sell Orders</h3>
            <p className="text-2xl font-bold text-[#D6D7DA] mt-2">{orders.sellOrders.pending.length || 0}</p>
          </div>
          <div className="border border-[#5B6069] rounded-lg p-4 shadow-sm">
            <h3 className="text-[#ADAFB4]">Pending Buy Orders</h3>
            <p className="text-2xl font-bold text-[#D6D7DA] mt-2">{orders.buyOrders.pending.length || 0}</p>
          </div>
        </div>
        <div className="md:w-1/2 w-full">
          <LiveSessionTimer 
          greenBgColor={'bg-[#22B831]'} 
          redBgColour={'bg-[#CA636E]'}
          redSecBgColour={'bg-white'}
          greenSecBgColor={'bg-white'}
          greenTextColour={'text-[#22B831]'}
          redTextColour={'text-[#FF4C61]'} 
          greenTimerLabelColour={'text-[#22B831]'}
          redTimerLabelColour={'text-[#FF4C61]'}
          otherStyles={'pb-20'}/>
        </div>
      </div>

      <div className="flex gap-4 mb-4 mt-4">
    <button
      onClick={() => setOrderType('buy')}
      className={`px-4 py-2 rounded-3xl ${orderType === 'buy' ? 'bg-[#57661F] text-white' : 'bg-[#57661F33] text-[#ADAFB4]'}`}
    >
      Buy Orders
    </button>
    <button
      onClick={() => setOrderType('sell')}
      className={`px-4 py-2 rounded-3xl ${orderType === 'sell' ? 'bg-[#57661F] text-white' : 'bg-[#57661F33] text-[#ADAFB4]'}`}
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
            ? 'border-b-2 border-[#EBEBEC] font-semibold text-[#D6D7DA] '
            : 'text-[#D6D7DA]'
        }`}
      >
        {tab}
      </button>
    ))}
  </div>

  {!orders ? <LoadingSpinner size={'h-full'}/> :<div className="space-y-4">
    {orders[`${orderType}Orders`][activeTab].map((order) => {
  const isMatched = order.sellOrder && order.buyOrder; // matched order
  const displayOrder = isMatched ? order.sellOrder : order; // show sellOrder info if matched

  return (
    <div key={order._id} className="border rounded p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
      <div>
        <p className="font-medium text-[#ADAFB4] truncate">Order #{order._id}</p>
        <div className='flex items-center'>
        <p className="font-medium text-[#ADAFB4]">{order.user.fullName} | </p> <span className='text-[#ADAFB4]'> {order.user?.phoneNumber}</span>
        <Copy
          className="w-4 h-4 cursor-pointer text-gray-500 hover:text-black ml-2"
          onClick={() => handleCopy(order.user?.phoneNumber)}
        />
        </div>
        <p className="text-sm text-gray-500">
          {displayOrder.paymentMethod === 'bank' ? 'Bank Transfer' : "Crypto(USDT)"} 
          {orderType === 'sell' && <span>{displayOrder.paymentMethod === 'bank' ? <span> • {displayOrder.bankName}</span> : <span> • {displayOrder.cryptoNetwork}</span>}</span>}
        </p>
        <p className="text-sm text-gray-500 flex items-center">
        {orderType === 'sell' && <><span> {displayOrder.paymentMethod === 'bank' 
            ? `Account no: ${displayOrder.accountNumber}` 
            : `Wallet Address: ${displayOrder.cryptoAddress}`}</span>
          <Copy
            className="w-4 h-4 cursor-pointer text-gray-500 hover:text-black ml-2"
            onClick={() => handleCopy(displayOrder.paymentMethod === 'bank' ? displayOrder.accountNumber : displayOrder.cryptoAddress)}
          /></>}
        </p>
      </div>
      
      <div className="mt-2 md:mt-0 flex justify-between w-1/2 items-center gap-4">
        <p className="font-semibold text-[#D6D7DA]">{order.amount?.toLocaleString()}</p>
        
        {!isMatched && order.status === 'pending' && (
          <button className=" px-3 py-1 text-sm rounded bg-[#FF596D4D] text-[#FF4C61]">Cancel</button>
        )}
        {order.status === 'completed' && (
          <span className=" px-6 py-1 text-sm rounded bg-[#FF596D4D] text-[#FF4C61]">Completed</span>
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