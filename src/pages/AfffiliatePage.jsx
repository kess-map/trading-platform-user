import React, { useEffect, useState } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'
import axiosInstance from '../utils/axios'

const AffiliatePage = () => {
    const baseUrl = `${window.location.protocol}//${window.location.host}`
	const {user} = useAuthStore()
	const refCode = user.referralCode || ''
	const refLink = `${baseUrl}/signup?ref=${refCode}`
    const [referrals, setReferrals] = useState([]);
    const [referralCount, setReferralCount] = useState({
        totalReferrals: 0,
        activeReferrals: 0
      })
    const [loading, setLoading] = useState(true);


    const getReferralDetails = async () => {
        try {
          setLoading(true)
          const res = await axiosInstance.get('/investments/referrals')
          setReferrals(res.data.referralList);
        } catch (err) {
          toast.error(err.response.data.message || 'Something went wrong')
        } finally {
          setLoading(false);
        }
      };
    const getReferralCount = async () => {
        try {
          setLoading(true)
          const res = await axiosInstance.get('/investments/referral-count')
          setReferralCount(res.data);
        } catch (err) {
          toast.error(err.response.data.message || 'Something went wrong')
        } finally {
          setLoading(false);
        }
      };

      useEffect(()=>{
        getReferralDetails()
        getReferralCount()
      },[])
	
	const handleCopy = (text)=>{
		navigator.clipboard.writeText(text)
		.then(()=>toast.success('Copied to clipboard'))
		.catch(err=>toast.error('Failed to copy', err))
	}
  return (
    <div className="w-full min-h-screen px-4 md:px-8 py-6">
      <div className='flex justify-between'>
      <h2 className="text-xl md:text-3xl font-bold mb-6 text-[#323844]">Affiliate & referral</h2>
      </div>

      {!user ? <LoadingSpinner/> : <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6 h-50 md:h-36">
          <div className="flex flex-col justify-between border border-[#D6D7DA] p-4 rounded-xl">
            <p className="text-[#5B6069] text-sm">Referral Bonus</p>
            <p className="text-3xl mb-4 text-[#323844] font-semibold">{(user.referralBonusBalance).toLocaleString()} CHT</p>
          </div>
          <div className="flex flex-col justify-between border border-[#D6D7DA] p-4 rounded-xl">
            <p className="text-[#5B6069] text-sm">Total referrals</p>
            <p className="text-3xl mb-4 text-[#323844] font-semibold">{referralCount.totalReferrals}</p>
          </div>
          <div className="flex flex-col justify-between border border-[#D6D7DA] p-4 rounded-xl">
            <p className="text-[#5B6069] text-sm">Active referees</p>
            <p className="text-3xl mb-4 text-[#323844] font-semibold">{referralCount.activeReferrals}</p>
          </div>
      </div>}

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="border rounded-3xl p-8">
          <h4 className="font-semibold mb-2 text-2xl text-purple-600">Referral Link</h4>
          <div >
            <p className='text-[#323844] mb-5'>Earn 50% of your referee investment</p>
            <div className="flex justify-between">
              <input
                className="bg-transparent border px-2 py-1 rounded-lg text-[#84888F] w-[85%]"
                value={refLink}
                readOnly
              />
              <button onClick={()=>handleCopy(refLink)} className="bg-[#CAEB4B] text-[#445017] px-3 py-1 rounded-lg">Copy</button>
            </div>
          </div>
        </div>
        <div className="border rounded-3xl p-8">
        <h4 className="font-semibold mb-2 text-2xl text-purple-600">Referral ID</h4>
          <div >
            <p className='text-[#323844] mb-5'>Earn 50% of your referee investment</p>
            <div className="flex justify-between">
              <input
                className="bg-transparent border px-2 py-1 rounded-lg text-[#84888F] w-[85%]"
                value={refCode}
                readOnly
              />
              <button onClick={()=>handleCopy(refCode)} className="bg-[#CAEB4B] text-[#445017] px-3 py-1 rounded-lg">Copy</button>
            </div>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl">
      <h3 className="text-lg font-semibold text-[#1E2229] mb-3 pt-4">Referral list</h3>
      <div className='border rounded-3xl p-4 overflow-x-auto'>
            {referrals.length === 0 ? (
                <div className="rounded-xl py-16 px-6 text-center">
                <h3 className="text-xl font-semibold text-[#323844] mb-2">No referrals yet</h3>
                <p className="text-[#84888F] mb-4">
                Share your referral link and earn bonuses when your referees invest.
                </p>
                <div className="flex justify-between sm:inline-flex items-center gap-2 border rounded-lg px-4 py-2">
                <span className="text-[#84888F] text-sm truncate">{refLink}</span>
                <button
                    onClick={() => handleCopy(refLink)}
                    className="bg-lime-400 text-black text-sm px-3 py-1 rounded-md"
                    >
                    Copy
                </button>
                </div>
            </div>
            ) : (<table className="min-w-full text-sm text-left text-[#ADAFB4] ">
                    <thead className="text-sm text-[#D6D7DA]">
                    <tr>
                        <th className="px-4 py-3 text-[#5B6069]">Username</th>
                        <th className="px-4 py-3  text-[#5B6069]">Investment status</th>
                        <th className="px-4 py-3  text-[#5B6069]">Amount invested</th>
                        <th className="px-4 py-3  text-[#5B6069]">Date joined</th>
                        <th className="px-4 py-3  text-[#5B6069]">Bonus</th>
                    </tr>
                    </thead>
                    <tbody>{referrals.map((ref, idx) => (
                    <tr
                    key={idx}
                    className="border-t"
                    >
                    <td className="px-4 py-3 text-[#323844] font-medium capitalize">{ref.username}</td>
                    <td className="px-4 py-3 text-[#323844] font-medium">{ref.amountInvested > 0 ? 'Invested' : 'No Investmests'}</td>
                    <td className="px-4 py-3 text-[#323844] font-medium">{ref.amountInvested.toLocaleString()}</td>
                    <td className="px-4 py-3 text-[#323844] font-medium]">{new Date(ref.dateJoined).toLocaleDateString('en-GB')}</td>
                    <td className="px-4 py-3 text-[#323844] font-medium">{ref.bonus}</td>
                    </tr>
            ))}</tbody>
            </table>
            )}
      </div>
    </div>
    </div>
  )
}

export default AffiliatePage