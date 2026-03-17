import { ReactNode } from "react";
import { ArrowRightIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[28rem] sm:auto-rows-[32rem] lg:auto-rows-[36rem] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6",
        className,
      )}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  description,
  href,
  cta,
}: {
  name: string;
  className: string;
  background: ReactNode;
  description: string;
  href: string;
  cta: string;
}) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-3 lg:col-span-1 flex flex-col justify-between overflow-hidden rounded-2xl",
      "shadow-lg shadow-black/10 ring-1 ring-black/5",
      className,
    )}
  >
    {/* Full-bleed background image */}
    <div className="absolute inset-0">{background}</div>

    {/* Gradient overlay for text readability - stronger on hover */}
    <div
      className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-black/5 transition-colors duration-300 group-hover:from-black/80 group-hover:via-black/60 group-hover:to-black/40"
      aria-hidden
    />

    {/* Content layer */}
    <div className="relative z-10 flex flex-1 flex-col justify-end p-6 sm:p-8 transition-all duration-300 group-hover:-translate-y-2">
      <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow-sm">
        {name}
      </h3>
      <p className="mt-2 max-w-xl text-white/90 text-sm sm:text-base leading-relaxed">
        {description}
      </p>
    </div>

    {/* CTA - slides up on hover */}
    <div
      className={cn(
        "relative z-10 flex w-full translate-y-4 transform-gpu flex-row items-center p-4 sm:p-6 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
      )}
    >
      <Button
        variant="secondary"
        asChild
        size="sm"
        className="pointer-events-auto bg-white text-[#1C3957] hover:bg-white/95 font-semibold"
      >
        <a href={href}>
          {cta}
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </a>
      </Button>
    </div>
  </div>
);

export { BentoCard, BentoGrid };
