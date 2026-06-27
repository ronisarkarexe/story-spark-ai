import React from "react";
import PricingComponent from "./pricing.component";

// This component is a lightweight wrapper for the real Pricing component.
// It currently self-imports, which breaks bundling.
const PricingMainComponent = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Pricing</h1>
    </div>
  );
};

export default PricingMainComponent;

