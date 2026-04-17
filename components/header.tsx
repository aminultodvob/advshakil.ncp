"use client"

import { useState, useEffect, useRef } from "react"
import { useTranslations, useLocale } from "next-intl"
import { useGSAP } from "@/lib/gsap-provider"
import { Menu, X, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LanguageSwitcher } from "@/components/language-switcher"

export function Header() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const { gsap, isReady } = useGSAP()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (!isReady || !headerRef.current) return

    gsap.fromTo(
      headerRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 },
    )
  }, [isReady, gsap])

  const navItems = [
    { key: "home", href: "/#home" },
    { key: "opinion", href: "/#opinion" },
    { key: "priorities", href: "/#priorities" },
  ]

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#004d38]/95 backdrop-blur-md shadow-2xl" : "bg-transparent"
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/#home" className="flex items-center gap-3 group">
            <span className="font-bold text-xl text-white">
              {locale === "bn" ? "অ্যাডভোকেট সাকিল আহমাদ" : "Advocate Shakil Ahmad"}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {

              // Regular nav items
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className="text-white/80 hover:text-white transition-colors font-medium relative group"
                >
                  {t(item.key)}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
                </Link>
              )
            })}
          </nav>

          {/* Language Toggle & Mobile Menu */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            <button
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-white/20 bg-[#006A4E]/95 backdrop-blur-md rounded-b-2xl shadow-xl">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t(item.key)}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
