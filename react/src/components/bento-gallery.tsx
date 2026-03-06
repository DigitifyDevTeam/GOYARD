"use client"

import React, { useRef, useState, useEffect, useCallback } from "react"
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useMotionValueEvent,
  animate,
} from "framer-motion"
import { cn } from "@/lib/utils"
import { X, ChevronRight, ChevronLeft } from "lucide-react"

// Defines the structure for each image item in the gallery
type ImageItem = {
  id: number | string
  title: string
  desc: string
  url: string
  span: string // Tailwind CSS grid span classes (e.g., "md:col-span-2")
}

// Defines the props for the main gallery component
interface InteractiveImageBentoGalleryProps {
  imageItems: ImageItem[]
  title: string
  description: string
}

// Animation variants for the container to stagger children
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

// Animation variants for each gallery item
const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 15 },
  },
}

// Modal component for displaying the selected image
const ImageModal = ({
  item,
  onClose,
}: {
  item: ImageItem
  onClose: () => void
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    },
    [onClose]
  )

  useEffect(() => {
    document.body.style.overflow = "hidden"
    closeButtonRef.current?.focus()
    globalThis.addEventListener("keydown", handleKeyDown)
    return () => {
      document.body.style.overflow = ""
      globalThis.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image en grand format"
    >
      <motion.div
        initial={{ scale: 0.92, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 24 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="relative w-full max-w-4xl p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={item.url}
          alt={item.title}
          className="h-auto max-h-[90vh] w-full rounded-2xl object-contain shadow-2xl"
        />
        <div className="mt-3 rounded-xl bg-black/40 px-4 py-2 text-center font-['Poppins',sans-serif]">
          <p className="text-sm font-medium text-white">{item.title}</p>
          <p className="text-xs text-white/80">{item.desc}</p>
        </div>
      </motion.div>
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/90 transition-colors hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#CC922F] focus:ring-offset-2 focus:ring-offset-black/50"
        aria-label="Fermer"
      >
        <X size={22} strokeWidth={2} />
      </button>
    </motion.div>
  )
}

// Main gallery component
const InteractiveImageBentoGallery: React.FC<
  InteractiveImageBentoGalleryProps
> = ({ imageItems, title, description }) => {
  const [selectedItem, setSelectedItem] = useState<ImageItem | null>(null)
  const [dragConstraint, setDragConstraint] = useState(0)
  const [failedImageIds, setFailedImageIds] = useState<Set<number | string>>(new Set())

  const visibleItems = imageItems.filter((item) => !failedImageIds.has(item.id))

  const handleImageError = useCallback((id: number | string) => {
    setFailedImageIds((prev) => new Set(prev).add(id))
  }, [])
  const containerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const [showLeftArrow, setShowLeftArrow] = useState(false)

  useMotionValueEvent(x, "change", (latest) => {
    setShowLeftArrow(latest < -5)
  })

  // Calculate the draggable area constraint
  useEffect(() => {
    const calculateConstraints = () => {
      if (gridRef.current && containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        const gridWidth = gridRef.current.scrollWidth
        // The '- 32' provides some padding at the end
        const newConstraint = Math.min(0, containerWidth - gridWidth - 32)
        setDragConstraint(newConstraint)
      }
    }

    calculateConstraints()
    window.addEventListener("resize", calculateConstraints)
    return () => window.removeEventListener("resize", calculateConstraints)
  }, [visibleItems])

  // Framer Motion scroll animations
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  })
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.2], [30, 0])

  const scrollRight = useCallback(() => {
    const currentX = x.get()
    const scrollAmount = 320
    const newX = Math.max(currentX - scrollAmount, dragConstraint)
    animate(x, newX, { type: "spring", stiffness: 300, damping: 30 })
  }, [x, dragConstraint])

  const scrollLeft = useCallback(() => {
    const currentX = x.get()
    const scrollAmount = 320
    const newX = Math.min(currentX + scrollAmount, 0)
    animate(x, newX, { type: "spring", stiffness: 300, damping: 30 })
  }, [x])

  return (
    <section
      ref={targetRef}
      className="relative w-full overflow-hidden bg-background py-16 sm:py-20 md:py-24"
    >
      <motion.div
        style={{ opacity, y }}
        className="container mx-auto px-4 text-center"
      >
        <h2 className="font-['Poppins',sans-serif] font-[600] text-3xl sm:text-4xl lg:text-[42px] leading-tight text-foreground">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl font-['Poppins',sans-serif] text-base text-muted-foreground sm:text-lg">
          {description}
        </p>
      </motion.div>

      <div
        ref={containerRef}
        className="relative mt-10 w-full cursor-grab select-none active:cursor-grabbing sm:mt-14"
      >
        {showLeftArrow && (
          <div
            className="absolute left-0 top-0 z-10 flex h-full w-24 items-center justify-start bg-gradient-to-r from-background to-transparent pl-2 sm:w-32 md:pl-4"
            aria-hidden
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                scrollLeft()
              }}
              className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[#CC922F]/90 text-white shadow-lg transition-colors hover:bg-[#CC922F] sm:h-14 sm:w-14"
              aria-label="Voir les images précédentes"
            >
              <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2.5} />
            </button>
          </div>
        )}
        <div
          className="absolute right-0 top-0 z-10 flex h-full w-24 items-center justify-end bg-gradient-to-l from-background to-transparent pr-2 sm:w-32 md:pr-4"
          aria-hidden
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              scrollRight()
            }}
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[#CC922F]/90 text-white shadow-lg transition-colors hover:bg-[#CC922F] sm:h-14 sm:w-14"
            aria-label="Voir les images suivantes"
          >
            <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2.5} />
          </button>
        </div>
        <motion.div
          className="w-max cursor-grab active:cursor-grabbing"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: dragConstraint, right: 0 }}
          dragElastic={0.05}
        >
          <motion.div
            ref={gridRef}
            className="grid auto-cols-[minmax(16rem,1fr)] grid-flow-col gap-5 px-4 sm:gap-6 md:px-8 md:auto-cols-[minmax(18rem,1fr)]"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {visibleItems.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className={cn(
                  "group relative flex h-full min-h-[16rem] w-full min-w-[16rem] cursor-pointer items-end overflow-hidden rounded-2xl border border-slate-200/80 bg-card p-4 shadow-md transition-shadow duration-300 ease-out hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CC922F] focus-visible:ring-offset-2 focus-visible:ring-offset-background md:min-h-[18rem] md:min-w-[18rem]",
                  item.span,
                )}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onClick={() => setSelectedItem(item)}
                onKeyDown={(e) => e.key === "Enter" && setSelectedItem(item)}
                tabIndex={0}
                role="button"
                aria-label={item.title ? `Voir ${item.title}` : "Voir l'image de la galerie"}
              >
                <img
                  src={item.url}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  onError={() => handleImageError(item.id)}
                />
                {item.title && (
                  <>
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="relative z-10 translate-y-4 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                      <h3 className="font-['Poppins',sans-serif] text-lg font-bold text-white">{item.title}</h3>
                      {item.desc && (
                        <p className="mt-1 font-['Poppins',sans-serif] text-sm text-white/85">{item.desc}</p>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <ImageModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}

export default InteractiveImageBentoGallery