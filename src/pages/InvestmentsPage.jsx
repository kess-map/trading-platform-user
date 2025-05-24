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
    <div className="p-4 md:p-8 min-h-screen w-full max-w-full overflow-x-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-[#323844]">Investment</h1>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button onClick={()=>{navigate('/create-investment')}} className="text-sm sm:text-base bg-[#CAEB4B] text-black font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-md hover:bg-lime-600 transition">
            New Investment
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-full h-full gap-6 mt-6">
        <div className="grid grid-cols-1 gap-4 md:w-1/2 w-full">
          <div className="flex flex-col justify-between rounded-lg p-4 shadow-sm border border-[#D6D7DA]">
            <h3 className="text-[#5B6069]">Total Investment</h3>
            <p className="text-xl md:text-3xl text-[#323844] font-semibold">{(summary.totalInvested).toLocaleString()}<span className="text-sm md:text-xl mb-4 text-[#323844] font-semibold">CHT</span></p>
          </div>
          <div className="flex flex-col justify-between border border-[#D6D7DA] rounded-lg p-4 shadow-sm">
            <h3 className="text-[#5B6069]">Total Expected Return</h3>
            <p className="text-xl md:text-3xl  text-[#323844] font-semibold">{(summary.totalExpectedReturn).toLocaleString()}<span className="text-sm md:text-xl mb-4 text-[#323844] font-semibold">CHT</span></p>
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
      className={`px-4 py-2 rounded-2xl capitalize ${activeTab === 'pending' ? 'bg-[#57661F] text-white' : 'bg-[#EBEBECCC] text-[#5B6069]'}`}
    >
      Pending
    </button>
    <button
      onClick={() => setActiveTab('completed')}
      className={`px-4 py-2 rounded-2xl capitalize ${activeTab === 'completed' ? 'bg-[#57661F] text-white' : 'bg-[#EBEBECCC] text-[#5B6069]'}`}
    >
      Completed
    </button>
  </div>
  <div className="bg-gradient-to-tl from-[#EEDDFF] via-[#FCFAFF] to-[#FCFAFF] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {displayedInvestments.map((item, index) => (
    <div key={index} className="border border-[#D6D7DA] rounded-xl p-4 shadow-md">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-semibold text-[#1E2229]">{item.planDurationDays} Days</h2>
        <span className="text-2xl text-[#8C55C1] font-bold">{item.roiPercentage}% ROI</span>
      </div>
      <div className="text-sm space-y-1 mb-3 flex justify-between items-center">
        <div className='flex flex-col'>
          <span className="text-[#5B6069]">Staked amount</span>
          <span className='text-xl text-[#1E2229] font-semibold'>{(item.amount).toLocaleString()}</span>
        </div>
        <div className='flex flex-col'>
          <span className="text-[#5B6069]">Expected Return</span>
          <span className='text-xl text-[#1E2229] font-semibold text-right'>{(item.amount + (item.amount * (item.roiPercentage/100))).toLocaleString()}</span>
        </div>
      </div>
      <div className="text-sm text-gray-400 mb-3 flex justify-between">
        <div>
          <p className='text-[#5B6069]'>Start date:</p>
          <p className='text-[#323844] font-medium'>{formatDateTime(item.investmentCreatedAt)}</p>
        </div>
        <div>
          <p className='text-[#5B6069] text-right'>End date:</p>
          <p className='text-[#323844] font-medium'>{formatDateTime(item.investmentEndsAt)}</p>
        </div>
      </div>
      <div className="mb-2">
        <div className="w-full bg-[#EFF9C9] rounded-full h-2.5">
          <div className="bg-[#445017] h-2.5 rounded-full" style={{ width: getProgressWidth(item.investmentCreatedAt, item.investmentEndsAt) }}></div>
        </div>
        <div className='flex justify-center mt-2'>
          <p className='text-[#323844] mr-3'>{getProgressWidth(item.investmentCreatedAt, item.investmentEndsAt)}</p>
          <p className='text-[#A972E0] text-xl mr-3'>•</p>
          <p className='text-[#323844]'>{getRemainingDays(item.investmentEndsAt)}</p>
        </div>
        {activeTab === 'completed' && (
          <>
          <div className="flex justify-center gap-4 px-4 mt-4">
            <button
              onClick={() =>
                setExpandedCardIndex(expandedCardIndex === index ? null : index)
              }
              className="text-sm sm:text-base w-full border border-[#57661F] text-[#57661F] font-semibold px-4 py-2 rounded-lg transition"
            >
              {expandedCardIndex === index ? 'Hide' : 'View'}
            </button>
      
            <button
              onClick={() => handleReinvest(item)} // implement this function
              className="text-sm sm:text-base w-full bg-[#CAEB4B] text-[#1D2308] font-semibold px-4 py-2 rounded-lg  transition"
            >
              Re-invest
            </button>
          </div>
      
          {expandedCardIndex === index && (
            <>
              <div className="mt-4 p-4 border border-[#57661F] rounded-lg text-white text-center">
                <p className="text-lg font-semibold mb-2 text-[#323844]">Time Left Till Capital Release</p>
                <div className="mb-2">
                  <div className="w-full bg-[#EFF9C9] rounded-full h-2.5">
                    <div className="bg-[#445017] h-2.5 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <p className='text-[#323844]'>{item.percentage.toFixed(0)}%</p>
                    <p className='text-[#323844]'>{getRemainingDays(item.countdown)} days left</p>
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