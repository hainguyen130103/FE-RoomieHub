import React from "react";
import SidebarNav from "../layouts/SidebarNav";

const packages = [
  {
    title: "Basic package",
    price: "20,000 VND/month",
    description: "For real estate brokers with small portfolios",
    features: [
      "20 listings - 15 days visibility",
      "Up to 30 listings visibility",
      "Upgrade to Featured listings - multiple images",
    ],
    icon: "🏠",
  },
  {
    title: "Professional Package",
    price: "55,000 VND/month",
    description: "For professional real estate brokers with large portfolios",
    features: [
      "50 listings - 15 days visibility",
      "Unlimited listings",
      "Posting performance reports",
      "Add new contact channels",
      "Lead management tools",
      "Upgrade offer to Featured listings - multiple images",
    ],
    icon: "🏢",
  },
  {
    title: "VIP Package",
    price: "90,000 VND/month",
    description:
      "Complete solution, comprehensive benefits for professional real estate brokers",
    features: [
      "60 listings - 15 days visibility",
      "Unlimited listings",
      "Posting performance reports",
      "Add new contact channels",
      "Lead management tools",
      "Upgrade offer to Featured listings - multiple images",
      "Quickly browse listings in under 5 minutes",
    ],
    icon: "🏬",
  },
];

const Package = () => {
  return (
    <SidebarNav>
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="py-10 bg-gray-50 text-center">
            <h2 className="text-2xl font-semibold mb-10">
              Multiple package options to suit your needs
            </h2>
            <div className="flex flex-col lg:flex-row justify-center items-center gap-6 px-4 lg:px-0">
              {packages.map((pkg, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md p-6 w-full max-w-sm border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="text-4xl mb-2">{pkg.icon}</div>
                  <h3 className="text-xl font-bold">{pkg.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>
                  <p className="text-gray-400 italic text-sm mb-4">Only</p>
                  <p className="text-lg font-semibold mb-4">{pkg.price}</p>
                  <button className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition-colors mb-4">
                    Buy now
                  </button>
                  <ul className="text-sm text-left list-disc list-inside text-gray-700 space-y-1">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SidebarNav>
  );
};

export default Package;
