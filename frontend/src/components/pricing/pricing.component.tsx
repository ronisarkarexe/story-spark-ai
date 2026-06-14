import React from "react";
import PricingComponent from "../home/pricing/pricing.component";
import { useEffect } from "react";

const PricingMainComponent = () => {
  useEffect(() => { document.title = "StorySparkAI | Pricing"; }, []);
  return (
    <div>
      <PricingComponent />
    </div>
  );
};

export default PricingMainComponent;
