"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LanguageSwitcher() {
  const router = useRouter();
  const [language, setLanguage] = useState("en"); // Default to English
  
  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "id" : "en";
    setLanguage(newLanguage);
    // Here you would typically update your i18n context
    // For now, we just update the state
    
    // For a real implementation with next-i18next, we would use router
    // router.push(router.pathname, router.asPath, { locale: newLanguage })
  };
  
  return (
    <button 
      onClick={toggleLanguage}
      className="flex items-center space-x-1 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
    >
      <span>{language === "en" ? "🇬🇧 EN" : "🇮🇩 ID"}</span>
    </button>
  );
}
