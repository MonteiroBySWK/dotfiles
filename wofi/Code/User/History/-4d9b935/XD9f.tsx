"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface FadeInProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  direction?: "up" | "down" | "left" | "right" | "none"
}

const FadeIn: React.FC<FadeInProps> = ({ 
  children, 
  className, 
  delay = 0, 
  duration = 300,
  direction = "up"
}) => {
  const [isVisible, setIsVisible] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [delay])

  const directionClasses = {
    up: "translate-y-4",
    down: "-translate-y-4", 
    left: "translate-x-4",
    right: "-translate-x-4",
    none: ""
  }

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all ease-out",
        isVisible 
          ? "opacity-100 translate-x-0 translate-y-0" 
          : `opacity-0 ${directionClasses[direction]}`,
        className
      )}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  )
}

interface ScaleInProps {
  children: React.ReactNode
  className?: string
  delay?: number
  trigger?: boolean
}

const ScaleIn: React.FC<ScaleInProps> = ({ 
  children, 
  className, 
  delay = 0,
  trigger = true
}) => {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    if (trigger) {
      setTimeout(() => setIsVisible(true), delay)
    }
  }, [trigger, delay])

  return (
    <div
      className={cn(
        "transition-transform duration-300 ease-out",
        isVisible ? "scale-100" : "scale-95",
        className
      )}
    >
      {children}
    </div>
  )
}

interface SlideInProps {
  children: React.ReactNode
  className?: string
  from?: "left" | "right" | "top" | "bottom"
  trigger?: boolean
  duration?: number
}

const SlideIn: React.FC<SlideInProps> = ({ 
  children, 
  className, 
  from = "left",
  trigger = true,
  duration = 300
}) => {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    if (trigger) {
      setIsVisible(true)
    }
  }, [trigger])

  const transformClasses = {
    left: isVisible ? "translate-x-0" : "-translate-x-full",
    right: isVisible ? "translate-x-0" : "translate-x-full", 
    top: isVisible ? "translate-y-0" : "-translate-y-full",
    bottom: isVisible ? "translate-y-0" : "translate-y-full"
  }

  return (
    <div
      className={cn(
        "transition-transform ease-out",
        transformClasses[from],
        className
      )}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  )
}

interface PulseProps {
  children: React.ReactNode
  className?: string
  active?: boolean
}

const Pulse: React.FC<PulseProps> = ({ children, className, active = false }) => {
  return (
    <div
      className={cn(
        "transition-all duration-200",
        active && "animate-pulse",
        className
      )}
    >
      {children}
    </div>
  )
}

interface BounceProps {
  children: React.ReactNode
  className?: string
  trigger?: boolean
}

const Bounce: React.FC<BounceProps> = ({ children, className, trigger = false }) => {
  return (
    <div
      className={cn(
        "transition-transform duration-200",
        trigger && "animate-bounce",
        className
      )}
    >
      {children}
    </div>
  )
}

interface StaggeredListProps {
  children: React.ReactNode[]
  className?: string
  delay?: number
}

const StaggeredList: React.FC<StaggeredListProps> = ({ 
  children, 
  className, 
  delay = 100 
}) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <FadeIn key={index} delay={index * delay} direction="up">
          {child}
        </FadeIn>
      ))}
    </div>
  )
}

export { 
  FadeIn, 
  ScaleIn, 
  SlideIn, 
  Pulse, 
  Bounce, 
  StaggeredList 
}
