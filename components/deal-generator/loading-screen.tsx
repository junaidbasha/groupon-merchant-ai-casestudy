"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

const loadingMessages = [
  "Scraping your service menu...",
  "Analyzing local deal performance...",
  "Calculating margin-safe pricing...",
  "Writing high-converting copy...",
]

export function LoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length)
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50">
      {/* Experiment Badge */}
      <div className="flex justify-end p-4">
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-400">
          Experiment: Margin-UI-v2 (Active)
        </span>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-16">
        <div className="w-full max-w-md">
          {/* Skeleton Deal Card */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
            {/* Image Skeleton */}
            <Skeleton className="h-48 w-full animate-pulse rounded-none bg-gray-200" />
            
            {/* Content Skeleton */}
            <div className="p-6">
              {/* Title */}
              <Skeleton className="mb-3 h-6 w-3/4 animate-pulse bg-gray-200" />
              
              {/* Description */}
              <Skeleton className="mb-2 h-4 w-full animate-pulse bg-gray-200" />
              <Skeleton className="mb-4 h-4 w-5/6 animate-pulse bg-gray-200" />
              
              {/* Fine Print */}
              <Skeleton className="mb-6 h-3 w-2/3 animate-pulse bg-gray-100" />
              
              {/* Margin Box Skeleton */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
                <Skeleton className="mb-3 h-5 w-1/3 animate-pulse bg-emerald-100" />
                <Skeleton className="mb-2 h-4 w-1/2 animate-pulse bg-emerald-100" />
                <Skeleton className="mb-2 h-4 w-1/2 animate-pulse bg-emerald-100" />
                <Skeleton className="h-5 w-1/3 animate-pulse bg-emerald-100" />
              </div>
            </div>
          </div>

          {/* Loading Message */}
          <div className="mt-8 flex flex-col items-center">
            {/* Pulsing Dot Animation */}
            <div className="mb-4 flex items-center gap-1.5">
              <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-500" style={{ animationDelay: "0ms" }} />
              <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-500" style={{ animationDelay: "150ms" }} />
              <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-500" style={{ animationDelay: "300ms" }} />
            </div>
            <p className="text-center text-sm font-medium text-gray-600 transition-opacity duration-300">
              {loadingMessages[messageIndex]}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
