"use client"
import Link from "next/link"
import { useState } from "react"
import { MainNav } from "@/app/components/main-nav"
import { Footer } from "@/app/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, Container, GradientButton, Heading } from "@/app/components/ui-components"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AtSign, Lock, SquareUserRound } from "lucide-react"
import { useRouter } from "next/navigation"
import { api } from "@/trpc/react"
import { Toaster, toast } from 'sonner';
import {useEffect} from "react"

export default function AuthPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [isSignupLoading, setIsSignupLoading] = useState(false)
  const [isLoginLoading, setIsLoginLoading] = useState(false)
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);
  
  useEffect(() => {
    if (token) {
      router.push("/dashboard");
    }
  }, [token, router]); 
  

  const signup = api.auth.signup.useMutation({
    onSuccess: () => {
      setTimeout(()=>{
        toast.success("Account created successfully!");
      },2000);
      window.location.reload()
      router.push("/auth");
    },
    onError: (error) => {
      setIsSignupLoading(false);
      if (error.data?.code === 'CONFLICT') {
        toast.error("Email already in use");
      } else {
        toast.error("Failed to create account");
      }
      console.error("Signup error:", error);
    }
  });

  const login = api.auth.login.useMutation({
    onSuccess: (data) => {
      toast.success("Logged in successfully!");
      localStorage.setItem("token", data.user.token);
      document.cookie = `token=${data.user.token}; path=/; max-age=604800;`;
      router.push("/dashboard");
    },
    onError: (error) => {
      setIsLoginLoading(false);
      if (error.data?.code === 'NOT_FOUND') {
        toast.error("User not found. Please check your email.");
      } else if (error.data?.code === 'UNAUTHORIZED') {
        toast.error("Incorrect password. Please try again.");
      } else {
        toast.error("Login failed. Please try again.");
      }
      console.error("Login error:", error);
    }
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSignupLoading(true);

    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      setIsSignupLoading(false);
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      setIsSignupLoading(false);
      return;
    }

    await signup.mutateAsync({ name, email, password });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoginLoading(true);
    
    if (!loginEmail || !loginPassword) {
      toast.error("Please fill in all fields");
      setIsLoginLoading(false);
      return;
    }
  
    await login.mutateAsync({ email: loginEmail, password: loginPassword });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <MainNav />
      </header>

      <main className="flex-1">
        <section className="py-12 md:py-16 lg:py-20">
          <Container className="max-w-md">
            <div className="mb-8 text-center">
              <Heading className="mb-2">
                Welcome to <span className="gradient-text">Quizio</span>
              </Heading>
              <p className="text-muted-foreground">Sign in to your account or create a new one</p>
            </div>

            <Card className="p-6">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <div className="relative">
                        <AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="name@example.com"
                          className="pl-10"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          disabled={isLoginLoading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="login-password">Password</Label>
                        <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          disabled={isLoginLoading}
                        />
                      </div>
                    </div>

                    <GradientButton
                      type="submit"
                      className="w-full"
                      disabled={isLoginLoading}
                    >
                      {isLoginLoading ? "Signing in..." : "Sign In"}
                    </GradientButton>

                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full"
                      type="button"
                      disabled={isLoginLoading}
                    >
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Google
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">Name</Label>
                      <div className="relative">
                        <SquareUserRound className="absolute left-3 top-[0.6rem] h-4 w-4 text-muted-foreground" />
                        <Input
                          id="first-name"
                          type="text"
                          placeholder="John Doe"
                          className="pl-10"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={isSignupLoading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@example.com"
                          className="pl-10"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isSignupLoading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={isSignupLoading}
                        />
                      </div>
                    </div>

                    <GradientButton
                      type="submit"
                      className="w-full"
                      disabled={isSignupLoading}
                    >
                      {isSignupLoading ? "Creating account..." : "Create Account"}
                    </GradientButton>

                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full"
                      type="button"
                      disabled={isSignupLoading}
                    >
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Google
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </Card>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              By signing up, you agree to our{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </Container>
        </section>
      </main>

      <Footer />
      <Toaster richColors position="top-center" closeButton={false} />
    </div>
  )
}