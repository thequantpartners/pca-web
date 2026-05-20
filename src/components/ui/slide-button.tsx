'use client'

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type JSX,
} from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type PanInfo,
} from 'framer-motion'
import { Check, Loader2, SendHorizontal, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button, type ButtonProps } from '@/components/ui/button'

const DRAG_THRESHOLD = 0.88
const HANDLE_WIDTH = 56

const ANIMATION_CONFIG = {
  spring: {
    type: 'spring',
    stiffness: 400,
    damping: 40,
    mass: 0.8,
  },
}

type Status = 'idle' | 'loading' | 'success' | 'error'

type StatusIconProps = {
  status: Status
}

const StatusIcon: React.FC<StatusIconProps> = ({ status }) => {
  const iconMap: Partial<Record<Status, JSX.Element>> = useMemo(
    () => ({
      loading: <Loader2 className="animate-spin" size={20} />,
      success: <Check size={20} />,
      error: <X size={20} />,
    }),
    [],
  )

  if (!iconMap[status]) return null

  return (
    <motion.div
      key={status}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
    >
      {iconMap[status]}
    </motion.div>
  )
}

export interface SlideButtonProps extends Omit<ButtonProps, 'onClick'> {
  label?: string
  completeLabel?: string
  onSlideComplete?: () => void
}

const SlideButton = forwardRef<HTMLButtonElement, SlideButtonProps>(
  (
    {
      className,
      completeLabel = 'Done',
      disabled,
      label = 'Slide to continue',
      onSlideComplete,
      ...props
    },
    ref,
  ) => {
    const [isDragging, setIsDragging] = useState(false)
    const [completed, setCompleted] = useState(false)
    const [status, setStatus] = useState<Status>('idle')
    const pointerStartX = useRef<number | null>(null)
    const trackRef = useRef<HTMLDivElement | null>(null)
    const [maxDrag, setMaxDrag] = useState(202)

    const dragX = useMotionValue(0)
    const springX = useSpring(dragX, ANIMATION_CONFIG.spring)
    const dragProgress = useTransform(
      springX,
      [0, maxDrag],
      [0, 1],
    )
    const adjustedWidth = useTransform(springX, (x) => x + 48)

    useEffect(() => {
      const track = trackRef.current

      if (!track) return

      const updateMaxDrag = () => {
        setMaxDrag(Math.max(0, track.offsetWidth - HANDLE_WIDTH))
      }

      updateMaxDrag()

      const resizeObserver = new ResizeObserver(updateMaxDrag)
      resizeObserver.observe(track)

      return () => resizeObserver.disconnect()
    }, [])

    const complete = useCallback(() => {
      if (completed || disabled) return

      setCompleted(true)
      setStatus('loading')
      window.setTimeout(() => {
        setStatus('success')
        window.setTimeout(() => {
          onSlideComplete?.()
        }, 220)
      }, 260)
    }, [completed, disabled, onSlideComplete])

    const handleDragStart = useCallback(() => {
      if (completed || disabled) return
      setIsDragging(true)
    }, [completed, disabled])

    const handleDragEnd = () => {
      if (completed || disabled) return
      setIsDragging(false)

      const progress = dragProgress.get()
      if (progress >= DRAG_THRESHOLD) {
        complete()
      } else {
        dragX.set(0)
      }
    }

    const handleDrag = (
      _event: MouseEvent | TouchEvent | PointerEvent,
      info: PanInfo,
    ) => {
      if (completed || disabled) return
      const newX = Math.max(0, Math.min(info.offset.x, maxDrag))
      dragX.set(newX)
    }

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
      if (completed || disabled) return
      pointerStartX.current = event.clientX
    }

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
      const startX = pointerStartX.current

      if (startX === null || completed || disabled) return

      const delta = event.clientX - startX
      dragX.set(Math.max(0, Math.min(delta, maxDrag)))
    }

    const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
      const startX = pointerStartX.current
      pointerStartX.current = null

      if (startX === null || completed || disabled) return

      const delta = event.clientX - startX
      if (delta >= maxDrag * DRAG_THRESHOLD) {
        complete()
      } else {
        dragX.set(0)
      }
    }

    return (
      <motion.div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          pointerStartX.current = null
          dragX.set(0)
        }}
        className={cn(
          'relative flex h-14 w-[min(90vw,387px)] max-w-[calc(100vw-40px)] items-center justify-center overflow-hidden rounded-full border border-pca-cyan/45 bg-card/95 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04),0_0_24px_rgba(0,212,255,0.15)]',
          disabled && 'opacity-50',
        )}
      >
        {!completed && (
          <motion.div
            style={{
              width: adjustedWidth,
            }}
            className="absolute inset-y-0 left-0 z-0 rounded-full bg-pca-cyan"
          />
        )}

        <span className="pointer-events-none absolute inset-0 z-[1] grid place-items-center pl-9 pr-4 text-center font-mono text-xs font-bold uppercase tracking-[0.12em] text-white/80">
          {completed ? completeLabel : label}
        </span>

        <AnimatePresence>
          {!completed && (
            <motion.div
          drag="x"
              dragConstraints={{ left: 0, right: maxDrag }}
              dragElastic={0.05}
              dragMomentum={false}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDrag={handleDrag}
              style={{ x: springX }}
              className="absolute -left-1 z-10 flex cursor-grab items-center justify-start active:cursor-grabbing"
            >
              <Button
                ref={ref}
                disabled={disabled || status === 'loading'}
                {...props}
                size="icon"
                className={cn(
                  'h-14 w-14 rounded-full bg-pca-cyan text-black shadow-button hover:bg-[#5eeaff]',
                  isDragging && 'scale-105 transition-transform',
                  className,
                )}
              >
                <SendHorizontal className="size-5" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {completed && (
            <motion.div
              className="absolute inset-0 z-10 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Button
                ref={ref}
                disabled={disabled || status === 'loading'}
                {...props}
                className={cn(
                  'size-full rounded-full bg-pca-cyan font-mono font-bold text-black transition-all duration-300 hover:bg-[#5eeaff]',
                  className,
                )}
              >
                <StatusIcon status={status} />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  },
)

SlideButton.displayName = 'SlideButton'

export { SlideButton }
