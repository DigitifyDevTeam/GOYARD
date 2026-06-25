import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Minus, Plus } from "lucide-react";
import { useFaqPageSchema, type FaqSchemaItem } from "../../hooks/useFaqPageSchema";

type DestinationFaqSectionProps = Readonly<{
  title: string;
  subtitle?: string;
  items: readonly FaqSchemaItem[];
  className?: string;
  /** Tighter row spacing and smaller corner arrows */
  compact?: boolean;
}>;

/** Accordion FAQ — same visual language as /faq/, full-width for destination pages. */
export function DestinationFaqSection({
  title,
  subtitle,
  items,
  className = "",
  compact = false,
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

        <div className={`w-full ${compact ? "mt-8 sm:mt-10" : "mt-10 sm:mt-12"}`}>
          <div className={compact ? "space-y-0.5" : "space-y-4"}>
            {items.map((item, index) => {
              const isOpen = expandedItem === index;
              return (
                <div key={item.question} className="w-full overflow-hidden border-b border-slate-100 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => toggleItem(index)}
                    className={`relative w-full flex items-center text-left hover:opacity-80 transition-opacity duration-200 ${
                      compact ? "py-2 sm:py-2.5" : "py-4 sm:py-5"
                    }`}
                    aria-expanded={isOpen}
                  >
                    <div
                      className={`flex w-full items-start gap-3 sm:gap-6 ${
                        compact ? "pr-10 sm:pr-14 lg:pr-20" : "pr-14 sm:pr-24 lg:pr-36"
                      }`}
                    >
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
                      <span className="flex-1 min-w-0 font-['Poppins',sans-serif] text-[17px] font-semibold text-[#0C1E3A] leading-relaxed">
                        {item.question}
                      </span>
                    </div>
                    <div
                      className={`absolute top-1/2 -translate-y-1/2 ${
                        compact ? "right-0 sm:right-2 lg:right-4" : "right-0 sm:right-4 lg:right-8"
                      }`}
                    >
                      {isOpen ? (
                        <ArrowDownLeft
                          className={`flex-shrink-0 transition-all duration-300 text-[#1c3957] ${
                            compact ? "w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" : "w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16"
                          }`}
                          strokeWidth={2.5}
                        />
                      ) : (
                        <ArrowUpRight
                          className={`flex-shrink-0 transition-all duration-300 text-[#CC922F] ${
                            compact ? "w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" : "w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16"
                          }`}
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
                      <div
                        className={`w-full pl-[52px] sm:pl-[72px] pr-4 ${
                          compact
                            ? "pb-2 sm:pb-3 pt-1 sm:pt-1.5 sm:pr-14 lg:pr-20"
                            : "pb-4 sm:pb-6 pt-2 sm:pt-3 sm:pr-24 lg:pr-36"
                        }`}
                      >
                        <p className="w-full font-['Poppins',sans-serif] font-normal text-[15px] leading-[24.5px] tracking-[0] text-[#6b6b8c]">
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
