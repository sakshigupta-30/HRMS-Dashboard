import React from 'react';

const ProfileCard = () => {
  return (
    <div className="flex flex-col items-center gap-4 w-[220px] bg-emerald-500 text-white rounded-2xl p-6 text-center shadow-md">
      
      <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full text-emerald-500 text-4xl font-bold">
        👤
      </div>

      <div>
        <h3 className="text-xl m-0">April 2024</h3>
        <p className="text-sm text-emerald-100 m-0">July 2024</p>
      </div>

      <h2 className="text-3xl font-bold">₹50,000</h2>

      <button className="bg-white text-emerald-500 font-semibold py-2 px-5 rounded-lg cursor-pointer transition-colors hover:bg-emerald-100">
        View
      </button>

    </div>
  );
};

export default ProfileCard;