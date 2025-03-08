"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { MenuIcon, XIcon } from "@heroicons/react/outline";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="w-8 h-8 text-primary"
              >
                <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM12 13.875a7.125 7.125 0 00-7.124 7.125.75.75 0 001.5 0 5.625 5.625 0 0111.25 0 .75.75 0 001.5 0 7.125 7.125 0 00-7.126-7.125z" />
              </svg>
              <span className="ml-2 text-lg font-bold">Indonesia Weather</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition">
              Dashboard
            </Link>
            <Link href="/map" className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition">
              Weather Map
            </Link>
            <Link href="/forecast" className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition">
              5-Day Forecast
            </Link>
            <Link href="/history" className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition">
              Historical Data
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <ThemeToggle />
            
            <button 
              type="button"
              className="md:hidden -m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <XIcon className="h-6 w-6" aria-hidden="true" />
              ) : (
                <MenuIcon className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-4 py-2 border-t border-gray-200 dark:border-gray-800">
            <Link href="/" 
              className="block py-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link href="/map" 
              className="block py-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Weather Map
            </Link>
            <Link href="/forecast" 
              className="block py-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              5-Day Forecast
            </Link>
            <Link href="/history" 
              className="block py-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Historical Data
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
