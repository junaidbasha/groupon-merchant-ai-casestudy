"use client"

import { Link, DollarSign, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface InputScreenProps {
  businessUrl: string
  setBusinessUrl: (value: string) => void
  minTakeHome: number
  setMinTakeHome: (value: number) => void
  onGenerate: () => void
  isLoading: boolean
}

export function InputScreen({
  businessUrl,
  setBusinessUrl,
  minTakeHome,
  setMinTakeHome,
  onGenerate,
  isLoading,
}: InputScreenProps) {
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
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-balance text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Fill your slow days. Protect your margins.
            </h1>
            <p className="mt-3 text-pretty text-gray-600">
              Drop your booking link below. Our AI will analyze your top services and Chicago market data to build a deal guaranteed to hit your take-home goals.
            </p>
          </div>

          {/* Trust Badge */}
          <div className="mb-8 flex items-center justify-center gap-2 text-sm text-gray-500">
            <Zap className="h-4 w-4 text-amber-500" />
            <span>Takes 30 seconds. No marketing experience required.</span>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* URL Input */}
            <div className="space-y-2">
              <Label htmlFor="booking-url" className="text-sm font-medium text-gray-700">
                Your Booking Site or Instagram URL
              </Label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Link className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="booking-url"
                  type="url"
                  placeholder="e.g., vagaro.com/sofiaslashes"
                  value={businessUrl}
                  onChange={(e) => setBusinessUrl(e.target.value)}
                  className="h-12 pl-10 text-base shadow-sm"
                />
              </div>
            </div>

            {/* Take-Home Input */}
            <div className="space-y-2">
              <Label htmlFor="min-takehome" className="text-sm font-medium text-gray-700">
                Minimum Take-Home per Appointment ($)
              </Label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="min-takehome"
                  type="number"
                  min={1}
                  step="0.01"
                  placeholder="45"
                  value={minTakeHome}
                  onChange={(e) => {
                    const value = Number(e.target.value)
                    setMinTakeHome(Number.isFinite(value) ? value : 0)
                  }}
                  className="h-12 pl-10 text-base shadow-sm"
                />
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={onGenerate}
              disabled={isLoading}
              className="h-14 w-full bg-emerald-600 text-base font-semibold text-white shadow-lg transition-all hover:bg-emerald-700 hover:shadow-xl"
            >
              Generate Margin-Safe Deal
              <span className="ml-2">→</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
