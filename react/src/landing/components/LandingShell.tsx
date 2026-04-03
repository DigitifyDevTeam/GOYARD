import type { ReactNode } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

type LandingShellProps = Readonly<{
  children: ReactNode;
  onGetQuote: () => void;
}>;

export default function LandingShell({ children, onGetQuote }: LandingShellProps) {
  return (
    <div className="min-h-screen bg-white">
      <Header onGetQuote={onGetQuote} />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
