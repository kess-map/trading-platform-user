import React, { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import {useAuthStore} from '../store/authStore'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast';
import axiosInstance from '../utils/axios'
import {useNavigate} from 'react-router-dom'

const tabs = ['Verification', 'Profile', 'Security'];

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('Verification');
  const {user} = useAuthStore()

  if(!user) return <LoadingSpinner/>

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#D6D7DA]">Settings</h1>

      <div className="flex space-x-6 border-b border-gray-700 pb-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-medium ${
              activeTab === tab ? 'border-b-2 border-[#EBEBEC] text-[#EBEBEC]' : 'text-[#D6D7DA]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-black rounded-lg w-full">
        {activeTab === 'Verification' && <VerificationTab />}
        {activeTab === 'Profile' && <ProfileTab />}
        {activeTab === 'Security' && <SecurityTab />}
        {/* {activeTab === 'Notifications' && <NotificationsTab />} */}
      </div>
    </div>
  );
};

const VerificationTab = () => {
    const {user, uploadIdVerification} = useAuthStore()
    const [selectedCountry, setSelectedCountry] = useState('');
    const [showVerificationTypes, setShowVerificationTypes] = useState(false);
    const [verificationType, setVerificationType] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [frontImage, setFrontImage] = useState(null);
    const [backImage, setBackImage] = useState(null);
    const [frontPreview, setFrontPreview] = useState('');
    const [backPreview, setBackPreview] = useState('');
    const [pendingVerification, setPendingVerification] = useState('');
    const navigate = useNavigate()

    const getPendingRequestVerification = async()=>{
      try {
        const response = await axiosInstance.get(`/settings/pending-verification`)
        setPendingVerification(response.data.data)
      } catch (error) {
        return toast.error(error.response.data.message || 'Error fetching pending verification')
      }
    }

    useEffect(()=>{
      getPendingRequestVerification()
    },[])


    const countryVerificationMap = {
        Ghana: ['Voter ID', 'Ghana Card', 'Driver’s License'],
        Nigeria: ['NIN Slip', 'Voter’s Card', 'International Passport'],
        Kenya: ['National ID', 'Passport'],
    };

    const verificationOptions = countryVerificationMap[selectedCountry] || [];

    const handleContinue = () => {
        if (selectedCountry) {
        setShowVerificationTypes(true);
        setVerificationType('');
        }else{
          toast.error('Select a country')
        }
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (type === 'front') {
              setFrontImage(file);
              setFrontPreview(reader.result);
            } else {
              setBackImage(file);
              setBackPreview(reader.result);
            }
          };
          reader.readAsDataURL(file);
        }
      };
    
      const handleSubmit = async() => {
        if(!selectedCountry || !verificationType || !frontPreview || !backPreview) return toast.error('Fill in all fields')

        await uploadIdVerification({
          country: selectedCountry,
          verificationType, 
          frontImage: frontPreview, 
          backImage: backPreview 
        })
        
        setShowModal(false);
        navigate('/home')
      };
    
  return (
    <div className="flex flex-col items-center text-center space-y-4 bg-black max-w-md mx-auto">
      <h2 className="text-lg font-semibold">{user.fullName}</h2>
      {pendingVerification === true ? <span className={`text-sm px-3 py-1 rounded-full bg-[#FF4C6133] text-[#FF4C61]`}>
        Pending Review
        </span> : <span className={`text-sm px-3 py-1 rounded-full ${user.isDocumentVerified ? 'bg-green-500 text-white' : 'bg-[#FF4C6133] text-[#FF4C61]'}`}>
        {user.isDocumentVerified ? ' Verified' : 'Unverified'}
        </span>}

      {pendingVerification? <div className='flex flex-col justify-center items-center gap-4'>
        <svg width="100" height="111" viewBox="0 0 100 111" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M73.6842 111C66.4035 111 60.1982 108.422 55.0684 103.267C49.9386 98.1117 47.3719 91.8798 47.3684 84.5714C47.3649 77.263 49.9316 71.0312 55.0684 65.8759C60.2052 60.7205 66.4105 58.1429 73.6842 58.1429C80.9579 58.1429 87.1649 60.7205 92.3052 65.8759C97.4456 71.0312 100.011 77.263 100 84.5714C99.9895 91.8798 97.4228 98.1134 92.3 103.272C87.1772 108.431 80.9719 111.007 73.6842 111ZM76.3158 83.5143V71.3571C76.3158 70.6524 76.0526 70.0357 75.5263 69.5071C75 68.9786 74.3859 68.7143 73.6842 68.7143C72.9824 68.7143 72.3684 68.9786 71.8421 69.5071C71.3158 70.0357 71.0526 70.6524 71.0526 71.3571V83.3821C71.0526 84.0869 71.1842 84.7705 71.4474 85.433C71.7105 86.0955 72.1052 86.6892 72.6316 87.2143L80.6579 95.275C81.1842 95.8036 81.7982 96.0678 82.5 96.0678C83.2017 96.0678 83.8158 95.8036 84.3421 95.275C84.8684 94.7464 85.1316 94.1298 85.1316 93.425C85.1316 92.7202 84.8684 92.1036 84.3421 91.575L76.3158 83.5143ZM10.5263 105.714C7.63158 105.714 5.15439 104.68 3.09474 102.612C1.03509 100.543 0.00350877 98.0535 0 95.1429V21.1429C0 18.2357 1.03158 15.7479 3.09474 13.6794C5.15789 11.611 7.63509 10.575 10.5263 10.5714H32.5C33.4649 7.48809 35.3509 4.95624 38.1579 2.97586C40.9649 0.995476 44.0351 0.00352381 47.3684 0C50.8772 0 54.014 0.991952 56.7789 2.97586C59.5438 4.95976 61.407 7.49162 62.3684 10.5714H84.2105C87.1052 10.5714 89.5842 11.6074 91.6473 13.6794C93.7105 15.7514 94.7403 18.2392 94.7368 21.1429V42.2857C94.7368 43.7833 94.2316 45.0396 93.221 46.0544C92.2105 47.0693 90.9614 47.575 89.4737 47.5714C87.9859 47.5679 86.7368 47.0605 85.7263 46.0491C84.7158 45.0378 84.2105 43.7833 84.2105 42.2857V21.1429H73.6842V31.7143C73.6842 33.2119 73.1789 34.4681 72.1684 35.483C71.1579 36.4979 69.9088 37.0035 68.421 37H26.3158C24.8246 37 23.5754 36.4926 22.5684 35.4777C21.5614 34.4629 21.0561 33.2084 21.0526 31.7143V21.1429H10.5263V95.1429H34.2105C35.7017 95.1429 36.9526 95.6503 37.9632 96.6651C38.9737 97.68 39.4772 98.9345 39.4737 100.429C39.4702 101.923 38.9649 103.179 37.9579 104.197C36.9509 105.216 35.7017 105.721 34.2105 105.714H10.5263ZM47.3684 21.1429C48.8596 21.1429 50.1105 20.6354 51.121 19.6206C52.1316 18.6057 52.6351 17.3512 52.6316 15.8571C52.6281 14.363 52.1228 13.1086 51.1158 12.0937C50.1088 11.0789 48.8596 10.5714 47.3684 10.5714C45.8772 10.5714 44.6281 11.0789 43.621 12.0937C42.614 13.1086 42.1088 14.363 42.1053 15.8571C42.1017 17.3512 42.607 18.6075 43.621 19.6259C44.6351 20.6442 45.8842 21.1499 47.3684 21.1429Z" fill="#8C55C1"/>
        </svg>

        <h2 className='text-[#D6D7DA] text-3xl'>Under Review</h2>

        <p className='text-[#D6D7DA]'>Your ID has been submitted for review.</p>
        <p className='text-[#D6D7DA]'>Verification takes 24-48hrs.</p>
      </div> : 
      <><div className="bg-[#57661F4D] text-green-500 p-4 rounded-lg w-full">
        <div className="flex items-center space-x-2 mb-1">
          <CheckCircle className="w-4 h-4" />
          <span className='text-[#57661F]'>Verified users can create up to 10 sell orders</span>
        </div>
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4" />
          <span className='text-[#57661F]'>Earn from referrals</span>
        </div>
      </div>

      <div className="w-full text-left">
        <label className="block text-sm mb-1">Select country to get verified</label>
        <select 
        value={selectedCountry}
        onChange={(e) => {
          setSelectedCountry(e.target.value);
          setShowVerificationTypes(false)}}
        className="w-full bg-black border border-gray-700 rounded px-3 py-2">
          <option value=''>Select Country</option>
          {Object.keys(countryVerificationMap).map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
      </div>

      {!showVerificationTypes && <button onClick={handleContinue} className="w-full mt-2 bg-[#CAEB4B]  text-[#1D2308] py-2 rounded-md flex items-center justify-center font-semibold">
        Continue
      </button>}
      </>}
      {showVerificationTypes && (
        <div className="w-full mt-6 bg-black rounded-lg text-left">
          <p className="text-sm mb-2">Select a verification type:</p>
          <select 
            value={verificationType}
            onChange={(e) => setVerificationType(e.target.value)}
            className="space-y-2 bg-black w-full border border-gray-700 rounded px-3 py-2">
                <option value="">Select</option>
            {verificationOptions.map((option) => (
              <option value={option}>{option}</option>
            ))}
          </select>
          {showVerificationTypes && <button onClick={()=>{if(!verificationType)return toast.error('Select a verification type')
            setShowModal(true)}} className="w-full mt-2 bg-[#CAEB4B]  text-[#1D2308] py-2 rounded-md flex items-center justify-center font-semibold">
          Continue
        </button>}
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-black p-6 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-semibold  text-left text-[#D6D7DA] mb-4">
              Verify using {verificationType}
            </h2>

            <div className="space-y-4 w-full h-full">
              <div className="rounded flex flex-col justify-start">
                <p className="text-sm text-left mb-2">Front View</p>
                {frontPreview ? (<>
                    <img src={frontPreview} alt="Front" className="h-full object-cover rounded-md" />
                    <button onClick={()=>{ setFrontImage(null)
                        setFrontPreview('')}} className='bg-red-500 mx-auto px-4 rounded-md mt-2'>Remove</button>
                </>
                  ): (<label htmlFor="front" className='flex flex-col justify-center items-center border border-[#5B6069] bg-[#57661F80] px-24 py-6 rounded-lg'>
                <svg width="65" height="58" viewBox="0 0 65 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M36.2093 0.757812H14.0405C10.5819 0.757812 7.26503 2.13171 4.81946 4.57728C2.3739 7.02284 1 10.3397 1 13.7983V32.0549C1 33.7674 1.3373 35.4632 1.99265 37.0453C2.64799 38.6274 3.60854 40.065 4.81946 41.2759C7.26503 43.7215 10.5819 45.0954 14.0405 45.0954H36.2093C37.9218 45.0954 39.6175 44.7581 41.1996 44.1028C42.7818 43.4474 44.2193 42.4869 45.4303 41.2759C46.6412 40.065 47.6017 38.6274 48.2571 37.0453C48.9124 35.4632 49.2497 33.7674 49.2497 32.0549V13.7983C49.2497 12.0858 48.9124 10.3901 48.2571 8.80791C47.6017 7.22577 46.6412 5.7882 45.4303 4.57728C44.2193 3.36636 42.7818 2.4058 41.1996 1.75046C39.6175 1.09511 37.9218 0.757812 36.2093 0.757812Z" stroke="#8C55C1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M1.65234 35.9673L8.8246 27.6214C9.7631 26.6893 10.9948 26.11 12.3113 25.9817C13.6278 25.8534 14.9482 26.1839 16.049 26.9172C17.1499 27.6505 18.4702 27.981 19.7867 27.8527C21.1032 27.7243 22.3349 27.1451 23.2734 26.213L29.3503 20.1361C31.0964 18.3841 33.4082 17.3095 35.8732 17.1041C38.3382 16.8987 40.7961 17.5758 42.8081 19.0147L49.3022 24.0483M14.6928 18.154C15.2614 18.154 15.8243 18.042 16.3496 17.8244C16.8749 17.6069 17.3522 17.2879 17.7542 16.8859C18.1562 16.4839 18.4751 16.0066 18.6927 15.4814C18.9103 14.9561 19.0222 14.3931 19.0222 13.8246C19.0222 13.256 18.9103 12.693 18.6927 12.1677C18.4751 11.6425 18.1562 11.1652 17.7542 10.7632C17.3522 10.3612 16.8749 10.0423 16.3496 9.82468C15.8243 9.6071 15.2614 9.49512 14.6928 9.49512C13.5446 9.49512 12.4434 9.95125 11.6314 10.7632C10.8195 11.5751 10.3634 12.6763 10.3634 13.8246C10.3634 14.9728 10.8195 16.074 11.6314 16.8859C12.4434 17.6979 13.5446 18.154 14.6928 18.154Z" stroke="#8C55C1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M50.5091 28.7568C46.6804 28.8033 43.0216 30.3449 40.3141 33.0524C37.6066 35.7599 36.065 39.4187 36.0186 43.2474C36.065 47.0761 37.6066 50.7349 40.3141 53.4424C43.0216 56.1499 46.6804 57.6915 50.5091 57.738C54.3378 57.6915 57.9966 56.1499 60.7041 53.4424C63.4116 50.7349 64.9532 47.0761 64.9997 43.2474C64.9532 39.4187 63.4116 35.7599 60.7041 33.0524C57.9966 30.3449 54.3378 28.8033 50.5091 28.7568ZM58.7894 43.7824C58.7894 44.0586 58.5656 44.2824 58.2894 44.2824H52.0442C51.768 44.2824 51.5442 44.5063 51.5442 44.7824V51.0277C51.5442 51.3039 51.3203 51.5277 51.0442 51.5277H49.9741C49.6979 51.5277 49.4741 51.3039 49.4741 51.0277V44.7824C49.4741 44.5063 49.2502 44.2824 48.9741 44.2824H42.7288C42.4527 44.2824 42.2288 44.0586 42.2288 43.7824V42.7124C42.2288 42.4362 42.4527 42.2124 42.7288 42.2124H48.9741C49.2502 42.2124 49.4741 41.9885 49.4741 41.7124V35.4671C49.4741 35.1909 49.6979 34.9671 49.9741 34.9671H51.0442C51.3203 34.9671 51.5442 35.1909 51.5442 35.4671V41.7124C51.5442 41.9885 51.768 42.2124 52.0442 42.2124H58.2894C58.5656 42.2124 58.7894 42.4362 58.7894 42.7124V43.7824Z" fill="#8C55C1"/>
                    <path d="M58.7894 43.7824C58.7894 44.0586 58.5656 44.2824 58.2894 44.2824H52.0442C51.768 44.2824 51.5442 44.5063 51.5442 44.7824V51.0277C51.5442 51.3039 51.3203 51.5277 51.0442 51.5277H49.9741C49.6979 51.5277 49.4741 51.3039 49.4741 51.0277V44.7824C49.4741 44.5063 49.2502 44.2824 48.9741 44.2824H42.7288C42.4527 44.2824 42.2288 44.0586 42.2288 43.7824V42.7124C42.2288 42.4362 42.4527 42.2124 42.7288 42.2124H48.9741C49.2502 42.2124 49.4741 41.9885 49.4741 41.7124V35.4671C49.4741 35.1909 49.6979 34.9671 49.9741 34.9671H51.0442C51.3203 34.9671 51.5442 35.1909 51.5442 35.4671V41.7124C51.5442 41.9885 51.768 42.2124 52.0442 42.2124H58.2894C58.5656 42.2124 58.7894 42.4362 58.7894 42.7124V43.7824Z" fill="white"/>
                </svg>
                <p className='text-sm text-[#ADAFB4]'>Ensure good lighting, no glare and all details are legible </p>
                <input
                  type="file"
                  id='front'
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'front')}
                  className="w-full mt-2 hidden"
                />
                </label>)}
              </div>

              <div className="rounded flex flex-col justify-start">
                <p className="text-sm text-left mb-2">Back View</p>
                {backPreview ? (<>
                        <img src={backPreview} alt="back" className="h-full object-cover rounded-md" />
                        <button onClick={()=>{ setBackImage(null)
                        setBackPreview('')}} className='bg-red-500 mx-auto px-4 rounded-md mt-2'>Remove</button>
                </>
                  ): (<label htmlFor="back" className='flex flex-col justify-center items-center border border-[#5B6069] bg-[#57661F80] px-24 py-6 rounded-lg'>
                <svg width="65" height="58" viewBox="0 0 65 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M36.2093 0.757812H14.0405C10.5819 0.757812 7.26503 2.13171 4.81946 4.57728C2.3739 7.02284 1 10.3397 1 13.7983V32.0549C1 33.7674 1.3373 35.4632 1.99265 37.0453C2.64799 38.6274 3.60854 40.065 4.81946 41.2759C7.26503 43.7215 10.5819 45.0954 14.0405 45.0954H36.2093C37.9218 45.0954 39.6175 44.7581 41.1996 44.1028C42.7818 43.4474 44.2193 42.4869 45.4303 41.2759C46.6412 40.065 47.6017 38.6274 48.2571 37.0453C48.9124 35.4632 49.2497 33.7674 49.2497 32.0549V13.7983C49.2497 12.0858 48.9124 10.3901 48.2571 8.80791C47.6017 7.22577 46.6412 5.7882 45.4303 4.57728C44.2193 3.36636 42.7818 2.4058 41.1996 1.75046C39.6175 1.09511 37.9218 0.757812 36.2093 0.757812Z" stroke="#8C55C1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M1.65234 35.9673L8.8246 27.6214C9.7631 26.6893 10.9948 26.11 12.3113 25.9817C13.6278 25.8534 14.9482 26.1839 16.049 26.9172C17.1499 27.6505 18.4702 27.981 19.7867 27.8527C21.1032 27.7243 22.3349 27.1451 23.2734 26.213L29.3503 20.1361C31.0964 18.3841 33.4082 17.3095 35.8732 17.1041C38.3382 16.8987 40.7961 17.5758 42.8081 19.0147L49.3022 24.0483M14.6928 18.154C15.2614 18.154 15.8243 18.042 16.3496 17.8244C16.8749 17.6069 17.3522 17.2879 17.7542 16.8859C18.1562 16.4839 18.4751 16.0066 18.6927 15.4814C18.9103 14.9561 19.0222 14.3931 19.0222 13.8246C19.0222 13.256 18.9103 12.693 18.6927 12.1677C18.4751 11.6425 18.1562 11.1652 17.7542 10.7632C17.3522 10.3612 16.8749 10.0423 16.3496 9.82468C15.8243 9.6071 15.2614 9.49512 14.6928 9.49512C13.5446 9.49512 12.4434 9.95125 11.6314 10.7632C10.8195 11.5751 10.3634 12.6763 10.3634 13.8246C10.3634 14.9728 10.8195 16.074 11.6314 16.8859C12.4434 17.6979 13.5446 18.154 14.6928 18.154Z" stroke="#8C55C1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M50.5091 28.7568C46.6804 28.8033 43.0216 30.3449 40.3141 33.0524C37.6066 35.7599 36.065 39.4187 36.0186 43.2474C36.065 47.0761 37.6066 50.7349 40.3141 53.4424C43.0216 56.1499 46.6804 57.6915 50.5091 57.738C54.3378 57.6915 57.9966 56.1499 60.7041 53.4424C63.4116 50.7349 64.9532 47.0761 64.9997 43.2474C64.9532 39.4187 63.4116 35.7599 60.7041 33.0524C57.9966 30.3449 54.3378 28.8033 50.5091 28.7568ZM58.7894 43.7824C58.7894 44.0586 58.5656 44.2824 58.2894 44.2824H52.0442C51.768 44.2824 51.5442 44.5063 51.5442 44.7824V51.0277C51.5442 51.3039 51.3203 51.5277 51.0442 51.5277H49.9741C49.6979 51.5277 49.4741 51.3039 49.4741 51.0277V44.7824C49.4741 44.5063 49.2502 44.2824 48.9741 44.2824H42.7288C42.4527 44.2824 42.2288 44.0586 42.2288 43.7824V42.7124C42.2288 42.4362 42.4527 42.2124 42.7288 42.2124H48.9741C49.2502 42.2124 49.4741 41.9885 49.4741 41.7124V35.4671C49.4741 35.1909 49.6979 34.9671 49.9741 34.9671H51.0442C51.3203 34.9671 51.5442 35.1909 51.5442 35.4671V41.7124C51.5442 41.9885 51.768 42.2124 52.0442 42.2124H58.2894C58.5656 42.2124 58.7894 42.4362 58.7894 42.7124V43.7824Z" fill="#8C55C1"/>
                    <path d="M58.7894 43.7824C58.7894 44.0586 58.5656 44.2824 58.2894 44.2824H52.0442C51.768 44.2824 51.5442 44.5063 51.5442 44.7824V51.0277C51.5442 51.3039 51.3203 51.5277 51.0442 51.5277H49.9741C49.6979 51.5277 49.4741 51.3039 49.4741 51.0277V44.7824C49.4741 44.5063 49.2502 44.2824 48.9741 44.2824H42.7288C42.4527 44.2824 42.2288 44.0586 42.2288 43.7824V42.7124C42.2288 42.4362 42.4527 42.2124 42.7288 42.2124H48.9741C49.2502 42.2124 49.4741 41.9885 49.4741 41.7124V35.4671C49.4741 35.1909 49.6979 34.9671 49.9741 34.9671H51.0442C51.3203 34.9671 51.5442 35.1909 51.5442 35.4671V41.7124C51.5442 41.9885 51.768 42.2124 52.0442 42.2124H58.2894C58.5656 42.2124 58.7894 42.4362 58.7894 42.7124V43.7824Z" fill="white"/>
                </svg>
                <p className='text-sm text-[#ADAFB4]'>Ensure good lighting, no glare and all details are legible </p>
                <input
                  type="file"
                  id='back'
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'back')}
                  className="w-full mt-2 hidden"
                />
                </label>)}
              </div>
            </div>

            <div className="mt-4 flex justify-center space-x-4">
              <button
                onClick={handleSubmit}
                className="bg-[#CAEB4B] text-[#1D2308] py-2 px-10 rounded-md"
              >
                Submit
              </button>
              <button
                onClick={() => {setShowModal(false)
                    setBackPreview('')
                    setFrontPreview('')
                }}
                className="bg-red-500 text-white py-2 px-10 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProfileTab = () => {
  const {user, requestProfileUpdate} = useAuthStore()
  const [editProfile, setEditProfile] = useState(false)
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [country, setCountry] = useState('')

  useEffect(()=>{
    if(user){
      setFullName(user.fullName)
      setUsername(user.username)
      setEmail(user.email)
      setPhoneNumber(user.phoneNumber)
      setCountry(user.country)
    }
  },[user])

  const handleSubmit = async()=>{
    if(fullName === user.fullName &&
      username === user.username &&
      email === user.email &&
      phoneNumber === user.phoneNumber &&
      country === user.country
    ) return toast.error('No changes detected')

    await requestProfileUpdate({fullName, username, email, phoneNumber, country})
    setEditProfile(false)
  }

  if(!user) return <LoadingSpinner/>
  return(
    <>
  {!editProfile ? <div className="flex flex-col gap-4">
    <div className='flex flex-col gap-4 mb-4'>
      <div className='flex justify-between'>
        <p className='text-[#ADAFB4]'>Verification status</p>
        <div className={`rounded-md p-1/2 ${user.isDocumentVerified ? 'bg-[#0CBC741A]' : 'bg-red-500'}`}><p className={`${user.isDocumentVerified ? 'text-[#0CBC74]' : 'text-white'}`}>{user.isDocumentVerified ? 'Verified' : 'Unverified'}</p></div>
      </div>
      <div className='flex justify-between'>
        <p className='text-[#ADAFB4]'>Full Name</p>
        <p className='text-[#D6D7DA]'>{user.fullName}</p>
      </div>
      <div className='flex justify-between'>
        <p className='text-[#ADAFB4]'>Username</p>
        <p className='text-[#D6D7DA]'>{user.username}</p>
      </div>
      <div className='flex justify-between'>
        <p className='text-[#ADAFB4]'>Email</p>
        <p className='text-[#D6D7DA]'>{user.email}</p>
      </div>
      <div className='flex justify-between'>
        <p className='text-[#ADAFB4]'>Phone Number</p>
        <p className='text-[#D6D7DA]'>{user.phoneNumber}</p>
      </div>
      <div className='flex justify-between'>
        <p className='text-[#ADAFB4]'>Country</p>
        <p className='text-[#D6D7DA]'>{user.country}</p>
      </div>
    </div>
    <div className='flex justify-center'>
    <button onClick={()=>setEditProfile(true)} className='bg-[#CAEB4B] text-[#1D2308] py-3 rounded-lg px-36'>Edit Profile</button>
    </div>
  </div> : 
  <div className='flex flex-col'>
    <div className='flex items-center gap-12 mb-4'>
      <svg onClick={()=>setEditProfile(false)} width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="20" fill="#EEDDFF"/>
      <path d="M10 20H30M10 20L15.7143 26M10 20L15.7143 14" stroke="#8C55C1" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <p className=' text-xl text-[#D6D7DA]'>Edit Profile</p>
    </div>
    <div className='flex flex-col'>
    <div className='flex justify-between gap-4'>
        <div className='flex flex-col w-1/2'>
        <label className='text-[#ADAFB4] mb-2'>Full Name</label>
        <input type='text' value={fullName} onChange={(e)=>setFullName(e.target.value)} className="w-full bg-black border border-gray-700 rounded px-3 py-2 mb-2"/>
        </div>
        <div className='flex flex-col w-1/2'>
        <label className='text-[#ADAFB4] mb-2'>User name</label>
        <input type='text' value={username} onChange={(e)=>setUsername(e.target.value)} className="w-full bg-black border border-gray-700 rounded px-3 py-2 mb-2"/>
        </div>
      </div>
      <div className='flex justify-between gap-4'>
        <div className='flex flex-col w-1/2'>
        <label className='text-[#ADAFB4] mb-2'>Email</label>
        <input type='text' value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full bg-black border border-gray-700 rounded px-3 py-2 mb-2"/>
        </div>
        <div className='flex flex-col w-1/2'>
        <label className='text-[#ADAFB4] mb-2'>Phone Number</label>
        <input type='text' value={phoneNumber} onChange={(e)=>setPhoneNumber(e.target.value)} className="w-full bg-black border border-gray-700 rounded px-3 py-2 mb-2"/>
        </div>
      </div>
      <div className='flex flex-col gap-2 mb-10'>
        <label className='text-[#ADAFB4]'>Country</label>
        <select value={country} onChange={(e)=>setCountry(e.target.value)} className="w-full bg-black border border-gray-700 rounded px-3 py-2">
          <option value="">Select Country</option>
          <option value="Nigeria">Nigeria</option>
          <option value="Ghana">Ghana</option>
          <option value="Kenya">Kenya</option>
        </select>
      </div>
    </div>
    <div className='flex justify-center gap-4'>
      <button onClick={()=>setEditProfile(false)} className='bg-black border border-[#57661F] text-[#57661F] px-6 py-2 rounded-md'>Cancel</button>
      <button onClick={handleSubmit} className='bg-[#CAEB4B] text-[#1D2308] px-6 py-2 rounded-md text-sm'>Save Changes</button>
    </div>
  </div>}
  </>
)
};

const SecurityTab = () => {
  const [changingPassword, setChangingPassword] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const {changePassword} = useAuthStore()

  const handleSubmit = async(e)=>{
    e.preventDefault()
    if(!oldPassword || !newPassword) return toast.error('Fill in all fields')
    await changePassword({oldPassword, newPassword})
    setChangingPassword(false)
  }
return(
  <>
  {changingPassword ? (
    <div className='flex flex-col'>
    <div className='flex items-center gap-12 mb-4'>
      <svg onClick={()=>setChangingPassword(false)} width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="20" fill="#EEDDFF"/>
      <path d="M10 20H30M10 20L15.7143 26M10 20L15.7143 14" stroke="#8C55C1" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <p className=' text-xl text-[#D6D7DA]'>Change Password</p>
    </div>
    <div className='flex flex-col gap-4 mt-4 mb-4'>
    <div className='flex justify-between gap-4'>
        <div className='flex flex-col w-1/3'>
        <label className='text-[#ADAFB4] mb-2'>Old Password</label>
        <input type='text' value={oldPassword} onChange={(e)=>setOldPassword(e.target.value)} placeholder='********' className="w-full bg-black border border-gray-700 rounded px-3 py-2 mb-2"/>
        </div>
      </div>
      <div className='flex justify-between gap-4'>
        <div className='flex flex-col w-1/3'>
        <label className='text-[#ADAFB4] mb-2'>New Password</label>
        <input type='text' value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} placeholder='********' className="w-full bg-black border border-gray-700 rounded px-3 py-2 mb-2"/>
        </div>
      </div>
    </div>
    <div className='flex justify-start gap-9'>
      <button onClick={()=>{setChangingPassword(false)}} className='bg-black border border-[#57661F] text-[#57661F] px-16 py-2 rounded-md'>Cancel</button>
      <button onClick={handleSubmit} className='bg-[#CAEB4B] text-[#1D2308] px-16 py-2 rounded-md text-sm'>Save Password</button>
    </div>
  </div>) : 
    (<div className='flex flex-col gap-4'>
    <div className='flex items-center justify-between p-3 border border-[#282D36] rounded-lg'>
      <p className='text-[#D6D7DA]'>Password Management</p>
      <button onClick={()=>{setChangingPassword(true)}} className='bg-[#CAEB4B] text-[#1D2308] px-3 py-2 rounded-md'>Change Password</button>
    </div>
    {/* <div className='flex flex-col p-3 border border-[#282D36] rounded-lg'>
      <div className='flex items-center gap-4 mb-2'>
        <p className='text-[#D6D7DA]'>Two-factor authentication</p>
        <div className='border border-[#FF4C61] rounded-md p-1'>
          <p className='text-xs text-[#FF4C61]'>Disabled</p>
        </div>
      </div>
      <p className='text-[#ADAFB4] text-sm'>Add extra layer of security to your account.</p>
      <div className='flex justify-between items-center'>
        <div className='flex items-center'>
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.75" y="0.75" width="28.5" height="28.5" rx="14.25" stroke="#8C55C1" stroke-width="1.5"/>
        <rect x="4" y="4" width="22" height="22" rx="11" fill="#8C55C1"/>
        </svg>
        <p className='text-[#D6D7DA] ml-3'>SMS</p>
        </div>
        <button className='bg-[#CAEB4B] text-[#1D2308] px-12 py-2 rounded-md'>Enable</button>
      </div>

    </div> */}
  </div>)}
  </>
)};
// const NotificationsTab = () => <div className="text-center">Notifications settings go here.</div>;

export default SettingsPage;