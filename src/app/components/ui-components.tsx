import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { cva, type VariantProps } from "class-variance-authority"
import Link from "next/link"
import type { ReactNode } from "react"

// Logo component
export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-white">
        <span className="font-heading text-xl font-bold">Q</span>
      </div>
      <span className="font-heading text-xl font-bold">Quizio</span>
    </Link>
  )
}

// Section heading component
const headingVariants = cva(
  "font-heading tracking-tight text-center",
  {
    variants: {
      size: {
        default: "text-3xl md:text-4xl",
        sm: "text-2xl md:text-3xl",
        lg: "text-4xl md:text-5xl lg:text-6xl",
      },
      gradient: {
        true: "gradient-text",
        false: "",
      }
    },
    defaultVariants: {
      size: "default",
      gradient: false,
    },
  }
)

interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {}

export function Heading({ 
  children, 
  className, 
  size, 
  gradient,
  ...props 
}: HeadingProps) {
  return (
    <h2
      className={cn(headingVariants({ size, gradient }), className)}
      {...props}
    >
      {children}
    </h2>
  )
}

// Card component with gradient border option
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: boolean
  hover?: boolean
  children: ReactNode
}

export function Card({ 
  className, 
  gradient = false, 
  hover = false,
  children, 
  ...props 
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-card p-6 shadow-soft",
        hover && "transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        gradient && "gradient-border",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Gradient button
export function GradientButton({ 
  className, 
  children,
  ...props 
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      className={cn(
        "bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 font-medium text-white transition-all hover:shadow-glow",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
}

// Section container
export function Section({ 
  className, 
  children,
  ...props 
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={cn("py-12 md:py-16 lg:py-20", className)}
      {...props}
    >
      {children}
    </section>
  )
}

// Container with max width
export function Container({ 
  className, 
  children,
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("container mx-auto px-4", className)}
      {...props}
    >
      {children}
    </div>
  )
}

// Empty state component
export function EmptyState({ 
  title, 
  description,
  icon: Icon,
  action
}: { 
  title: string
  description: string
  icon: React.ElementType
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/50 bg-muted/50 p-8 text-center">
      <div className="mb-4 rounded-full bg-background p-3">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-xl font-medium">{title}</h3>
      <p className="mb-6 text-muted-foreground">{description}</p>
      {action}
    </div>
  )
}
