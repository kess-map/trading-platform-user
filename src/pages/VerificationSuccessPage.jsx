import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const VerificationSuccessPage = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/login", {replace: true})
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-8 sm:p-10 rounded-2xl text-center w-full max-w-md"
      >
        <div className="flex justify-center mb-6">
          <img
            src="https://em-content.zobj.net/thumbs/240/apple/354/party-popper_1f389.png"
            alt="Success Emoji"
            className="w-16 h-16"
          />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-[#0A0D03] mb-2">
          Email verification successful!
        </h1>
        <p className="text-[#0A0D03] mb-6 text-sm sm:text-base">
          Go maximize your earnings
        </p>

        <button
          onClick={handleContinue}
          className="bg-[#CAEB4B] text-black font-normal py-3 px-6 rounded-xl transition duration-200"
        >
          Let's go!
        </button>
      </motion.div>
    </div>
  );
};

export default VerificationSuccessPage;