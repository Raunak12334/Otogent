import type { Metadata } from "next";
import { LandingNavbar } from "@/features/landing/components/landing-navbar";
import { LandingHero } from "@/features/landing/components/landing-hero";
import { LandingPlatform } from "@/features/landing/components/landing-platform";
import { LandingWorkflow } from "@/features/landing/components/landing-workflow";
import { LandingProductDemo } from "@/features/landing/components/landing-product-demo";
import { LandingUseCases } from "@/features/landing/components/landing-use-cases";
import { LandingFAQ } from "@/features/landing/components/landing-faq";
import { LandingCTA } from "@/features/landing/components/landing-cta";
import { LandingFooter } from "@/features/landing/components/landing-footer";
import { LandingSmoothScroll } from "@/features/landing/components/landing-smooth-scroll";

export const metadata: Metadata = {
  title: "Otogent | Agentic trading",
  description:
    "Automation & Agents for trading",
  openGraph: {
    title: "Otogent | Agentic trading",
    description:
      "Automation & Agents for trading",
    url: "https://www.otogent.com",
    type: "website",
    siteName: "Otogent",
    images: [
      {
        url: "/og-image.png?v=3",
        secureUrl: "/og-image.png?v=3",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Otogent | Agentic trading",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Otogent | Agentic trading",
    description:
      "Automation & Agents for trading",
    images: ["/og-image.png?v=3"],
  },
};

export default function LandingPage() {
  return (
    <LandingSmoothScroll>
      <div className="bg-ploy-background-primary flex flex-col scroll-pt-[5.5rem] min-h-screen text-ploy-text-primary selection:bg-ploy-accent-primary/20 selection:text-ploy-text-primary">
        <LandingNavbar />
        <main>
          <LandingHero />
          <LandingPlatform />
          <LandingWorkflow />
          <LandingProductDemo />
          <LandingUseCases />
          <LandingFAQ />
          <LandingCTA />
        </main>
        <LandingFooter />
      </div>
    </LandingSmoothScroll>
  );
}
