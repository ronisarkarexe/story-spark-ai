"use client";
import React from "react";

const ProductHuntBadge = () => {
  return (
    <a
    className="border dark:border-white border-black rounded-xl"
      href="https://www.producthunt.com/products/dsa-visualizer?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-dsa&#0045;visualizer"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src={`https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=974127&theme=dark&t=1749182745821`}
        alt="DSA&#0032;Visualizer - Visualize&#0032;&#0038;&#0032;learn&#0032;dsa&#0032;the&#0032;smart&#0032;way | Product Hunt"
        style={{ width: 250, height: 54 }}
        width="250"
        height="54"
      />
    </a>
  );
};

export default ProductHuntBadge;