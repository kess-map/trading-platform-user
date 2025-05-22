import React, { useEffect, useState } from 'react'
import LiveSessionTimer from '../components/Timer'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'
import { Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOrderStore } from '../store/orderStore';
import axiosInstance from '../utils/axios'

const HomePage = () => {
	const navigate = useNavigate()
  const baseUrl = `${window.location.protocol}//${window.location.host}`
	const {user} = useAuthStore()
	const {getPendingBuyOrders, getPendingSellOrders, pendingBuyOrders, pendingSellOrders, cancelBuyOrder, cancelSellOrder} = useOrderStore()
	const refCode = user.referralCode || ''
	const refLink = `${baseUrl}/signup?ref=${refCode}`
	const [pendingOrders, setPendingOrders] = useState([])
  const [selectedTab, setSelectedTab] = useState('sell');
  const [notifications, setNotifications] = useState([])

  const fetchNotifications = async()=>{
    const response = await axiosInstance.get('/notifications?limit=4')
    setNotifications(response.data.data)
  }

	useEffect(()=>{
    fetchNotifications()
		getPendingBuyOrders()
		getPendingSellOrders()
		if(pendingSellOrders.length > 0){
			setPendingOrders(pendingSellOrders)
		}
	},[getPendingBuyOrders, getPendingSellOrders, pendingSellOrders.length])

	
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

  const cancelOrder = async(id)=>{
    if(selectedTab === 'sell'){
      await cancelSellOrder(id)
      setPendingOrders(prev => prev.filter(order => order._id !== id));
    }else{
      await cancelBuyOrder(id)
      setPendingOrders(prev => prev.filter(order => order._id !== id));
    }
  }

  if(!user) return <LoadingSpinner/>
  return (
    <div className="w-full min-h-screen bg-black px-4 md:px-8 py-6">
      <div className='flex justify-between'>
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-[#EBEBEC]">Welcome, {user.username}</h2>
      <button className='bg-[#CAEB4B] w-40 h-10 rounded-xl font-medium'>Buy/sell token</button>
      </div>

       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 h-50 md:h-36">
          <div className="flex flex-col justify-between border border-[#5B6069] p-4 rounded-xl">
            <p className="text-[rgb(173,175,180)] text-sm">Available Balance</p>
            <p className="text-xl md:text-3xl mb-4 text-[#D6D7DA] font-semibold">{user.availableBalance.toLocaleString()} CHT</p>
          </div>
          <div className="flex flex-col justify-between border border-[#5B6069] p-4 rounded-xl">
            <p className="text-[#ADAFB4] text-sm">Total Balance</p>
            <p className="text-xl md:text-3xl mb-4 text-[#D6D7DA] font-semibold">{(user.availableBalance + user.stakedBalance).toLocaleString()} CHT</p>
          </div>
          <div className="flex flex-col justify-between border border-[#5B6069] p-4 rounded-xl">
            <p className="text-[#ADAFB4] text-sm">Staked Balance</p>
            <p className="text-xl md:text-3xl mb-4 text-[#D6D7DA] font-semibold">{user.stakedBalance.toLocaleString()} CHT</p>
          </div>
          <div className="flex flex-col justify-between border border-[#5B6069] p-4 rounded-xl">
            <p className="text-[#ADAFB4] text-sm">Referral Balance</p>
            <p className="text-xl md:text-3xl mb-4 text-[#D6D7DA] font-semibold">{user.referralBonusBalance.toLocaleString()} CHT</p>
          </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-[#303910] p-8 hidden md:flex flex-col justify-between rounded-2xl">
          <div className='flex justify-between'>

          <div >
          <div >
            <h3 className="font-bold text-[#EBEBEC] text-2xl mb-4">Earn up to 100% ROI on investment</h3>
            <div className='flex justify-between'>
            <div className='flex flex-col gap-4'>
              <div className='flex'>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='mr-2'>
                <path d="M12 24C15.1826 24 18.2348 22.7357 20.4853 20.4853C22.7357 18.2348 24 15.1826 24 12C24 8.8174 22.7357 5.76516 20.4853 3.51472C18.2348 1.26428 15.1826 0 12 0C8.8174 0 5.76516 1.26428 3.51472 3.51472C1.26428 5.76516 0 8.8174 0 12C0 15.1826 1.26428 18.2348 3.51472 20.4853C5.76516 22.7357 8.8174 24 12 24ZM17.2969 9.79688L11.2969 15.7969C10.8562 16.2375 10.1438 16.2375 9.70781 15.7969L6.70781 12.7969C6.26719 12.3562 6.26719 11.6438 6.70781 11.2078C7.14844 10.7719 7.86094 10.7672 8.29688 11.2078L10.5 13.4109L15.7031 8.20312C16.1437 7.7625 16.8562 7.7625 17.2922 8.20312C17.7281 8.64375 17.7328 9.35625 17.2922 9.79219L17.2969 9.79688Z" fill="#7D922D"/>
                </svg>
                <p className='text-[#D6D7DA]'>Acquire tokens</p>
              </div>
              <div className='flex'>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='mr-2'>
                <path d="M12 24C15.1826 24 18.2348 22.7357 20.4853 20.4853C22.7357 18.2348 24 15.1826 24 12C24 8.8174 22.7357 5.76516 20.4853 3.51472C18.2348 1.26428 15.1826 0 12 0C8.8174 0 5.76516 1.26428 3.51472 3.51472C1.26428 5.76516 0 8.8174 0 12C0 15.1826 1.26428 18.2348 3.51472 20.4853C5.76516 22.7357 8.8174 24 12 24ZM17.2969 9.79688L11.2969 15.7969C10.8562 16.2375 10.1438 16.2375 9.70781 15.7969L6.70781 12.7969C6.26719 12.3562 6.26719 11.6438 6.70781 11.2078C7.14844 10.7719 7.86094 10.7672 8.29688 11.2078L10.5 13.4109L15.7031 8.20312C16.1437 7.7625 16.8562 7.7625 17.2922 8.20312C17.7281 8.64375 17.7328 9.35625 17.2922 9.79219L17.2969 9.79688Z" fill="#7D922D"/>
                </svg>
                <p className='text-[#D6D7DA]'>Stake & Earn</p>
              </div>
            </div>
              <button onClick={()=>navigate('/investment')} className="bg-[#57661F] text-white px-4 py-2 rounded-xl mt-4 w-fit">Invest Now</button>
            </div>
          </div>
          </div>
        <div>
        <svg width="141" height="153" viewBox="0 0 141 153" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M70.5 141C109.436 141 141 109.436 141 70.5001C141 31.5639 109.436 0 70.5 0C31.5639 0 0 31.5639 0 70.5001C0 109.436 31.5639 141 70.5 141Z" fill="#EAF7B7" fill-opacity="0.5"/>
          <path d="M79.7297 60.6726C86.3915 54.0108 86.3915 43.2099 79.7297 36.5481C73.0679 29.8864 62.2671 29.8864 55.6053 36.5481C48.9435 43.2099 48.9435 54.0108 55.6053 60.6726C62.2671 67.3343 73.0679 67.3343 79.7297 60.6726Z" fill="#DC891A"/>
          <path d="M77.6294 60.6716C84.2911 54.0098 84.2911 43.2089 77.6294 36.5472C70.9676 29.8854 60.1667 29.8854 53.505 36.5472C46.8432 43.2089 46.8432 54.0098 53.505 60.6716C60.1667 67.3334 70.9676 67.3334 77.6294 60.6716Z" fill="#FFB327"/>
          <path d="M65.2862 52.6176C64.7565 52.6176 64.3044 52.4292 63.9301 52.0525C63.5557 51.6758 63.3686 51.2226 63.3686 50.6928C63.3686 50.163 63.5569 49.711 63.9336 49.3367C64.3103 48.9623 64.764 48.7752 65.2945 48.7752C65.8251 48.7752 66.2772 48.9639 66.6507 49.3414C67.0242 49.7189 67.2114 50.1722 67.2122 50.7011C67.213 51.2301 67.0242 51.6822 66.6459 52.0573C66.2676 52.4324 65.8144 52.6196 65.2862 52.6188M60.9775 43.4219H69.6021L71.1188 40.3421C71.287 40.0225 71.2798 39.7124 71.0974 39.4118C70.915 39.1112 70.6414 38.9609 70.2766 38.9609H60.303C59.9382 38.9609 59.6646 39.1112 59.4821 39.4118C59.2997 39.7124 59.2926 40.0229 59.4607 40.3433L60.9775 43.4219ZM61.282 57.9946H69.2976C70.8282 57.9946 72.1288 57.4589 73.1995 56.3874C74.2709 55.316 74.8066 54.013 74.8066 52.4784C74.8066 51.8376 74.6968 51.2135 74.4771 50.606C74.2574 49.9985 73.9402 49.4453 73.5254 48.9465L69.9066 44.6116H60.6729L57.0542 48.9465C56.6394 49.4453 56.3222 49.9985 56.1025 50.606C55.8828 51.2127 55.773 51.8368 55.773 52.4784C55.773 54.013 56.3087 55.316 57.3801 56.3874C58.4516 57.4589 59.7522 57.9946 61.282 57.9946Z" fill="white"/>
          <path d="M55.7722 30.2587C54.7497 28.6123 53.654 27.0157 52.4859 25.4693C51.9248 24.7264 50.7091 25.5248 51.2751 26.2741C52.4433 27.8204 53.5388 29.4172 54.5614 31.0634C55.0551 31.8586 56.2663 31.0545 55.7722 30.2587Z" fill="#DC891A"/>
          <path d="M63.8198 28.7857C63.4193 26.7515 63.2157 24.6853 63.178 22.6131C63.1609 21.6771 61.7098 21.7625 61.7268 22.6968C61.767 24.9048 62.0165 27.086 62.4427 29.2521C62.6225 30.166 63.9984 29.6931 63.8198 28.7857Z" fill="#DC891A"/>
          <path d="M71.1682 23.0976C70.1889 24.7757 69.4848 26.5877 69.0628 28.484C68.8592 29.3986 70.2813 29.702 70.4844 28.7889C70.8809 27.0078 71.5439 25.3334 72.4635 23.7578C72.9364 22.9476 71.638 22.2924 71.1682 23.0976Z" fill="#DC891A"/>
          <path d="M81.4472 25.1266C79.8759 26.7223 78.5281 28.5098 77.4097 30.4496C76.9411 31.2624 78.2391 31.9178 78.705 31.1097C79.7632 29.2744 81.0465 27.6028 82.5326 26.0934C83.1903 25.4254 82.1025 24.461 81.4472 25.1266Z" fill="#DC891A"/>
          <path d="M111.98 41.0654L99.2335 45.1868L102.889 48.8377L76.2822 74.7263L53.5986 69.4395L21.7238 106.547L24.9596 109.144L54.9908 73.3385L77.4647 79.0862L104.782 50.7274L108.067 54.0082L111.98 41.0654Z" fill="#57661F" fill-opacity="0.7"/>
          <path d="M120.155 144.585V65.964C120.155 64.8849 119.272 64.002 118.193 64.002H99.072C97.9929 64.002 97.1099 64.8849 97.1099 65.964V144.585H94.6324V87.9794C94.6324 86.9003 93.7494 86.0174 92.6703 86.0174H73.5491C72.47 86.0174 71.587 86.9003 71.587 87.9794V144.585H69.1094V103.635C69.1094 102.556 68.2265 101.673 67.1474 101.673H48.0261C46.947 101.673 46.0641 102.556 46.0641 103.635V144.585H43.5865V122.228C43.5865 121.149 42.7035 120.266 41.6244 120.266H22.5032C21.4241 120.266 20.5411 121.149 20.5411 122.228V144.585H13V152.146H128V144.585H120.155Z" fill="#57661F" fill-opacity="0.7"/>
          </svg>
        </div>
          </div>
        </div>

        <LiveSessionTimer 
        greenBgColor={'bg-[#22B831]'} 
        redBgColour={'bg-[#CA636E]'} 
        redSecBgColour={'bg-[#EBEBEC]'} 
        greenSecBgColor={'bg-white'} 
        greenTimerLabelColour={'text-[#22B831]'}
        redTimerLabelColour={'text-[#CA636E]'}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="border rounded-3xl p-8">
          <h4 className="font-semibold mb-2 text-2xl text-purple-600">Earn from direct referrals</h4>
          <div className="mb-2">
            <label className="text-sm block mb-1 text-[#ADAFB4]">Referral link</label>
            <div className="flex justify-between">
              <input
                className="bg-black border px-2 py-1 rounded-lg text-[#ADAFB4] w-[85%]"
                value={refLink}
                readOnly
              />
              <button onClick={()=>handleCopy(refLink)} className="bg-lime-400 px-3 py-1 rounded-lg">Copy</button>
            </div>
          </div>
          <div>
            <label className="text-sm block mb-1">Referral ID</label>
            <div className="flex justify-between">
              <input className="bg-black border px-2 py-1 rounded-lg text-[#ADAFB4] w-[85%]" value={refCode} readOnly />
              <button onClick={()=>handleCopy(refCode)} className="bg-lime-400 px-3 py-1 rounded-lg">Copy</button>
            </div>
          </div>
        </div>

        <div className="flex justify-between border rounded-3xl p-8">
          <div>

              <h4 className=" text-2xl font-semibold mb-2 text-purple-600">Identity verification</h4>
              <p className="text-md text-[#D6D7DA] mb-2">Verification is simple and fast</p>
              <div className='flex flex-col justify-between'>
                <div className='flex flex-col gap-4'>
                  <div className='flex'>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='mr-2'>
                    <path d="M12 24C15.1826 24 18.2348 22.7357 20.4853 20.4853C22.7357 18.2348 24 15.1826 24 12C24 8.8174 22.7357 5.76516 20.4853 3.51472C18.2348 1.26428 15.1826 0 12 0C8.8174 0 5.76516 1.26428 3.51472 3.51472C1.26428 5.76516 0 8.8174 0 12C0 15.1826 1.26428 18.2348 3.51472 20.4853C5.76516 22.7357 8.8174 24 12 24ZM17.2969 9.79688L11.2969 15.7969C10.8562 16.2375 10.1438 16.2375 9.70781 15.7969L6.70781 12.7969C6.26719 12.3562 6.26719 11.6438 6.70781 11.2078C7.14844 10.7719 7.86094 10.7672 8.29688 11.2078L10.5 13.4109L15.7031 8.20312C16.1437 7.7625 16.8562 7.7625 17.2922 8.20312C17.7281 8.64375 17.7328 9.35625 17.2922 9.79219L17.2969 9.79688Z" fill="#7D922D"/>
                    </svg>
                    <p className='text-[#D6D7DA]'>Create Up to 10 Sell Orders</p>
                  </div>
                  <div className='flex'>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='mr-2'>
                    <path d="M12 24C15.1826 24 18.2348 22.7357 20.4853 20.4853C22.7357 18.2348 24 15.1826 24 12C24 8.8174 22.7357 5.76516 20.4853 3.51472C18.2348 1.26428 15.1826 0 12 0C8.8174 0 5.76516 1.26428 3.51472 3.51472C1.26428 5.76516 0 8.8174 0 12C0 15.1826 1.26428 18.2348 3.51472 20.4853C5.76516 22.7357 8.8174 24 12 24ZM17.2969 9.79688L11.2969 15.7969C10.8562 16.2375 10.1438 16.2375 9.70781 15.7969L6.70781 12.7969C6.26719 12.3562 6.26719 11.6438 6.70781 11.2078C7.14844 10.7719 7.86094 10.7672 8.29688 11.2078L10.5 13.4109L15.7031 8.20312C16.1437 7.7625 16.8562 7.7625 17.2922 8.20312C17.7281 8.64375 17.7328 9.35625 17.2922 9.79219L17.2969 9.79688Z" fill="#7D922D"/>
                    </svg>
                    <p className='text-[#D6D7DA]'>Earn from referrals</p>
                  </div>
                </div>
                  <button onClick={()=>navigate('/investment')} className="bg-[#57661F] text-white px-4 py-2 rounded-xl mt-4 w-fit">Invest Now</button>
                </div>
            </div>
          <svg width="130" height="230" viewBox="0 0 188 276" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M180.189 70.621C178.098 62.7935 178.968 53.7335 175.003 46.8808C170.981 39.9298 162.661 36.1749 157.02 30.5341C151.379 24.8922 147.624 16.5722 140.673 12.5507C133.82 8.58529 124.76 9.45551 116.933 7.36433C109.369 5.34201 101.978 0 93.7769 0C85.5756 0 78.1844 5.34218 70.621 7.36433C62.7935 9.45551 53.7335 8.58529 46.8807 12.5507C39.9298 16.5722 36.1749 24.8922 30.5341 30.5341C24.8922 36.1748 16.5722 39.9296 12.5507 46.8808C8.58529 53.7335 9.45552 62.7935 7.36433 70.621C5.34201 78.1844 0 85.5757 0 93.7769C0 101.978 5.34201 109.369 7.36433 116.933C9.45552 124.76 8.58529 133.82 12.5507 140.673C16.5722 147.624 24.8922 151.379 30.5341 157.02C36.1748 162.662 39.9296 170.982 46.8807 175.003C53.7335 178.969 62.7935 178.098 70.621 180.19C78.1844 182.212 85.5756 187.554 93.7769 187.554C101.978 187.554 109.369 182.212 116.933 180.19C124.76 178.098 133.82 178.969 140.673 175.003C147.624 170.982 151.379 162.662 157.02 157.02C162.661 151.379 170.981 147.624 175.003 140.673C178.968 133.82 178.098 124.76 180.189 116.933C182.212 109.369 187.554 101.978 187.554 93.7769C187.554 85.5757 182.212 78.1844 180.189 70.621ZM93.7767 168.607C52.4486 168.607 18.9466 135.105 18.9466 93.7771C18.9466 52.4489 52.4486 18.9468 93.7767 18.9468C135.105 18.9468 168.607 52.4487 168.607 93.7769C168.607 135.105 135.105 168.607 93.7767 168.607Z" fill="#E9D2FF" fill-opacity="0.7"/>
            <path d="M93.7768 161.654C84.6159 161.654 75.7263 159.858 67.3545 156.317C59.271 152.898 52.0126 148.005 45.7808 141.773C39.5489 135.541 34.6557 128.283 31.2366 120.199C27.6957 111.828 25.9002 102.938 25.9002 93.7771C25.9002 84.6164 27.6956 75.7266 31.2366 67.3547C34.6557 59.2713 39.5491 52.0129 45.7808 45.781C52.0126 39.5493 59.271 34.6559 67.3545 31.2368C75.7263 27.6958 84.6161 25.9004 93.7768 25.9004C102.937 25.9004 111.827 27.6958 120.199 31.2368C128.283 34.6557 135.541 39.5491 141.773 45.781C148.005 52.0129 152.898 59.2713 156.317 67.3547C159.858 75.7266 161.653 84.6163 161.653 93.7771C161.653 102.938 159.858 111.828 156.317 120.199C152.898 128.283 148.004 135.541 141.773 141.773C135.541 148.005 128.283 152.898 120.199 156.317C111.827 159.858 102.938 161.654 93.7768 161.654ZM93.7768 33.6101C85.6516 33.6101 77.7727 35.2 70.3589 38.3358C63.1951 41.3659 56.7598 45.7049 51.2324 51.2326C45.7047 56.7602 41.3656 63.1954 38.3355 70.3592C35.1998 77.7731 33.6099 85.6519 33.6099 93.7771C33.6099 101.902 35.1999 109.781 38.3355 117.195C41.3656 124.359 45.7047 130.794 51.2324 136.322C56.7598 141.849 63.1951 146.188 70.3589 149.218C77.7727 152.354 85.6516 153.944 93.7768 153.944C101.902 153.944 109.781 152.354 117.195 149.218C124.358 146.188 130.794 141.849 136.321 136.322C141.849 130.794 146.188 124.359 149.218 117.195C152.354 109.781 153.944 101.902 153.944 93.7771C153.944 85.6519 152.354 77.7731 149.218 70.3592C146.188 63.1953 141.849 56.7602 136.321 51.2326C130.794 45.7049 124.358 41.3658 117.195 38.3358C109.781 35.2 101.902 33.6101 93.7768 33.6101Z" fill="#E9D2FF" fill-opacity="0.7"/>
            <path d="M86.6771 136.192C83.1206 136.192 79.9033 134.222 78.2806 131.05C75.309 125.242 66.7786 110.464 51.782 98.7148C50.3087 97.5604 49.7223 95.594 50.3228 93.8213C50.9226 92.0511 52.5812 90.8477 54.4502 90.8269C54.5701 90.8254 54.6906 90.8248 54.8103 90.8248C60.9986 90.8248 67.1831 92.6152 72.6955 96.0025C76.7689 98.5074 80.5282 101.915 83.7646 106.011C87.8736 98.2601 93.5457 89.7102 99.582 82.2495C105.747 74.6298 115.191 64.5166 125.174 59.6085C125.749 59.3253 126.362 59.1816 126.995 59.1816C128.601 59.1816 130.07 60.1363 130.738 61.6137C131.41 63.1013 131.155 64.7898 130.072 66.0201C111.536 87.0784 102.56 109.096 95.621 129.753C94.4602 133.208 91.3749 135.711 87.7612 136.129C87.4024 136.171 87.0377 136.192 86.6771 136.192Z" fill="#E9D2FF" fill-opacity="0.7"/>
            <path d="M98.6387 192.661L70.6693 273.579C69.6941 276.397 65.9099 276.872 64.2695 274.382L48.6173 250.628C47.7205 249.268 46.0208 248.682 44.4761 249.197L17.4976 258.214C14.6695 259.16 11.9859 256.45 12.9594 253.631L39.6106 176.526C40.9672 177.754 42.4492 178.877 44.0896 179.826C49.3454 182.867 55.1355 183.544 60.7361 184.199C63.7558 184.551 66.6083 184.885 69.1822 185.573C71.6046 186.221 74.1523 187.328 76.8515 188.502C81.8321 190.67 87.4796 193.126 93.7766 193.126C95.4431 193.126 97.0645 192.953 98.6387 192.661Z" fill="#E9D2FF" fill-opacity="0.7"/>
            <path d="M155.565 247.621L128.477 238.935C126.925 238.438 125.234 239.046 124.353 240.415L108.993 264.36C107.384 266.871 103.593 266.441 102.585 263.634L90.5967 230.278L104.116 191.167C106.426 190.362 108.622 189.406 110.702 188.502C113.401 187.329 115.949 186.221 118.371 185.573C120.945 184.885 123.797 184.551 126.817 184.199C130.591 183.759 134.45 183.306 138.173 182.127L160.046 242.982C161.054 245.787 158.405 248.532 155.565 247.621Z" fill="#E9D2FF" fill-opacity="0.7"/>
            </svg>
          </div>
      </div>


      <div className="mb-6 border border-[#5B6069] p-8 rounded-xl">
        <div className="flex gap-20 items-center mb-2">
          <h4 className="text-lg text-white font-semibold">Pending Orders</h4>
          <a href="#" className="text-sm text-purple-600 underline">View all</a>
        </div>
        <div className="flex space-x-2 mb-4">
        {['sell', 'buy'].map(type => (
          <button
            key={type}
            onClick={() =>{handleTabSelect(type)}}
            className={`px-4 py-1 rounded-2xl capitalize ${
              selectedTab === type ? 'bg-[#57661F] text-white' : 'bg-[#57661F33] text-[#ADAFB4]'
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
            className="flex flex-col md:flex-row justify-between items-start md:items-center border border-[#5B6069] p-4 rounded-xl"
          >
            <div>
              <p className="font-medium flex items-center gap-2 text-[#ADAFB4]">Order #{order._id} </p> 
              <p className="font-medium flex items-center gap-2 text-[#ADAFB4]">{order.user.fullName} | {order.user.phoneNumber}
                <Copy
                  className="w-4 h-4 cursor-pointer text-gray-500 hover:text-black"
                  onClick={() => handleCopy(order.user.phoneNumber)}
                />
              </p>
              {order.paymentMethod === 'bank' ?<> <p className="text-sm text-[#EBEBEC]">Bank transfer {selectedTab === 'sell' && <span>• {order.bankName}</span>}</p>
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
              <p className="font-semibold text-[#D6D7DA] md:mb-16">{order.amount.toLocaleString()}</p>
            <div className="mt-2 md:mt-0 flex items-center gap-4">
              {order.status === 'pending' && (
                <button onClick={()=>{cancelOrder(order._id)}} className="bg-[#FF596D4D] text-white px-3 py-1 text-sm rounded">Cancel</button>
              )}
            </div>
          </div>
        ))}
      </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-10">
          <div>
            <div className='border border-[#5B6069] rounded-2xl p-8'>
              <h4 className="font-semibold mb-2 text-2xl text-[#EBEBEC]">Recent notifications</h4>
              <div className="space-y-2 text-sm">
                {notifications.length === 0 ? (
                  <p className="text-[#ADAFB4]">No notifications yet.</p>
                ) : (
                  notifications.map((not, i) => (
                    <div key={i} className="border-b border-[#5B6069]">
                      <p className='text-lg text-[#D6D7DA] mb-2'>{not.title}</p>
                      <p className='text-[#D6D7DA] mb-2 w-full'>{not.content}</p>
                      <p className="text-xs text-[#ADAFB4]">
                        {new Date(not.createdAt).toLocaleDateString('en-GB', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        <div className='border border-[#5B6069] rounded-2xl p-8'>
          <h4 className="font-semibold mb-2 text-2xl text-[#EBEBEC]">New announcements</h4>
          <div className="space-y-2 text-sm">
            {[].length === 0 ? (
                  <p className="text-[#ADAFB4]">No announcements yet.</p>
                ) : ( [].map(i => (
              <div key={i} className="border-b border-[#5B6069] p-3 ">
                <p className='text-white'>Earn More with Our New Referral Boost!</p>
                <p className="text-xs text-gray-500">April 20, 2025 11:00am</p>
              </div>
            )))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage