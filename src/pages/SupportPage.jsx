import React from 'react';
import { useState } from 'react';

const SupportPage = () => {
  const [copied, setCopied] = useState(false);
  const whatsappNumber = '+2348103205460';

  const handleCopy = () => {
    navigator.clipboard.writeText(whatsappNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white px-4">
      <div className="flex flex-col items-center space-y-6">
        {/* WhatsApp Logo */}
        <svg
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          className="text-green-500"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            d="M12.04 2C6.51 2 2.05 6.45 2.05 11.97c0 2.11.61 4.07 1.68 5.72L2 22l4.45-1.61c1.56.86 3.36 1.34 5.59 1.34 5.53 0 10-4.45 10-9.98C22 6.45 17.56 2 12.04 2zm.1 17.47c-1.87 0-3.61-.54-5.07-1.47l-.36-.22-2.64.95.91-2.57-.24-.39a8.39 8.39 0 0 1-1.31-4.57c0-4.65 3.79-8.42 8.45-8.42 4.66 0 8.45 3.77 8.45 8.42s-3.79 8.42-8.45 8.42zm4.68-6.3c-.26-.13-1.53-.75-1.76-.84-.24-.1-.42-.13-.6.13-.18.26-.69.84-.85 1.01-.16.18-.31.2-.57.07-.26-.13-1.08-.4-2.06-1.28-.76-.67-1.28-1.5-1.43-1.75-.15-.26-.02-.4.11-.53.11-.11.26-.3.4-.45.13-.15.18-.26.26-.43.08-.17.04-.32-.02-.45-.07-.13-.6-1.45-.82-1.99-.22-.53-.44-.46-.6-.46-.16 0-.34-.01-.52-.01-.17 0-.45.06-.69.32-.24.26-.91.89-.91 2.17 0 1.28.93 2.51 1.06 2.68.13.17 1.83 2.9 4.43 4.06 2.61 1.16 2.61.77 3.08.72.47-.05 1.53-.62 1.75-1.22.22-.6.22-1.12.15-1.22-.07-.1-.24-.16-.5-.28z"
          />
        </svg>

        {/* Message */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-[#323844]">Need Help?</h2>
          <p className="text-[#84888F]">Contact us directly via WhatsApp:</p>
          <p className="text-xl font-bold text-green-400">{whatsappNumber}</p>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="mt-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition"
        >
          Copy WhatsApp Number
        </button>

        {/* Toast Message */}
        {copied && (
          <p className="text-sm text-green-400 mt-2 animate-pulse">Number copied to clipboard!</p>
        )}
      </div>
    </div>
  );
};

export default SupportPage;
