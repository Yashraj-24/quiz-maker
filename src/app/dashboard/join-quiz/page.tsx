"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, GradientButton } from "@/app/components/ui-components"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, ArrowRight, Clock, Loader2, Search } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { api } from "@/trpc/react"

interface QuizData {
  id: string
  title: string
  creator: string
  duration: number
  questionCount: number
  startTime: Date
  status: "active" | "upcoming" | "completed"
}

export default function JoinQuizPage() {
  const router = useRouter()
  const [quizCode, setQuizCode] = useState("")
  const [debouncedQuizCode, setDebouncedQuizCode] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Debounce the quiz code input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuizCode(quizCode)
    }, 500)

    return () => clearTimeout(timer)
  }, [quizCode])

  const {
    data: quizData,
    isLoading,
    isError,
    refetch,
  } = api.quiz.getQuizByCode.useQuery(
    { code: debouncedQuizCode },
    {
      enabled: debouncedQuizCode.length > 0,
      retry: false,
      refetchOnWindowFocus: false,
    }
  )

  const username = api.auth.getUserById.useQuery(quizData?.creatorId || "", {
    enabled: !!quizData?.creatorId,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!quizCode.trim()) return

    setIsSubmitting(true)
    try {
      await refetch()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStartQuiz = () => {
    if (quizData) {
      router.push(`/quiz/${quizData.id}`)
    }
  }

  const statusVariant = {
    active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    upcoming: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    completed: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Join Quiz</h1>
        <p className="text-muted-foreground">Enter a quiz code to join an active quiz session.</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quiz-code">Quiz Code</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="quiz-code"
                placeholder="Enter quiz code (e.g., QUIZ123)"
                className="pl-10"
                value={quizCode}
                onChange={(e) => setQuizCode(e.target.value.trim().toUpperCase())}
                required
                maxLength={10}
                pattern="[A-Z0-9]+"
                title="Only uppercase letters and numbers allowed"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              The quiz code is provided by your instructor or quiz creator.
            </p>
          </div>

          <GradientButton type="submit" disabled={isLoading || isSubmitting}>
            {(isLoading || isSubmitting) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              "Search Quiz"
            )}
          </GradientButton>
        </form>
      </Card>

      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Quiz Not Found</AlertTitle>
          <AlertDescription>
            We couldn't find a quiz with the code "{quizCode}". Please check the code and try again.
          </AlertDescription>
        </Alert>
      )}

      {quizData && (
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-medium">Quiz Found</h2>

          <div className="mb-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Quiz Title</p>
                <p className="font-medium">{quizData.title}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created By</p>
                <p className="font-medium">{username.data?.name || "Unknown"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Subject</p>
                <p className="font-medium">{quizData.subject}</p>
              </div>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Start Time</p>
                  <p className="text-sm text-muted-foreground">
                    {quizData.startTime.toLocaleString()}
                  </p>
                </div>
                {/* <div className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-medium ${statusVariant[quizData.status]}`}>
                  {quizData.status.charAt(0).toUpperCase() + quizData.status.slice(1)}
                </div> */}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => setQuizCode("")}>
              Cancel
            </Button>
            <GradientButton
              onClick={handleStartQuiz}
            //   disabled={quizData.status !== "active"}
            >
              Start Quiz
              <ArrowRight className="ml-2 h-4 w-4" />
            </GradientButton>
          </div>
        </Card>
      )}

      {/* <RecentQuizzesSection /> */}
    </div>
  )
}

// function RecentQuizzesSection() {
//   const router = useRouter()
//   const { data: recentQuizzes, isLoading } = api.quiz.getRecentQuiz.useQuery(userId)

//   if (isLoading) {
//     return (
//       <div className="rounded-lg border p-6">
//         <Loader2 className="mx-auto h-6 w-6 animate-spin" />
//       </div>
//     )
//   }

//   if (!recentQuizzes || recentQuizzes.length === 0) return null

//   return (
//     <div className="rounded-lg border p-6">
//       <h2 className="mb-4 text-lg font-medium">Recent Quizzes</h2>
//       <div className="space-y-4">
//         {recentQuizzes.map((quiz) => (
//           <Card key={quiz.id} className="p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h3 className="font-medium">{quiz.title}</h3>
//                 <p className="text-sm text-muted-foreground">
//                   Completed on {new Date(quiz.completedAt).toLocaleDateString()}
//                 </p>
//               </div>
//               <Button
//                 size="sm"
//                 variant="outline"
//                 onClick={() => router.push(`/dashboard/quiz/${quiz.id}`)}
//               >
//                 View Results
//               </Button>
//             </div>
//           </Card>
//         ))}
//       </div>
//     </div>
//   )
// }