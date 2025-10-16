"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import createGlobe, { COBEOptions } from "cobe"
import { useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export default function GlobeFeatureSection() {
  return (
    <section className="relative w-full mx-auto overflow-hidden rounded-3xl bg-muted border border-gray-200 dark:border-gray-800 shadow-md px-6 py-16 md:px-16 md:py-24">
      <div className="flex flex-col-reverse items-center justify-between gap-10 md:flex-row">
        <div className="z-10 max-w-xl text-left">
          <h1 className="text-3xl font-normal text-gray-900 dark:text-white">
            Déménagez avec <span className="text-[#CC922F]">GoYard</span>{" "}
            <span className="text-gray-500 dark:text-gray-400">Votre partenaire de confiance pour un déménagement simple, rapide et sans stress partout en France.</span>
          </h1>
          <Button className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1C3957] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#2a4f6b]">
            Commencer Maintenant <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative h-[180px] w-full max-w-xl">
          <Globe className="absolute -bottom-20 -right-40 scale-150" />
        </div>
      </div>
    </section>
  );
}

const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.15,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1],
  markerColor: [204 / 255, 146 / 255, 47 / 255], // #CC922F brand color
  glowColor: [1, 1, 1],
  markers: [
    { location: [48.8566, 2.3522], size: 0.1 }, // Paris
    { location: [43.6047, 1.4442], size: 0.08 }, // Toulouse
    { location: [43.2965, 5.3698], size: 0.08 }, // Marseille
    { location: [45.764, 4.8357], size: 0.09 }, // Lyon
    { location: [47.2184, -1.5536], size: 0.07 }, // Nantes
    { location: [50.6292, 3.0573], size: 0.08 }, // Lille
    { location: [48.5734, 7.7521], size: 0.07 }, // Strasbourg
    { location: [44.8378, -0.5792], size: 0.08 }, // Bordeaux
    { location: [43.6108, 3.8767], size: 0.07 }, // Montpellier
    { location: [47.4784, -0.5632], size: 0.06 }, // Angers
    { location: [49.2583, 4.0317], size: 0.07 }, // Reims
    { location: [48.1173, -1.6778], size: 0.06 }, // Rennes
    { location: [49.4944, 0.1079], size: 0.07 }, // Le Havre
    { location: [43.7102, 7.2620], size: 0.07 }, // Nice
    { location: [47.3220, 5.0415], size: 0.06 }, // Dijon
    { location: [48.6921, 6.1844], size: 0.06 }, // Nancy
    { location: [45.1885, 5.7245], size: 0.06 }, // Grenoble
    { location: [49.8951, 2.2958], size: 0.06 }, // Amiens
    { location: [47.9029, 1.9093], size: 0.06 }, // Orléans
    { location: [46.5802, 0.3404], size: 0.06 }, // Poitiers
  ],
}

export function Globe({
  className,
  config = GLOBE_CONFIG,
}: {
  className?: string
  config?: COBEOptions
}) {
  let phi = 0
  let width = 0
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef(null)
  const pointerInteractionMovement = useRef(0)
  const [r, setR] = useState(0)

  const updatePointerInteraction = (value: any) => {
    pointerInteracting.current = value
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value ? "grabbing" : "grab"
    }
  }

  const updateMovement = (clientX: any) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current
      pointerInteractionMovement.current = delta
      setR(delta / 200)
    }
  }

  const onRender = useCallback(
    (state: Record<string, any>) => {
      if (!pointerInteracting.current) phi += 0.005
      state.phi = phi + r
      state.width = width * 2
      state.height = width * 2
    },
    [r],
  )

  const onResize = () => {
    if (canvasRef.current) {
      width = canvasRef.current.offsetWidth
    }
  }

  useEffect(() => {
    window.addEventListener("resize", onResize)
    onResize()

    const globe = createGlobe(canvasRef.current!, {
      ...config,
      width: width * 2,
      height: width * 2,
      onRender,
    })

    setTimeout(() => (canvasRef.current!.style.opacity = "1"))
    return () => globe.destroy()
  }, [])

  return (
    <div
      className={cn(
        "absolute inset-0 mx-auto aspect-[1/1] w-full max-w-[600px]",
        className,
      )}
    >
      <canvas
        className={cn(
          "size-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]",
        )}
        ref={canvasRef}
        onPointerDown={(e) =>
          updatePointerInteraction(
            e.clientX - pointerInteractionMovement.current,
          )
        }
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
    </div>
  )
}

