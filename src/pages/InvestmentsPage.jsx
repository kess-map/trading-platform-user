import React, { useEffect, useState } from 'react';
import LiveSessionTimer from '../components/Timer';
import axiosInstance from '../utils/axios';
import LoadingSpinner from '../components/LoadingSpinner'
import { useNavigate } from 'react-router-dom';
import { Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import { useOrderStore } from '../store/orderStore';

export default function InvestmentsPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingInvestments, setPendingInvestments] = useState([]);
  const [completedInvestments, setCompletedInvestments] = useState([]);
  const [summary, setSummary] = useState({totalInvested: 0, totalExpectedReturn: 0});
  const [loading, setLoading] = useState(true);
  const [expandedCardIndex, setExpandedCardIndex] = useState(null);
  const {reinvestInvestment} = useOrderStore()

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/investments');
      const { pending, completed, summary } = res.data;
  
      const addCountdownToInvestment = async (investment) => {
        try {
          const countdownRes = await axiosInstance.get(`/investments/countdown/${investment._id}`);
          return {
            ...investment,
            countdown: countdownRes.data.countdownEndsAt,
            percentage: countdownRes.data.percentageCompleted
          };
        } catch (error) {
          console.error("Countdown fetch error", error);
          return { ...investment, countdown: null };
        }
      };
  
      const completedWithCountdown = await Promise.all(completed.map(addCountdownToInvestment));
  
      setPendingInvestments(pending);
      setCompletedInvestments(completedWithCountdown);
      setSummary(summary)
    } catch (error) {
      toast.error('Failed to fetch investments');
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchInvestments()
  }, []);

  const handleReinvest = async(investment)=>{
    await reinvestInvestment(investment._id)

    setCompletedInvestments((prev) =>
      prev.filter((inv) => inv._id !== investment._id)
    );
  
    setExpandedCardIndex(null);
  }

  const displayedInvestments = activeTab === 'pending' ? pendingInvestments : completedInvestments;

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
  
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
  
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
  
    hours = hours % 12;
    hours = hours ? hours : 12;
  
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
    return `${month}/${day}/${year} ${hours}:${formattedMinutes}${ampm}`;
  };  

  const getProgressWidth = (start, end) => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);
  
    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsed = now.getTime() - startDate.getTime();
  
    let percentage = (elapsed / totalDuration) * 100;
    if (percentage > 100) percentage = 100;
    if (percentage < 0) percentage = 0;
  
    return `${percentage.toFixed(2)}%`;
  };

  const getRemainingDays = (endDateStr) => {
    const now = new Date();
    const endDate = new Date(endDateStr);
  
    const diffInMs = endDate.getTime() - now.getTime();
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  
    return diffInDays > 0 ? `${diffInDays} day(s) left` : 'Paid to wallet';
  };

  return (
    <div className="p-4 md:p-8 min-h-screen w-full max-w-full overflow-x-hidden bg-black">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-[#D6D7DA]">Investment</h1>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button onClick={()=>{navigate('/create-investment')}} className="text-sm sm:text-base bg-[#CAEB4B] text-black font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-md hover:bg-lime-600 transition">
            New Investment
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-full h-full gap-6 mt-6">
        <div className="grid grid-cols-1 gap-4 md:w-1/2 w-full">
          <div className="rounded-lg p-4 shadow-sm border border-[#5B6069]">
            <h3 className="text-[#ADAFB4]">Total Investment</h3>
            <p className="text-2xl font-bold text-[#D6D7DA] mt-2">{(summary.totalInvested).toLocaleString()}CHT</p>
          </div>
          <div className="border border-[#5B6069] rounded-lg p-4 shadow-sm">
            <h3 className="text-[#ADAFB4]">Total Expected Return</h3>
            <p className="text-2xl font-bold text-[#D6D7DA] mt-2">{(summary.totalExpectedReturn).toLocaleString()}CHT</p>
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
      onClick={() => setActiveTab('pending')}
      className={`px-4 py-2 rounded-3xl ${activeTab === 'pending' ? 'bg-[#57661F] text-white' : 'bg-[#57661F33] text-[#ADAFB4]'}`}
    >
      Pending
    </button>
    <button
      onClick={() => setActiveTab('completed')}
      className={`px-4 py-2 rounded-3xl ${activeTab === 'completed' ? 'bg-[#57661F] text-white' : 'bg-[#57661F33] text-[#ADAFB4]'}`}
    >
      Completed
    </button>
  </div>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {displayedInvestments.map((item, index) => (
    <div key={index} className="border border-[#5B6069] rounded-xl p-4 bg-black shadow-md">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-semibold text-white">{item.planDurationDays} Days</h2>
        <span className="text-2xl text-[#8C55C1] font-bold">{item.roiPercentage}% ROI</span>
      </div>
      <div className="text-sm text-gray-300 space-y-1 mb-3 flex justify-between items-center">
        <div className='flex flex-col'>
          <span className="text-gray-400">Staked amount</span>
          <span className='text-xl'>{(item.amount).toLocaleString()}</span>
        </div>
        <div className='flex flex-col'>
          <span className="text-gray-400">Expected Return</span>
          <span className='text-xl text-right'>{(item.amount + (item.amount * (item.roiPercentage/100))).toLocaleString()}</span>
        </div>
      </div>
      <div className="text-sm text-gray-400 mb-3 flex justify-between">
        <div>
          <p>Start date:</p>
          <p>{formatDateTime(item.investmentCreatedAt)}</p>
        </div>
        <div>
          <p className='text-right'>End date:</p>
          <p>{formatDateTime(item.investmentEndsAt)}</p>
        </div>
      </div>
      <div className="mb-2">
        <div className="w-full bg-[#EFF9C9] rounded-full h-2.5">
          <div className="bg-[#445017] h-2.5 rounded-full" style={{ width: getProgressWidth(item.investmentCreatedAt, item.investmentEndsAt) }}></div>
        </div>
        <div className='flex justify-center mt-2'>
          <p className='text-[#D6D7DA] mr-3'>{getProgressWidth(item.investmentCreatedAt, item.investmentEndsAt)}</p>
          <p className='text-[#A972E0] text-xl mr-3'>•</p>
          <p className='text-[#D6D7DA]'>{getRemainingDays(item.investmentEndsAt)}</p>
        </div>
        {activeTab === 'completed' && (
          <>
          <div className="flex justify-center gap-4 px-4 mt-4">
            <button
              onClick={() =>
                setExpandedCardIndex(expandedCardIndex === index ? null : index)
              }
              className="text-sm sm:text-base w-full bg-black border border-[#57661F] text-[#57661F] font-semibold px-4 py-2 rounded-md transition"
            >
              {expandedCardIndex === index ? 'Hide' : 'View'}
            </button>
      
            <button
              onClick={() => handleReinvest(item)} // implement this function
              className="text-sm sm:text-base w-full bg-[#CAEB4B] text-[#1D2308] font-semibold px-4 py-2 rounded-md  transition"
            >
              Re-invest
            </button>
          </div>
      
          {expandedCardIndex === index && (
            <>
              <div className="mt-4 p-4 border border-[#5B6069] rounded-lg bg-[#111] text-white text-center">
                <p className="text-lg font-semibold mb-2">Time Left Till Capital Release</p>
                <div className="mb-2">
                  <div className="w-full bg-[#EFF9C9] rounded-full h-2.5">
                    <div className="bg-[#445017] h-2.5 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <p className='text-[#D6D7DA]'>{item.percentage.toFixed(0)}%</p>
                    <p className='text-[#D6D7DA]'>{getRemainingDays(item.countdown)} days left</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
      </div>
    </div>
  ))}
</div>
</div>
  );
}