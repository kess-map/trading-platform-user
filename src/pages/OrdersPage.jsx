import React, { useEffect, useState } from 'react';
import LiveSessionTimer from '../components/Timer';
import axiosInstance from '../utils/axios';
import LoadingSpinner from '../components/LoadingSpinner'
import { useOrderStore } from '../store/orderStore';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Copy } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MyOrdersOverview() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState({
    buyOrders: { pending: [], approved: [], completed: [], cancelled: [] },
    sellOrders: { pending: [], approved: [], completed: [], cancelled: [] }
  });
  const [orderType, setOrderType] = useState('buy');
  const [activeTab, setActiveTab] = useState('pending');
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [paymentProof, setPaymentProof] = useState('');
  const [viewModal, setViewModal] = useState(false)
  const [appealModal, setAppealModal] = useState(null)
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');

  const {isLive, cancelSellOrder, cancelBuyOrder, buyOrderTimer, payForOrder, confirmOrderPayment} = useOrderStore()
  const {user} = useAuthStore()

  const fetchOrders = async()=>{
    const res = await axiosInstance.get('/buy-orders/all')
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

  const cancelOrder = async(id)=>{
    if(orderType === 'sell'){
      await cancelSellOrder(id)
      setOrders(prev => ({
        ...prev,
        sellOrders: {
          ...prev.sellOrders,
          pending: prev.sellOrders.pending.filter(order => order._id !== id)
        }
      }));
    }else{
      await cancelBuyOrder(id)
      setOrders(prev => ({
        ...prev,
        buyOrders: {
          ...prev.buyOrders,
          pending: prev.buyOrders.pending.filter(order => order._id !== id)
        }
      }));
    }
  }

  function getRemainingMinutes(startTimeISO, durationInMinutes = 15) {
  const start = new Date(startTimeISO);
  const end = new Date(start.getTime() + durationInMinutes * 60 * 1000);
  const now = new Date();
  const msRemaining = Math.max(end - now, 0);

  return Math.floor(msRemaining / (60 * 1000));
}

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPaymentProof(reader.result)
    };
    reader.readAsDataURL(file);
  }
};

const handleSubmit = async()=>{
  await payForOrder(selectedOrderId, {paymentProof})

  setShowModal(false)
  setPaymentProof('')
}

const handleConfirmPayment = async(orderId)=>{
  await confirmOrderPayment(orderId)
  setOrders(prev => ({
  ...prev,
  sellOrders: {
    ...prev.sellOrders,
    approved: prev.sellOrders.approved.filter(order => order._id !== orderId)
  }
}));
}

const handleAppealSubmit = async()=>{
  if(!reason) return toast.error('Please select a reason for appeal')

  if(!appealModal) return toast.error('Select an order to appeal')

  const appealedBy = appealModal.buyer === user._id ? appealModal.buyer._id : appealModal.seller._id

  const appealedAgainst = appealModal.buyer === user._id ? appealModal.seller._id : appealModal.buyer._id

  await axiosInstance.post('/appeals', {appealedBy, appealedAgainst, order:appealModal._id, reason, description: description ? description : 'None'})

  toast.success('Order Appeal Submitted successfully')
}
  return (
    <div className="p-4 md:p-8 min-h-screen w-full max-w-full overflow-x-hidden">
      {appealModal && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-black p-6 rounded-2xl w-[90%] max-w-md text-white text-left shadow-xl">
              <h2 className="text-2xl font-bold mb-4 text-center">Appeal order #{appealModal._id}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="text-sm">
                  <label className="block mb-1">Reason</label>
                  <select
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full bg-black border border-gray-700 px-4 py-2 rounded-md"
                  >
                    <option value="">Select reason</option>
                    <option value="Late confirmation">Late confirmation</option>
                    <option value="Payment not received">Payment not received</option>
                    <option value="Payment not received">Payment not confirmed</option>
                    <option value="Fake proof">Fake proof</option>
                    <option value="User unresponsive">User unresponsive</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="text-sm">
                  <label className="block mb-1">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-transparent border border-gray-700 px-4 py-2 rounded-md resize-none"
                  />
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={()=>setAppealModal(null)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={handleAppealSubmit}
                    className="px-4 py-2 bg-lime-400 text-black font-medium rounded-md hover:bg-lime-300"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
      {viewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-black p-6 rounded-2xl w-[90%] max-w-md text-center shadow-xl mb-5">
              <div className="space-y-4 w-full h-full mb-5">
              <div className="rounded flex flex-col justify-start">
                {selectedOrder.proofOfPayment && (<>
                    <img src={selectedOrder.proofOfPayment} alt="Front" className="h-full object-cover rounded-md" />
                    <button onClick={()=>{ setViewModal(false)}} className='bg-red-500 mx-auto px-4 rounded-md mt-2'>Close</button>
                </>
                  )}
              </div>
              </div>
            </div>
          </div>
      )}
      {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-black p-6 rounded-2xl w-[90%] max-w-md text-center shadow-xl mb-5">
              <h2 className="text-white font-semibold text-lg mb-4">Upload proof of payment</h2>

              <div className="space-y-4 w-full h-full mb-5">
              <div className="rounded flex flex-col justify-start">
                <p className="text-sm text-left mb-2">Front View</p>
                {paymentProof ? (<>
                    <img src={paymentProof} alt="Front" className="h-full object-cover rounded-md" />
                    <button onClick={()=>{ setPaymentProof('')}} className='bg-red-500 mx-auto px-4 rounded-md mt-2'>Remove</button>
                </>
                  ): (<label htmlFor="front" className='flex flex-col justify-center items-center border border-[#5B6069] bg-[#57661F80] px-24 py-10 rounded-lg'>
                <svg width="65" height="58" viewBox="0 0 65 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M36.2093 0.757812H14.0405C10.5819 0.757812 7.26503 2.13171 4.81946 4.57728C2.3739 7.02284 1 10.3397 1 13.7983V32.0549C1 33.7674 1.3373 35.4632 1.99265 37.0453C2.64799 38.6274 3.60854 40.065 4.81946 41.2759C7.26503 43.7215 10.5819 45.0954 14.0405 45.0954H36.2093C37.9218 45.0954 39.6175 44.7581 41.1996 44.1028C42.7818 43.4474 44.2193 42.4869 45.4303 41.2759C46.6412 40.065 47.6017 38.6274 48.2571 37.0453C48.9124 35.4632 49.2497 33.7674 49.2497 32.0549V13.7983C49.2497 12.0858 48.9124 10.3901 48.2571 8.80791C47.6017 7.22577 46.6412 5.7882 45.4303 4.57728C44.2193 3.36636 42.7818 2.4058 41.1996 1.75046C39.6175 1.09511 37.9218 0.757812 36.2093 0.757812Z" stroke="#8C55C1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M1.65234 35.9673L8.8246 27.6214C9.7631 26.6893 10.9948 26.11 12.3113 25.9817C13.6278 25.8534 14.9482 26.1839 16.049 26.9172C17.1499 27.6505 18.4702 27.981 19.7867 27.8527C21.1032 27.7243 22.3349 27.1451 23.2734 26.213L29.3503 20.1361C31.0964 18.3841 33.4082 17.3095 35.8732 17.1041C38.3382 16.8987 40.7961 17.5758 42.8081 19.0147L49.3022 24.0483M14.6928 18.154C15.2614 18.154 15.8243 18.042 16.3496 17.8244C16.8749 17.6069 17.3522 17.2879 17.7542 16.8859C18.1562 16.4839 18.4751 16.0066 18.6927 15.4814C18.9103 14.9561 19.0222 14.3931 19.0222 13.8246C19.0222 13.256 18.9103 12.693 18.6927 12.1677C18.4751 11.6425 18.1562 11.1652 17.7542 10.7632C17.3522 10.3612 16.8749 10.0423 16.3496 9.82468C15.8243 9.6071 15.2614 9.49512 14.6928 9.49512C13.5446 9.49512 12.4434 9.95125 11.6314 10.7632C10.8195 11.5751 10.3634 12.6763 10.3634 13.8246C10.3634 14.9728 10.8195 16.074 11.6314 16.8859C12.4434 17.6979 13.5446 18.154 14.6928 18.154Z" stroke="#8C55C1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M50.5091 28.7568C46.6804 28.8033 43.0216 30.3449 40.3141 33.0524C37.6066 35.7599 36.065 39.4187 36.0186 43.2474C36.065 47.0761 37.6066 50.7349 40.3141 53.4424C43.0216 56.1499 46.6804 57.6915 50.5091 57.738C54.3378 57.6915 57.9966 56.1499 60.7041 53.4424C63.4116 50.7349 64.9532 47.0761 64.9997 43.2474C64.9532 39.4187 63.4116 35.7599 60.7041 33.0524C57.9966 30.3449 54.3378 28.8033 50.5091 28.7568ZM58.7894 43.7824C58.7894 44.0586 58.5656 44.2824 58.2894 44.2824H52.0442C51.768 44.2824 51.5442 44.5063 51.5442 44.7824V51.0277C51.5442 51.3039 51.3203 51.5277 51.0442 51.5277H49.9741C49.6979 51.5277 49.4741 51.3039 49.4741 51.0277V44.7824C49.4741 44.5063 49.2502 44.2824 48.9741 44.2824H42.7288C42.4527 44.2824 42.2288 44.0586 42.2288 43.7824V42.7124C42.2288 42.4362 42.4527 42.2124 42.7288 42.2124H48.9741C49.2502 42.2124 49.4741 41.9885 49.4741 41.7124V35.4671C49.4741 35.1909 49.6979 34.9671 49.9741 34.9671H51.0442C51.3203 34.9671 51.5442 35.1909 51.5442 35.4671V41.7124C51.5442 41.9885 51.768 42.2124 52.0442 42.2124H58.2894C58.5656 42.2124 58.7894 42.4362 58.7894 42.7124V43.7824Z" fill="#8C55C1"/>
                    <path d="M58.7894 43.7824C58.7894 44.0586 58.5656 44.2824 58.2894 44.2824H52.0442C51.768 44.2824 51.5442 44.5063 51.5442 44.7824V51.0277C51.5442 51.3039 51.3203 51.5277 51.0442 51.5277H49.9741C49.6979 51.5277 49.4741 51.3039 49.4741 51.0277V44.7824C49.4741 44.5063 49.2502 44.2824 48.9741 44.2824H42.7288C42.4527 44.2824 42.2288 44.0586 42.2288 43.7824V42.7124C42.2288 42.4362 42.4527 42.2124 42.7288 42.2124H48.9741C49.2502 42.2124 49.4741 41.9885 49.4741 41.7124V35.4671C49.4741 35.1909 49.6979 34.9671 49.9741 34.9671H51.0442C51.3203 34.9671 51.5442 35.1909 51.5442 35.4671V41.7124C51.5442 41.9885 51.768 42.2124 52.0442 42.2124H58.2894C58.5656 42.2124 58.7894 42.4362 58.7894 42.7124V43.7824Z" fill="white"/>
                </svg>
                <input
                  type="file"
                  id='front'
                  accept="image/*"
                  onChange={(e) => handleFileChange(e)}
                  className="w-full mt-2 hidden"
                />
                </label>)}
              </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-lime-300 hover:bg-lime-400 text-black py-2 rounded-full font-semibold"
              >
                Submit
              </button>
            </div>
          </div>
      )}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-xl md:text-3xl font-bold text-[#323844]">My Orders</h1>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button onClick={()=>{navigate('/create-buy-order')}} className="text-sm sm:text-base font-semibold bg-transparent border border-[#57661F] text-[#57661F] px-3 sm:px-4 py-1.5 sm:py-2 rounded-md">
            Create Buy Request
          </button>
          <button onClick={()=>{navigate('/create-sell-order')}} className="text-sm sm:text-base bg-[#CAEB4B] text-[#1D2308] font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-md">
            Create Sell Request
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-full h-full gap-6 mt-6">
        <div className="grid grid-cols-1 gap-4 md:w-1/2 w-full">
          <div className="rounded-lg p-4 shadow-sm border">
            <h3 className="text-[#5B6069]">Pending Sell Orders</h3>
            <p className="text-2xl font-bold text-[#323844] mt-2">{orders.sellOrders.pending.length || 0}</p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="text-[#5B6069]">Pending Buy Orders</h3>
            <p className="text-2xl font-bold text-[#323844] mt-2">{orders.buyOrders.pending.length || 0}</p>
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
      className={`px-4 py-2 rounded-3xl ${orderType === 'buy' ? 'bg-[#57661F] text-white' : 'bg-[#EBEBECCC] text-[#5B6069]'}`}
    >
      Buy Orders
    </button>
    <button
      onClick={() => setOrderType('sell')}
      className={`px-4 py-2 rounded-3xl ${orderType === 'sell' ? 'bg-[#57661F] text-white' : 'bg-[#EBEBECCC] text-[#5B6069]'}`}
    >
      Sell Orders
    </button>
  </div>

  <div className="flex gap-6 border-b mb-4">
    {['pending', ...(isLive ? ['approved'] : []), 'completed', 'cancelled'].map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`pb-2 capitalize transition ${
          activeTab === tab
            ? 'border-b-2 border-[#1E2229] font-semibold text-[#323844] '
            : 'text-[#323844]'
        }`}
      >
        {tab}
      </button>
    ))}
  </div>

  {!orders ? <LoadingSpinner size={'h-full'}/> :<div className="space-y-4">
    {orders[`${orderType}Orders`][activeTab].map((order) => {
  const isMatched = order.sellOrder && order.buyOrder;
  const displayOrder = isMatched ? order.sellOrder : order;

  return (
    <div key={order._id} className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
      <div>
        <p className="font-medium text-[#5B6069] truncate">Order #{order._id}</p>
        <div className='flex items-center'>
        <p className="font-semibold text-[#5B6069]">{isMatched ? order.seller.fullName : order.user.fullName} |</p> <span className='text-[#5B6069] ml-2'> {isMatched ? order.seller.phoneNumber : order.user.phoneNumber}</span>
        <Copy
          className="w-4 h-4 cursor-pointer text-[#8C55C1] ml-2"
          onClick={() => handleCopy(order.user?.phoneNumber)}
        />
        </div>
        <p className="text-sm text-[#1E2229]">
          {displayOrder.paymentMethod === 'bank' ? 'Bank Transfer' : "Crypto(USDT)"} 
          {orderType === 'sell' && <span>{displayOrder.paymentMethod === 'bank' ? <span className='text-[#1E2229]'> • {displayOrder.bankName}</span> : <span className='text-[#1E2229]'> • {displayOrder.cryptoNetwork}</span>}</span>}
          {isMatched && orderType === 'buy' && <span>{displayOrder.paymentMethod === 'bank' ? <span className='text-[#1E2229]'> • {displayOrder.bankName}</span> : <span className='text-[#1E2229]'> • {displayOrder.cryptoNetwork}</span>}</span>}
        </p>
        <p className="text-sm text-[#1E2229] flex items-center">
        {orderType === 'sell' && <><span> {displayOrder.paymentMethod === 'bank' 
            ? `Account no: ${displayOrder.accountNumber}` 
            : `Wallet Address: ${displayOrder.cryptoAddress}`}</span>
          <Copy
            className="w-4 h-4 cursor-pointer text-[#8C55C1] ml-2"
            onClick={() => handleCopy(displayOrder.paymentMethod === 'bank' ? displayOrder.accountNumber : displayOrder.cryptoAddress)}
          /></>}
          {isMatched && orderType === 'buy' &&
          <><span> {displayOrder.paymentMethod === 'bank' 
            ? `Account no: ${displayOrder.accountNumber}` 
            : `Wallet Address: ${displayOrder.cryptoAddress}`}</span>
          <Copy
            className="w-4 h-4 cursor-pointer text-[#8C55C1] ml-2"
            onClick={() => handleCopy(displayOrder.paymentMethod === 'bank' ? displayOrder.accountNumber : displayOrder.cryptoAddress)}
          /></>
          }
        </p>
      </div>
      
      <div className="mt-2 md:mt-0 flex justify-between w-1/2 items-center gap-4">
        <p className="font-semibold text-[#323844]">{order.amount?.toLocaleString()}</p>
        
        {!isMatched && order.status === 'pending' && (
          <button onClick={()=>{cancelOrder(order._id)}} className=" px-10 py-2 text-sm rounded bg-[#FF596D4D] text-[#FF4C61]">Cancel</button>
        )}
        {order.status === 'completed' && (
          <span className=" px-8 py-2 text-sm rounded bg-[#0CBC741A] text-[#0CBC74]">Completed</span>
        )}
        {order.status === 'cancelled' && (
          <span className=" px-8 py-2 text-sm rounded bg-[#FF596D4D] text-[#FF4C61]">Cancelled</span>
        )}

        {isMatched && (
          <>
            {orderType === 'buy' && order.paymentStatus === 'pending' && (
              <div className='hidden md:flex flex-col gap-4'>
                <div className='flex gap-2'>
                  <div className='border border-[#FF4C61] rounded-xl p-1'>
                    <p className='text-[#FF4C61] text-xs'>Awaiting payment</p>
                  </div>
                  <div className='bg-[#E0742B33] rounded-xl p-1'>
                    <p className='text-[#E0742B] text-xs'>Time left: {getRemainingMinutes(buyOrderTimer, 120)}mins</p>
                  </div>
                </div>
                <div className='flex justify-end'>
                <button onClick={()=>{setSelectedOrderId(order._id)
                  setShowModal(true)}} className="bg-[#CAEB4B] text-[#1D2308] px-20 py-3 text-sm rounded-lg">Paid</button>
                </div>
              </div>
            )}
            {orderType === 'buy' && order.paymentStatus === 'paid' && (
              <div className='hidden md:flex flex-col gap-4'>
                <div className='flex justify-end gap-2'>
                  <div className='border border-[#FF4C61] rounded-xl p-1'>
                    <p className='text-[#FF4C61] text-xs'>{getRemainingMinutes(order.paidAt) <= 0 ? 'Late Confirmation':'Awaiting confirmation'}</p>
                  </div>
                  {getRemainingMinutes(order.paidAt) > 0 && <div className='bg-[#E0742B33] rounded-xl p-1'>
                    <p className='text-[#E0742B] text-xs'>Time left: {getRemainingMinutes(order.paidAt)}mins</p>
                  </div>}
                </div>
                <div className='flex justify-end'>
                <button onClick={()=>{setAppealModal(order)}} disabled={getRemainingMinutes(order.paidAt) > 0} className={`${getRemainingMinutes(order.paidAt) <= 0 ? 'bg-[#E0742B4D] text-[#E0742B]' : 'bg-[#5B6069] text-[#D6D7DA]'} px-20 py-3 text-sm rounded-lg`}>Appeal</button>
                </div>
              </div>
            )}

            {orderType === 'sell' && order.paymentStatus === 'pending' && (
              <>
                <div className='hidden md:flex flex-col gap-4'>
                <div className='flex justify-end gap-2'>
                  <div className='border border-[#FF4C61] rounded-xl p-1'>
                    <p className='text-[#FF4C61] text-xs'>Awaiting payment</p>
                  </div>
                </div>
              </div>
              </>
            )}
            {orderType === 'sell' && order.paymentStatus === 'paid' && (
              <>
                <div className='hidden md:flex flex-col gap-4'>
                <div className='flex justify-end gap-2'>
                  <div className='border border-[#FF4C61] rounded-xl p-1'>
                    <p className='text-[#FF4C61] text-xs'>Awaiting confirmation</p>
                  </div>
                </div>
                <div className='flex justify-end gap-3'>
                <button onClick={()=>{setSelectedOrder(order.matchedOrder)
                  setViewModal(true)}} className="bg-[#8C55C11A] text-[#8C55C1] px-5 py-3 text-sm rounded-lg">View payment</button>
                <button onClick={()=>{setAppealModal(order)}} className="bg-[#E0742B33] text-[#E0742B] px-5 py-3 text-sm rounded-lg">Appeal</button>
                <button onClick={()=>{handleConfirmPayment(order._id)}} className="bg-[#CAEB4B] text-[#1D2308] px-5 py-3 text-sm rounded-lg">Confirm Payment</button>
                </div>
              </div>
              </>
            )}
          </>
        )}
    </div>
        {isMatched && (
          <>
          {orderType === 'buy' && order.paymentStatus === 'pending' && (
            <div className='flex flex-col gap-4  md:hidden mt-5 w-full'>
                <div className='flex gap-2 justify-between'>
                  <div className='border border-[#FF4C61] rounded-xl p-1 w-full'>
                    <p className='text-[#FF4C61] text-xs text-center'>Awaiting payment</p>
                  </div>
                  <div className='bg-[#E0742B33] rounded-xl p-1 w-full'>
                    <p className='text-[#E0742B] text-xs text-center'>Time left: {getRemainingMinutes(buyOrderTimer, 120)}mins</p>
                  </div>
                </div>
                <div className='flex justify-end'>
                <button onClick={()=>{setSelectedOrderId(order._id)
                  setShowModal(true)}} className="bg-[#CAEB4B] text-[#1D2308] px-20 py-3 text-sm rounded-lg w-full">Paid</button>
                </div>
              </div>
          )}

          {orderType === 'buy' && order.paymentStatus === 'paid' && (
              <div className='flex flex-col gap-4 md:hidden mt-5 w-full'>
                <div className='flex justify-end gap-2 w-full'>
                  <div className='border border-[#FF4C61] rounded-xl p-1 w-full'>
                    <p className='text-[#FF4C61] text-xs text-center'>{getRemainingMinutes(order.paidAt) <= 0 ? 'Late Confirmation':'Awaiting confirmation'}</p>
                  </div>
                  {getRemainingMinutes(order.paidAt) > 0 && <div className='bg-[#E0742B33] rounded-xl p-1'>
                    <p className='text-[#E0742B] text-xs'>Time left: {getRemainingMinutes(order.paidAt)}mins</p>
                  </div>}
                </div>
                <div className='flex justify-end w-full'>
                <button onClick={()=>{setAppealModal(order)}} disabled={getRemainingMinutes(order.paidAt) > 0} className={`${getRemainingMinutes(order.paidAt) <= 0 ? 'bg-[#E0742B4D] text-[#E0742B]' : 'bg-[#5B6069] text-[#D6D7DA]'} px-20 py-3 text-sm rounded-lg w-full`}>Appeal</button>
                </div>
              </div>
          )}

           {orderType === 'sell' && order.paymentStatus === 'pending' && (
              <>
                <div className='flex flex-col gap-4 mt-5 w-full md:hidden'>
                <div className='flex justify-end gap-2 w-full'>
                  <div className='border border-[#FF4C61] rounded-xl p-1 w-full'>
                    <p className='text-[#FF4C61] text-xs text-center'>Awaiting payment</p>
                  </div>
                </div>
              </div>
              </>
           )}

           {orderType === 'sell' && order.paymentStatus === 'paid' && (
              <>
                <div className='flex flex-col gap-4 mt-5 w-full md:hidden'>
                <div className='flex flex-col justify-end gap-2'>
                  <button onClick={()=>{setSelectedOrder(order.matchedOrder)
                  setViewModal(true)}} className="bg-[#8C55C11A] text-[#8C55C1] px-5 py-3 text-sm rounded-lg">View payment</button>
                  <div className='border border-[#FF4C61] rounded-xl p-1'>
                    <p className='text-[#FF4C61] text-xs text-center'>Awaiting confirmation</p>
                  </div>
                </div>
                <div className='flex justify-center gap-3'>
                <button onClick={()=>{setAppealModal(order)}} className="bg-[#E0742B33] text-[#E0742B] px-5 py-3 text-sm rounded-lg w-full">Appeal</button>
                <button onClick={()=>{handleConfirmPayment(order._id)}} className="bg-[#CAEB4B] text-[#1D2308] px-5 py-3 text-sm rounded-lg w-full">Confirm Payment</button>
                </div>
              </div>
              </>
           )}
          </>
        )}
      </div>
  );
})}
  </div>}
</div>
  );
}