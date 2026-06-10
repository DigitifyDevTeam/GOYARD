import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Minus, Plus } from "lucide-react";
import { useFaqPageSchema, type FaqSchemaItem } from "../../hooks/useFaqPageSchema";

type DestinationFaqSectionProps = Readonly<{
  title: string;
  subtitle?: string;
  items: readonly FaqSchemaItem[];
  className?: string;
}>;

/** Accordion FAQ — same visual language as /faq/, full-width for destination pages. */
export function DestinationFaqSection({
  title,
  subtitle,
  items,
  className = "",
}: DestinationFaqSectionProps) {
  const [expandedItem, setExpandedItem] = useState(0);

  useFaqPageSchema(items);

  const toggleItem = (index: number) => {
    setExpandedItem((prev) => (prev === index ? prev : index));
  };

  return (
    <section className={`bg-white py-14 sm:py-16 lg:py-20 ${className}`}>
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-[90px] xl:px-[210px]">
        <div className="w-full text-left">
          <h2 className="font-['Poppins',sans-serif] font-bold text-[#0C1E3A] text-2xl sm:text-3xl lg:text-4xl">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-3 font-['Poppins',sans-serif] text-[#6B6B8C] text-base sm:text-lg leading-relaxed">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="mt-10 sm:mt-12 w-full">
          <div className="space-y-4">
            {items.map((item, index) => {
              const isOpen = expandedItem === index;
              return (
                <div key={item.question} className="w-full overflow-hidden border-b border-slate-100 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => toggleItem(index)}
                    className="relative w-full py-4 sm:py-5 flex items-center text-left hover:opacity-80 transition-opacity duration-200"
                    aria-expanded={isOpen}
                  >
                    <div className="flex w-full items-start gap-3 sm:gap-6 pr-14 sm:pr-24 lg:pr-36">
                      <div
                        className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isOpen ? "bg-[#1c3957]" : "bg-[#CC922F]"
                        }`}
                      >
                        {isOpen ? (
                          <Minus className="w-6 h-6 text-white" strokeWidth={2.5} />
                        ) : (
                          <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
                        )}
                      </div>
                      <span className="flex-1 min-w-0 font-['Poppins',sans-serif] text-base sm:text-lg lg:text-[22px] font-semibold text-[#0C1E3A] leading-relaxed">
                        {item.question}
                      </span>
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 right-0 sm:right-4 lg:right-8">
                      {isOpen ? (
                        <ArrowDownLeft
                          className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 flex-shrink-0 transition-all duration-300 text-[#1c3957]"
                          strokeWidth={2.5}
                        />
                      ) : (
                        <ArrowUpRight
                          className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 flex-shrink-0 transition-all duration-300 text-[#CC922F]"
                          strokeWidth={2.5}
                        />
                      )}
                    </div>
                  </button>

                  <div
                    className="grid transition-[grid-template-rows] duration-300 ease-in-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <div className="w-full pb-4 sm:pb-6 pt-2 sm:pt-3 pl-[52px] sm:pl-[72px] pr-4 sm:pr-24 lg:pr-36">
                        <p className="w-full font-['Inter',sans-serif] text-[#6B6B8C] leading-relaxed text-sm sm:text-base lg:text-[20px]">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
