import { useEffect } from "react";

export type FaqSchemaItem = {
  question: string;
  answer: string;
};

const SCRIPT_ID = "faq-page-jsonld";

export function useFaqPageSchema(items: readonly FaqSchemaItem[]) {
  useEffect(() => {
    const payload = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    };

    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(payload);

    return () => {
      document.getElementById(SCRIPT_ID)?.remove();
    };
  }, [items]);
}
