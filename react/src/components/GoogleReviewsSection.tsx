import { useEffect } from "react";

const ELFSIGHT_APP_CLASS = "elfsight-app-402ccb84-5c20-4877-9afd-70877cb72277";

export default function GoogleReviewsSection() {
  useEffect(() => {
    if (document.querySelector('script[src="https://elfsightcdn.com/platform.js"]')) {
      return;
    }
    const script = document.createElement("script");
    script.src = "https://elfsightcdn.com/platform.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <section
      className="w-full max-w-[1920px] bg-white pt-16 pb-10 sm:pt-20 sm:pb-12 lg:pt-20 lg:pb-12 px-4 sm:px-6 lg:px-0"
      aria-labelledby="google-reviews-heading"
    >
      <div className="text-center section-px max-w-2xl mx-auto lg:max-w-none">
        <h2
          id="google-reviews-heading"
          className="font-['Poppins',_sans-serif] font-[600] text-2xl sm:text-3xl lg:text-4xl xl:text-[51px] xl:leading-[62px] text-black"
        >
          Ce que nos clients disent de nous !
        </h2>
      </div>
      <div className="mt-6 lg:mt-8 flex justify-center">
        <div className={`${ELFSIGHT_APP_CLASS} w-full max-w-full`} data-elfsight-app-lazy />
      </div>
    </section>
  );
}
