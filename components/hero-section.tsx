"use client"

import { useTranslations, useLocale } from "next-intl"
import { Button } from "@/components/ui/button"
import { ChevronDown, Play } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function HeroSection() {
  const t = useTranslations()
  const locale = useLocale()

  const stats = [
    {
      valueBn: "১০০+",
      valueEn: "100+",
      labelBn: "মতামত গৃহীত",
      labelEn: "Opinions Received"
    },
    {
      valueBn: "৫০+",
      valueEn: "50+",
      labelBn: "এলাকা কভার",
      labelEn: "Areas Covered"
    },
    {
      valueBn: "২৪/৭",
      valueEn: "24/7",
      labelBn: "জনসেবায় নিযুক্ত",
      labelEn: "Public Service"
    },
  ]

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Next.js Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero.jpeg"
          alt="Hero Background"
          fill
          priority
          quality={75}
          className="object-cover"
          sizes="100vw"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#003d2e]/60 via-transparent to-[#003d2e]" />
      </div>

      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Accent glow - top right */}
        <div className="absolute -top-20 -right-20 w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full bg-accent/20 blur-[120px]" />
        {/* Green glow - bottom left */}
        <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-emerald-500/15 blur-[100px]" />
      </div>

      {/* Animated grid pattern */}
      <div className="absolute inset-0 z-[1] opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 pt-20 pb-32">
        <div className="max-w-5xl mx-auto">
          {/* Top Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-white/90 text-sm font-medium tracking-wide">
                {t("hero.badge")}
              </span>
            </div>
          </div>

          {/* Main Title Block */}
          <div className="text-center space-y-6 mb-12">
            {/* Catchy Line */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-white leading-[0.9] tracking-tight">
              <span className="inline-block animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                {t("hero.catchy")}
              </span>
            </h1>

            {/* Tagline with accent */}
            <div className="flex items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="hidden md:block w-16 h-[2px] bg-gradient-to-r from-transparent to-accent" />
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white/90">
                {t("hero.tagline")}
              </h2>
              <div className="hidden md:block w-16 h-[2px] bg-gradient-to-l from-transparent to-accent" />
            </div>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              {t("hero.subtitle")}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Button
              size="lg"
              className="group bg-accent hover:bg-accent/90 text-white text-lg px-8 py-7 rounded-full shadow-2xl shadow-accent/30 transition-all duration-300 hover:scale-105 font-semibold"
              asChild
            >
              <Link href="#opinion" className="flex items-center gap-3">
                <span>{t("hero.cta")}</span>
                <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
              </Link>
            </Button>

          </div>

          {/* Quick Stats */}
          <div className="mt-16 grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-2xl md:text-4xl font-bold text-white group-hover:text-accent transition-colors duration-300">
                  {locale === "bn" ? stat.valueBn : stat.valueEn}
                </div>
                <div className="text-xs md:text-sm text-white/50 mt-1">
                  {locale === "bn" ? stat.labelBn : stat.labelEn}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#003d2e] to-transparent z-[5]" />

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-fade-in" style={{ animationDelay: '0.7s' }}>
        <Link
          href="#opinion"
          className="flex flex-col items-center gap-2 text-white/40 hover:text-white transition-colors duration-300 group"
        >
          <span className="text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
            Scroll
          </span>
          <div className="relative w-6 h-10 border-2 border-current rounded-full">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-2 bg-current rounded-full animate-bounce" />
          </div>
        </Link>
      </div>
    </section>
  )
}
