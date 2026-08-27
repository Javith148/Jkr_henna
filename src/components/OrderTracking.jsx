import React, { useState } from 'react';
import { Package, Search, Truck, CheckCircle2, Clock, MapPin, Phone } from 'lucide-react';

export default function OrderTracking({ orders }) {
  const [searchId, setSearchId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearched(true);
    const found = orders.find(o => o.id.toLowerCase() === searchId.trim().toLowerCase());
    setTrackedOrder(found || null);
  };

  const statusSteps = ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

  const getStepIndex = (status) => {
    const idx = statusSteps.indexOf(status);
    return idx === -1 ? 1 : idx;
  };

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 font-sans">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
          Live Order Status
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3b0910]">
          Track Your Henna Order
        </h1>
        <p className="text-gray-600 text-xs sm:text-sm max-w-lg mx-auto">
          Enter your JKR Order ID (e.g. JKR-8942) sent via SMS or email to view real-time delivery progress.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            required
            placeholder="Enter Order ID (e.g. JKR-8942)..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm border border-gray-300 rounded-xl focus:border-[#3b0910] focus:outline-none"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-[#3b0910] text-[#f3e5ab] font-bold text-xs sm:text-sm rounded-xl hover:bg-[#2b050a] shadow transition"
        >
          Track Order
        </button>
      </form>

      {/* Tracking Result Display */}
      {searched && !trackedOrder && (
        <div className="bg-white p-8 rounded-3xl border border-gray-200 text-center space-y-2">
          <p className="text-rose-600 font-bold text-sm">Order ID "{searchId}" not found.</p>
          <p className="text-gray-500 text-xs">Please double check your Order ID or view your recent orders in Customer Account.</p>
        </div>
      )}

      {trackedOrder && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-2">
            <div>
              <span className="font-mono text-xs text-gray-400 uppercase">Order ID</span>
              <h2 className="font-mono text-xl font-bold text-[#3b0910]">{trackedOrder.id}</h2>
            </div>
            <div className="sm:text-right">
              <span className="text-xs text-gray-500">Current Status:</span>
              <span className="ml-2 inline-block px-3 py-1 bg-amber-100 text-amber-900 font-bold text-xs rounded-full border border-amber-300">
                {trackedOrder.status}
              </span>
            </div>
          </div>

          {/* Stepper Visual */}
          <div className="py-4">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
              <div 
                className="absolute top-1/2 left-0 h-1 bg-amber-500 -translate-y-1/2 z-0 transition-all duration-500"
                style={{ width: `${(getStepIndex(trackedOrder.status) / (statusSteps.length - 1)) * 100}%` }}
              ></div>

              {statusSteps.map((step, idx) => {
                const isCompleted = idx <= getStepIndex(trackedOrder.status);
                return (
                  <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition ${
                      isCompleted ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>
                    <span className={`text-[10px] sm:text-xs font-semibold max-w-[70px] text-center ${
                      isCompleted ? 'text-[#3b0910] font-bold' : 'text-gray-400'
                    }`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs">
            <div className="space-y-1">
              <p className="text-gray-500 font-bold">Recipient Customer:</p>
              <p className="font-semibold text-gray-900">{trackedOrder.customerName} ({trackedOrder.phone})</p>
              <p className="text-gray-600 font-medium flex items-center gap-1 mt-1"><MapPin className="w-3.5 h-3.5 text-gray-400" /> {trackedOrder.address}</p>
            </div>
            <div className="space-y-1">
              <p className="text-gray-500 font-bold">Courier & Delivery:</p>
              <p className="font-semibold text-gray-900">{trackedOrder.courier || 'ST Courier Express'}</p>
              <p className="text-amber-800 font-bold flex items-center gap-1 mt-1"><Clock className="w-3.5 h-3.5" /> Estimated Delivery: {trackedOrder.estimatedDelivery || '2-3 Days'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
