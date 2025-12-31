"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Something went wrong!</h2>
        <p className="mt-2 text-gray-600">We apologize for the inconvenience.</p>
        <div className="mt-6 flex justify-center gap-4">
          <Button
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
            variant="default"
          >
            Try again
          </Button>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Reload Page
          </Button>
        </div>
      </div>
    </div>
  )
}
