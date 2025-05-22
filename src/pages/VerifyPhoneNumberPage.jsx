import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Loader } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

const VerifyPhoneNumberPage = () => {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef([])
  const navigate = useNavigate()
  const { error, isLoading, verifyPhoneNumber, resendVerificationMessage, user } = useAuthStore()

  const handleChange = (index, value) => {
    const newCode = [...code]

    if (value.length > 1) {
      const pasted = value.slice(0, 6).split('')
      pasted.forEach((char, idx) => {
        if (idx < 6) newCode[idx] = char
      })
      setCode(newCode)
      if (pasted.length === 6) {
        handleSubmit(new Event('submit'))
      }
    } else {
      newCode[index] = value
      setCode(newCode)
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus()
      }
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const verificationCode = code.join('')
    try {
      const res = await verifyPhoneNumber(user.email, verificationCode)
      if(res.status === 200){
        navigate('/verify-success')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleResendVerificationMessage = async () => {
    await resendVerificationMessage(user.email)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-black border border-zinc-700 p-8 sm:p-10 rounded-2xl shadow-2xl"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-white">
          Verify Email
        </h2>
        <p className="text-center text-white mb-6 text-sm sm:text-base">
          Enter the 6-digit code sent to your email
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2 sm:gap-3">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-10 h-10 sm:w-12 sm:h-12 text-center text-white text-xl sm:text-2xl font-bold  bg-zinc-900 border border-zinc-600 rounded-md focus:ring-2 focus:ring-lime-500 focus:outline-none"
              />
            ))}
          </div>

          {error && (
            <p className="text-red-500 font-semibold text-center text-sm sm:text-base">{error}</p>
          )}

          <motion.button
            type="submit"
            disabled={isLoading || code.some((digit) => !digit)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-5 w-full py-3 px-4 bg-lime-600 hover:bg-lime-700 text-white font-bold rounded-lg shadow-md transition duration-200 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin text-center mx-auto" />
            ) : (
              'Submit'
            )}
          </motion.button>
            <button
              type="button"
              disabled={isLoading}
              onClick={handleResendVerificationMessage}
              className="text-purple-700 font-semibold"
            >
              Resend OTP
            </button>
        </form>
      </motion.div>
    </div>
  )
}

export default VerifyPhoneNumberPage