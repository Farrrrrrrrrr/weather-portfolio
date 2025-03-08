"use client";

import { useState, useEffect } from "react";
import { fetchWeatherAlerts } from "@/lib/api";
import { ExclamationIcon, XIcon } from "@heroicons/react/outline";

interface Alert {
  id: number;
  city: string;
  type: string;
  severity: "moderate" | "severe" | "extreme";
  message: string;
  date: string;
}

export function WeatherAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [closedAlerts, setClosedAlerts] = useState<number[]>([]);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const data = await fetchWeatherAlerts();
        setAlerts(data);
      } catch (error) {
        console.error("Failed to fetch weather alerts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAlerts();
  }, []);

  const closeAlert = (id: number) => {
    setClosedAlerts([...closedAlerts, id]);
  };

  const alertsToShow = alerts.filter(alert => !closedAlerts.includes(alert.id));

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        ))}
      </div>
    );
  }

  if (alertsToShow.length === 0) {
    return (
      <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg">
        <p className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
          </svg>
          No active weather alerts
        </p>
        <p className="text-sm mt-1">Weather conditions are currently stable across Indonesia.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alertsToShow.map(alert => {
        const bgColor = 
          alert.severity === "extreme" ? "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-900" :
          alert.severity === "severe" ? "bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-900" :
          "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-900";
        
        const textColor = 
          alert.severity === "extreme" ? "text-red-700 dark:text-red-400" :
          alert.severity === "severe" ? "text-orange-700 dark:text-orange-400" :
          "text-yellow-700 dark:text-yellow-400";
          
        return (
          <div key={alert.id} className={`p-3 rounded-lg border ${bgColor}`}>
            <div className="flex justify-between items-start">
              <div className={`flex gap-2 items-center font-medium ${textColor}`}>
                <ExclamationIcon className="h-5 w-5" />
                <span>{alert.type}</span>
              </div>
              <button onClick={() => closeAlert(alert.id)} className={`${textColor} hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full p-1`}>
                <XIcon className="h-4 w-4" />
              </button>
            </div>
            <p className={`mt-1 ${textColor}`}>{alert.message}</p>
            <div className="flex justify-between mt-2 text-sm">
              <span className={`${textColor}`}>{alert.city}</span>
              <span className={`${textColor}`}>{alert.date}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
