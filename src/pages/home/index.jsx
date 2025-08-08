import { useState } from 'react';
import { FaRocket } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');



  const handleGetStarted = () => {
    // if (!selected) {
    //   setError('Please select one of the options above.');
    //   return;
    // }

    // setError('');
    // const selectedOption = options.find((opt) => opt.label === selected);
    // if (selectedOption?.path) {
    //   navigate(selectedOption.path);
    // }
    navigate("/initial-questions")
  };

  const handleSelect = (label) => {
    setSelected(label);
    setError('');
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col justify-center items-center px-4 text-center transition-all duration-500">
      <div className="text-white font-extrabold text-4xl mb-3">
        Do you want to assess the maturity of your platform?
      </div>

      <div className="text-sky-400 text-base font-medium mb-6 animate-pulse">
        Based on the NIST Cybersecurity Framework (CSF)
      </div>

      <div className="text-gray-400 text-lg mb-10 max-w-2xl">
        Quickly evaluate how secure your infrastructure is — identify strengths and weaknesses with a few quick questions.
      </div>

     
      

      {/* START BUTTON */}
      <div className="relative group mb-6">
        <div className="absolute inset-0 rounded-2xl bg-sky-500 opacity-20 blur-xl animate-pulse group-hover:opacity-30 transition-all duration-500" />
        <button
          onClick={handleGetStarted}
          className="relative group inline-flex items-center justify-center px-10 py-4 overflow-hidden font-semibold text-gray-100 transition-all duration-500 ease-in-out rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 hover:scale-105 cursor-pointer"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
          <span className="relative z-10 flex items-center text-xl gap-3">
            <FaRocket className="text-xl group-hover:rotate-12 transition-transform duration-300" />
            Get Started
          </span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-400 text-sm mt-2 mb-4">{error}</div>
      )}

      {/* Trusted By Section */}
      <div className="text-gray-500 text-sm mb-2">Trusted by teams securing:</div>
      <div className="flex gap-6 opacity-50 grayscale">
        <div className="w-20 h-6 bg-white/10 rounded-sm" />
        <div className="w-20 h-6 bg-white/10 rounded-sm" />
        <div className="w-20 h-6 bg-white/10 rounded-sm" />
      </div>
    </div>
  );
};

export default HomePage;
