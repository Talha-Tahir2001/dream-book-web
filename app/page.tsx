import CTA from "@/components/landing/CTA"
import FAQ from "@/components/landing/FAQ"
import Features from "@/components/landing/Features"
import Footer from "@/components/landing/Footer"
import Hero from "@/components/landing/Hero"
import HowItWorks from "@/components/landing/HowItWorks"
import Navbar from "@/components/landing/Navbar"
import Pricing from "@/components/landing/Pricing"
import SocialProof from "@/components/landing/SocialProof"
import Testimonials from "@/components/landing/Testemonials"

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <SocialProof />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}
