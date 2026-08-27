import React from 'react';
import { Leaf, ShieldCheck, Truck, Award, CheckCircle2 } from 'lucide-react';

export default function WhyChooseUs() {
  const features = [
    {
      icon: Leaf,
      title: "Fresh Henna Paste",
      subtitle: "Made Fresh Weekly",
      description: "Our henna cones are hand-rolled and freshly prepared every single week using 100% natural leaf powder and premium essential oils.",
      iconBg: "bg-amber-50 text-amber-800 border-amber-200",
    },
    {
      icon: ShieldCheck,
      title: "100% Chemical-Free",
      subtitle: "Zero PPD & Harmful Dyes",
      description: "Safe for kids, pregnant mothers, and sensitive skin. Pure Lawsonia Inermis mixed only with lavender, eucalyptus, and cajeput oils.",
      iconBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
    {
      icon: Truck,
      title: "Fast & Secure Delivery",
      subtitle: "Leak-Proof Packaging",
      description: "Packed with special cold insulation film to keep henna fresh during transit. Quick delivery across all cities in India.",
      iconBg: "bg-blue-50 text-blue-800 border-blue-200",
    },
    {
      icon: Award,
      title: "Quality Checked Flow",
      subtitle: "Smooth Fine Tips",
      description: "Every single cone is hand-tested for smooth stringy paste texture and clog-free pin-point tip flow before dispatch.",
      iconBg: "bg-purple-50 text-purple-800 border-purple-200",
    }
  ];

  return (
    <section className="py-16 bg-white border-b border-gray-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
            The JKR Henna Standard
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#3b0910]">
            Why Choose JKR Henna Cones?
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            We don't compromise on purity. Experience authentic traditional color that stays rich, dark, and safe.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl border ${item.iconBg} flex items-center justify-center mb-4 group-hover:scale-105 transition duration-200`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#3b0910] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs font-semibold text-gray-500 mb-2.5">
                    {item.subtitle}
                  </p>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
