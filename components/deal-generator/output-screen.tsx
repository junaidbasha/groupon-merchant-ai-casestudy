"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface OutputScreenProps {
  minTakeHome: number
  dealData: {
    dealPrice: number
    platformFee: number
    merchantNets: number
    title: string
    description: string
    finePrint: string
  }
  onEdit: () => void
}

export function OutputScreen({ minTakeHome, dealData, onEdit }: OutputScreenProps) {
  const goal = minTakeHome || 45
  const goalMessage =
    dealData.merchantNets >= goal
      ? `Meets your $${goal.toFixed(2)} take-home goal`
      : `Below your $${goal.toFixed(2)} take-home goal`

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50">
      {/* Experiment Badge */}
      <div className="flex justify-end p-4">
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-400">
          Experiment: Margin-UI-v2 (Active)
        </span>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col items-center px-6 pb-16 pt-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-balance text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              Here is your optimized deal, ready to launch.
            </h1>
          </div>

          {/* Deal Card */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
            {/* Deal Image */}
            <div className="relative h-48 w-full bg-gradient-to-br from-rose-100 to-rose-50">
              <Image
                src="https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&h=400&fit=crop&crop=faces"
                alt="Lash lift treatment showing beautiful curled lashes"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-3 left-3">
                <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 shadow-sm backdrop-blur-sm">
                  Beauty & Wellness
                </span>
              </div>
            </div>

            {/* Deal Content */}
            <div className="p-5">
              {/* Title */}
              <h2 className="text-xl font-bold text-gray-900">
                {dealData.title}
              </h2>

              {/* Description */}
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {dealData.description}
              </p>

              {/* Fine Print */}
              <p className="mt-3 text-xs text-gray-500">
                {dealData.finePrint}
              </p>

              {/* Margin Box */}
              <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <h3 className="mb-3 font-semibold text-gray-900">
                  Your Unit Economics
                </h3>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Customer Pays:</span>
                    <span className="font-medium text-gray-900">${dealData.dealPrice.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Groupon Platform Fee (20%):</span>
                    <span className="font-medium text-red-500">-${dealData.platformFee.toFixed(2)}</span>
                  </div>

                  <div className="my-2 border-t border-emerald-200" />

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-emerald-700">You Keep:</span>
                    <span className="text-lg font-bold text-emerald-700">${dealData.merchantNets.toFixed(2)}</span>
                  </div>
                </div>

                {/* Success Badge */}
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-100 px-3 py-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm font-medium text-emerald-800">
                    {goalMessage}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            <Button className="h-14 w-full bg-emerald-600 text-base font-semibold text-white shadow-lg transition-all hover:bg-emerald-700 hover:shadow-xl">
              Publish Deal to Groupon
            </Button>
            <Button
              variant="outline"
              onClick={onEdit}
              className="h-12 w-full border-gray-300 text-base font-medium text-gray-700 transition-all hover:bg-gray-50"
            >
              Edit Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
