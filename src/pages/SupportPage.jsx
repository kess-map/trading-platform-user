import React, { useState } from 'react';

const SupportPage = () => {
  const [copied, setCopied] = useState(false);
  const supportEmail = 'support@yourdomain.zoho.com'; // Replace with your actual Zoho email

  const handleCopy = () => {
    navigator.clipboard.writeText(supportEmail).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-gray-900 px-4">
      <div className="flex flex-col items-center space-y-6">
        {/* Email Icon */}
        <svg
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          className="text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4
              c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v.01L12 13l8-6.99V6l-8 6L4 6z"
          />
        </svg>

        {/* Message */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold">Need Help?</h2>
          <p className="text-gray-600">Reach out to us via email:</p>
          <p className="text-xl font-bold text-blue-500">{supportEmail}</p>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full transition"
        >
          Copy Email Address
        </button>

        {/* Toast Message */}
        {copied && (
          <p className="text-sm text-blue-500 mt-2 animate-pulse">Email copied to clipboard!</p>
        )}
      </div>
    </div>
  );
};

export default SupportPage;