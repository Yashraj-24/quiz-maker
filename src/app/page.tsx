"use client"
import Link from "next/link"
import Image from "next/image"
import { MainNav } from "@/app/components/main-nav"
import { Footer } from "@/app/components/footer"
import { Button } from "@/components/ui/button"
import { Card, Container, GradientButton, Heading, Section } from "@/app/components/ui-components"
import { BarChart, Brain, Clock, Globe, Trophy, Users } from 'lucide-react'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter();
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
  
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <MainNav />
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-24 lg:py-32">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary),0.15),transparent_50%)]" />
          <Container className="relative z-10">
            <div className="grid items-center gap-12 md:grid-cols-2">
              <div className="flex flex-col items-center text-center md:items-start md:text-left">
                <h1 className="mb-4 font-heading text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                  Quizio – <span className="gradient-text">Learn, Play, Conquer.</span>
                </h1>
                <p className="mb-8 max-w-md text-lg text-muted-foreground">
                  Create engaging quizzes, challenge your friends, and track your progress with our modern quiz platform.
                </p>
                <div className="flex flex-wrap gap-4">
                  <GradientButton asChild size="lg">
                    <Link href="/auth">Join Quiz</Link>
                  </GradientButton>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/auth">Create Quiz</Link>
                  </Button>
                </div>
              </div>
              <div className="relative mx-auto w-full max-w-md">
                <div className="relative aspect-square animate-float">
                  <Image
                    src="https://img.freepik.com/free-vector/online-survey-analysis-electronic-data-collection-digital-research-tool-computerized-study-analyst-considering-feedback-results-analysing-info-vector-isolated-concept-metaphor-illustration_335657-2807.jpg?ga=GA1.1.1506502641.1745329352&semt=ais_hybrid&w=740"
                    alt="Quiz illustration"
                    width={500}
                    height={500}
                    className="rounded-2xl"
                  />
                </div>
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-xl bg-purple-100 dark:bg-purple-900/20" />
                <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-xl bg-blue-100 dark:bg-blue-900/20" />
              </div>
            </div>
          </Container>
        </section>

        {/* Features Section */}
        <Section className="bg-muted/30">
          <Container>
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <Heading size="lg" className="mb-4">
                Powerful Features for <span className="gradient-text">Modern Learning</span>
              </Heading>
              <p className="text-lg text-muted-foreground">
                Everything you need to create, share, and analyze quizzes in one platform
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} hover className="flex flex-col items-start">
                  <div className="mb-4 rounded-lg bg-primary/10 p-3 text-primary">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-medium">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </Container>
        </Section>

        {/* How It Works Section */}
        <Section>
          <Container>
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <Heading className="mb-4">
                How Quizio <span className="gradient-text">Works</span>
              </Heading>
              <p className="text-lg text-muted-foreground">
                Get started in minutes with our simple and intuitive platform
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {steps.map((step, index) => (
                <div key={step.title} className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-white">
                    <span className="font-heading text-xl font-bold">{index + 1}</span>
                  </div>
                  <h3 className="mb-2 text-xl font-medium">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* Testimonials Section */}
        <Section className="bg-muted/30">
          <Container>
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <Heading className="mb-4">
                What Our <span className="gradient-text">Users Say</span>
              </Heading>
              <p className="text-lg text-muted-foreground">
                Join thousands of satisfied educators and students
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.name} className="flex flex-col">
                  <div className="mb-4 flex items-center gap-4">
                    <div className="h-12 w-12 overflow-hidden rounded-full bg-muted">
                      <Image
                        src="/placeholder.svg?height=48&width=48"
                        alt={testimonial.name}
                        width={48}
                        height={48}
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{testimonial.content}</p>
                </Card>
              ))}
            </div>
          </Container>
        </Section>

        {/* CTA Section */}
        <Section>
          <Container>
            <Card gradient className="mx-auto max-w-4xl overflow-hidden">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="flex flex-col justify-center">
                  <Heading size="sm" className="mb-4 text-left">
                    Ready to transform your quiz experience?
                  </Heading>
                  <p className="mb-6 text-muted-foreground">
                    Join thousands of educators and students who are already using Quizio to make learning fun and engaging.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <GradientButton asChild>
                      <Link href="/auth">Get Started Free</Link>
                    </GradientButton>
                    <Button variant="outline" asChild>
                      <Link href="/contact">Contact Us</Link>
                    </Button>
                  </div>
                </div>
                <div className="relative hidden md:block">
                  <Image
                    src="https://img.freepik.com/free-vector/shrug-concept-illustration_114360-8833.jpg?ga=GA1.1.1506502641.1745329352&semt=ais_hybrid&w=740"
                    alt="Quiz platform"
                    width={300}
                    height={300}
                    className="rounded-lg"
                  />
                </div>
              </div>
            </Card>
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  )
}

const features = [
  {
    title: "Real-time Quizzes",
    description: "Create and participate in live quizzes with real-time results and leaderboards.",
    icon: Clock,
  },
  {
    title: "Detailed Analytics",
    description: "Track performance with comprehensive analytics and insights.",
    icon: BarChart,
  },
  {
    title: "Global Leaderboards",
    description: "Compete with participants from around the world and climb the rankings.",
    icon: Globe,
  },
  {
    title: "Collaborative Learning",
    description: "Work together with peers to solve challenges and share knowledge.",
    icon: Users,
  },
  {
    title: "Smart Assessment",
    description: "AI-powered assessment to identify strengths and areas for improvement.",
    icon: Brain,
  },
  {
    title: "Gamified Experience",
    description: "Earn badges, points, and rewards as you progress through quizzes.",
    icon: Trophy,
  },
]

const steps = [
  {
    title: "Create an Account",
    description: "Sign up for free and set up your profile in just a few clicks.",
  },
  {
    title: "Create or Join Quizzes",
    description: "Create your own quizzes or join existing ones with a simple code.",
  },
  {
    title: "Learn and Improve",
    description: "Track your progress, analyze results, and improve your knowledge.",
  },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "High School Teacher",
    content: "Quizio has transformed how I engage with my students. The interactive quizzes keep them motivated and the analytics help me identify areas where they need more support."
  },
  {
    name: "Michael Chen",
    role: "University Student",
    content: "The competitive element makes learning fun and I retain information much better.",
  },
  {
    name: "Dr. Emily Rodriguez",
    role: "University Professor",
    content: "As an educator, I appreciate how Quizio simplifies the assessment process while providing valuable insights into student performance.",
  },
]
