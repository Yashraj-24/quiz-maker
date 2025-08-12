"use client"
import Link from "next/link"
import { Card, GradientButton } from "@/app/components/ui-components"
import { Button } from "@/components/ui/button"
import { Award, BarChart, BookOpen, Clock, PlusCircle, Trophy, Users } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { api } from "@/trpc/react"
import { usePathname, useRouter } from "next/navigation"
import { jwtDecode } from "jwt-decode"

type JwtPayload = { userId: string };

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [tokenChecked, setTokenChecked] = useState(false);
  const router = useRouter()
  const pathname = usePathname()

  const { data: user, isLoading } = api.auth.getUserById.useQuery(userId!, {
    enabled: !!userId,
  });

  const count = api.quiz.getQuizCount.useQuery({ userId: userId! }, {
    enabled: !!userId,
  });

  const recentQuiz = api.quiz.getRecentQuiz.useQuery({ userId: userId! }, {
    enabled: !!userId,
  });

  console.log(recentQuiz.data);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        setUserId(decoded.userId);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        router.push("/auth"); 
      }
    }
    setTokenChecked(true);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name} Here's an overview of your quizzes and performance.
          </p>
        </div>
        <div className="flex gap-2">
          <GradientButton asChild>
            <Link href="/dashboard/create-quiz">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Quiz
            </Link>
          </GradientButton>
          <Button variant="outline" asChild>
            <Link href="/dashboard/join-quiz">Join Quiz</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="flex items-center gap-4">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Quizzes Created</p>
            <h3 className="text-xl font-bold">{count.data?.count}</h3>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Quizzes Participated</p>
            <h3 className="text-2xl font-bold">24</h3>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <BarChart className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Average Score</p>
            <h3 className="text-2xl font-bold">78%</h3>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Achievements</p>
            <h3 className="text-2xl font-bold">7</h3>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium">Recent Quizzes</h3>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/my-quizzes">View all</Link>
            </Button>
          </div>

          <div className="space-y-4">
            {recentQuiz.data?.map((quiz) => (
              <div key={quiz.id} className="flex items-center gap-4">
                <div className="rounded-lg bg-muted p-2">
                  {/* <quiz.icon className="h-5 w-5 text-muted-foreground" /> */}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium">{quiz.title}</p>
                  {/* <p className="text-sm text-muted-foreground">{quiz.date}</p> */}
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/quiz/${quiz.id}`}>View</Link>
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium">Your Achievements</h3>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/achievements">View all</Link>
            </Button>
          </div>

          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center gap-4">
                <div className="rounded-lg bg-muted p-2">
                  <achievement.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium">{achievement.title}</p>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
                <div className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  {achievement.points} pts
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">Upcoming Quizzes</h3>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/calendar">View calendar</Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {upcomingQuizzes.map((quiz) => (
            <Card key={quiz.id} className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="rounded-lg bg-muted p-1.5">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  {quiz.status}
                </div>
              </div>
              <h4 className="mb-1 font-medium">{quiz.title}</h4>
              <p className="mb-3 text-sm text-muted-foreground">{quiz.date}</p>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-6 w-6 overflow-hidden rounded-full border-2 border-background bg-muted">
                      <Image
                        src={`/placeholder.svg?height=24&width=24&text=${i}`}
                        alt="Participant"
                        width={24}
                        height={24}
                      />
                    </div>
                  ))}
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                    +{quiz.participants - 3}
                  </div>
                </div>
                <Button size="sm" asChild>
                  <Link href={`/dashboard/quiz/${quiz.id}`}>Join</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  )
}

const recentQuizzes = [
  {
    id: "1",
    title: "Web Development Fundamentals",
    date: "Completed on Apr 15, 2023",
    icon: BookOpen,
  },
  {
    id: "2",
    title: "JavaScript Advanced Concepts",
    date: "Completed on Apr 10, 2023",
    icon: BookOpen,
  },
  {
    id: "3",
    title: "UI/UX Design Principles",
    date: "Completed on Apr 5, 2023",
    icon: BookOpen,
  },
]

const achievements = [
  {
    id: "1",
    title: "Quiz Master",
    description: "Created 10 quizzes",
    points: 50,
    icon: Award,
  },
  {
    id: "2",
    title: "Perfect Score",
    description: "Scored 100% in a quiz",
    points: 100,
    icon: Trophy,
  },
  {
    id: "3",
    title: "Social Learner",
    description: "Participated in 20 quizzes",
    points: 75,
    icon: Users,
  },
]

const upcomingQuizzes = [
  {
    id: "1",
    title: "React Fundamentals",
    date: "Today, 3:00 PM",
    status: "Upcoming",
    participants: 12,
  },
  {
    id: "2",
    title: "Data Structures",
    date: "Tomorrow, 2:00 PM",
    status: "Scheduled",
    participants: 8,
  },
  {
    id: "3",
    title: "UI/UX Design",
    date: "Apr 25, 10:00 AM",
    status: "Scheduled",
    participants: 15,
  },
]
