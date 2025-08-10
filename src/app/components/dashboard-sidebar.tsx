"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Logo } from "@/app/components/ui-components"
import { Button } from "@/components/ui/button"
import { BarChart, BookOpen, Home, LogOut, PlusCircle, Settings, User } from 'lucide-react'
import Image from "next/image"
import { api } from "@/trpc/react"
import { useState, useEffect } from "react"
import {jwtDecode} from "jwt-decode"
import { Toaster, toast } from "sonner"

type JwtPayload = { userId: string };

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  isOpen?: boolean
}

export function DashboardSidebar({ className, isOpen = true }: SidebarNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  
  const [userId, setUserId] = useState<string | null>(null);
  const [tokenChecked, setTokenChecked] = useState(false);

  const { data: user, isLoading } = api.auth.getUserById.useQuery(userId!, {
    enabled: !!userId,
  });

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        setUserId(decoded.userId);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        router.push("/auth"); // optional: redirect to login
      }
    }
    setTokenChecked(true);
  }, []);


  // if (!tokenChecked) return <p>Loading...</p>;
  const routes = [
    {
      href: "/dashboard",
      icon: Home,
      label: "Dashboard",
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/my-quizzes",
      icon: BookOpen,
      label: "My Quizzes",
      active: pathname === "/dashboard/my-quizzes",
    },
    {
      href: "/dashboard/join-quiz",
      icon: PlusCircle,
      label: "Join Quiz",
      active: pathname === "/dashboard/join-quiz",
    },
    {
      href: "/dashboard/results",
      icon: BarChart,
      label: "Results",
      active: pathname === "/dashboard/results",
    },
    {
      href: "/dashboard/profile",
      icon: User,
      label: "Profile",
      active: pathname === "/dashboard/profile",
    },
    {
      href: "/dashboard/settings",
      icon: Settings,
      label: "Settings",
      active: pathname === "/dashboard/settings",
    },
  ]

  const logout = api.auth.logout.useMutation({
    onSuccess: () => {
      router.push("/auth")
    },
    onError: (error) => {
      console.error("Logout failed:", error)
    },
  })

  if (isLoading) {
    return (
      <aside className={cn(
        "flex h-screen flex-col border-r bg-muted/30",
        isOpen ? "w-64" : "w-20",
        className
      )}>
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      </aside>
    )
  }

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r bg-muted/30 transition-all duration-300",
        isOpen ? "w-64" : "w-20",
        className
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        {isOpen ? (
          <Logo />
        ) : (
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-white">
            <span className="font-heading text-xl font-bold">Q</span>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground",
                route.active ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                !isOpen && "justify-center px-0"
              )}
            >
              <route.icon className={cn("h-5 w-5", !isOpen && "h-6 w-6")} />
              {isOpen && <span>{route.label}</span>}
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-full bg-muted">
            {user ? (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                {/* {user?.name?.charAt(0).toUpperCase() || ""} */}
              </div>
            ) : (
              <Image
                src="/placeholder-user.jpg"
                alt="User avatar"
                width={40}
                height={40}
              />
            )}
          </div>
          {isOpen && (
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium">{user?.name || "Guest"}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.email || "guest@example.com"}</p>
            </div>
          )}
        </div>
        
        <Button
          variant="ghost"
          className={cn(
            "mt-4 w-full justify-start text-muted-foreground hover:text-foreground",
            !isOpen && "justify-center"
          )}
          onClick={async () => {
            localStorage.removeItem("token");
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            toast.success("Logged out successfully");
            await new Promise(resolve => setTimeout(resolve, 1500)); 
            router.push("/auth");
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isOpen && "Logout"}
        </Button>
      </div>
      <Toaster position="top-center" richColors />
    </aside>
  )
}