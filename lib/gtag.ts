export const GA_MEASUREMENT_ID = "G-2NCNWVFL7M";

declare global {
  interface Window {
    gtag: any;
  }
}

export const gtag = (...args: any[]) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag(...args);
  }
};
