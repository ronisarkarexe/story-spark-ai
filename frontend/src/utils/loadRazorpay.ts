// Dynamically loads the Razorpay checkout script into the DOM
// Returns true if loaded successfully, false if it fails
export const loadRazorpayScript = (): Promise<boolean> => {
  if (typeof window === "undefined") {
    return Promise.resolve(false);
  }

  return new Promise((resolve) => {
    // Guard against SSR environments (Next.js, Remix, etc.)
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    // Avoid loading the script twice if it already exists
    if (document.getElementById("razorpay-script")) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};
