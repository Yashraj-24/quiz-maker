"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, GradientButton } from "@/app/components/ui-components"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, Loader2, Plus, Trash } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { api } from "@/trpc/react"
import { toast, Toaster } from "sonner"
import {jwtDecode} from "jwt-decode"

type JwtPayload = { userId: string };

export default function CreateQuizPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  
  // Get user data using the userId from JWT
  const { data: user, isLoading: isUserLoading } = api.auth.getUserById.useQuery(userId!, {
    enabled: !!userId,
  });

  const [tokenChecked, setTokenChecked] = useState(false);

  const createQuiz = api.quiz.createQuiz.useMutation({
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      toast.success("Quiz created successfully!")
      router.push("/dashboard")
    }
  })



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
  }, [router]);

  const [quizDetails, setQuizDetails] = useState({
    title: "",
    subject: "",
    code: "",
    startDate: "",
    startTime: "",
    duration: 30,
  })

  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: "",
      options: ["", "", ""],
      answer: "",
    },
  ])

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: questions.length + 1,
        text: "",
        options: ["", "", ""],
        answer: "",
      },
    ])
  }

  const removeQuestion = (id: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id))
    }
  }

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const updatedQuestions = [...questions]
    if (updatedQuestions[qIndex]) {
      updatedQuestions[qIndex].options[oIndex] = value
    }
    setQuestions(updatedQuestions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check if token is verified and user data is loaded
    if (!userId || !user) {
      toast.error("You must be logged in to create a quiz")
      return
    }

    // Validate quiz details
    if (!quizDetails.title || !quizDetails.code || !quizDetails.startDate || !quizDetails.startTime) {
      toast.error("Please fill all required quiz details")
      return
    }

    // Validate questions
    for (const question of questions) {
      if (!question.text.trim()) {
        toast.error("All questions must have text")
        return
      }

      const validOptions = question.options.filter(opt => opt.trim() !== "")
      if (validOptions.length < 2) {
        toast.error("Each question needs at least 2 options")
        return
      }

      if (!question.answer || !validOptions.includes(question.answer)) {
        toast.error("Please select a valid answer for each question")
        return
      }
    }

    try {
      const startTime = new Date(`${quizDetails.startDate}T${quizDetails.startTime}`)
      const endTime = new Date(startTime.getTime() + quizDetails.duration * 60000)

      await createQuiz.mutateAsync({
        title: quizDetails.title,
        subject: quizDetails.subject || "general",
        code: quizDetails.code,
        creatorId: user.id, // Use the user.id from the query
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        questions: questions.map(q => ({
          text: q.text,
          options: q.options.filter(opt => opt.trim() !== ""),
          answer: q.answer,
        })),
      })
    } catch (error) {
      console.error("Quiz creation error:", error)
      toast.error("Failed to create quiz. Please try again.")
    }
  }

  // Show loading state while checking token or user data
  if (!tokenChecked || isUserLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // Redirect if not authenticated
  if (!userId || !user) {
    router.push("/auth")
    return null
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-center" />
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create Quiz</h1>
        <p className="text-muted-foreground">Create a new quiz by filling out the form below.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-medium">Quiz Details</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Quiz Title</Label>
              <Input 
                id="title" 
                placeholder="Enter quiz title" 
                required 
                value={quizDetails.title}
                onChange={(e) => setQuizDetails({...quizDetails, title: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select
                value={quizDetails.subject}
                onValueChange={(value) => setQuizDetails({...quizDetails, subject: value})}
                required
              >
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="math">Mathematics</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="history">History</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="programming">Programming</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Quiz Code</Label>
              <Input 
                id="code" 
                placeholder="Enter unique quiz code" 
                required 
                value={quizDetails.code}
                onChange={(e) => setQuizDetails({...quizDetails, code: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="start-date" 
                  type="date" 
                  className="pl-10" 
                  required
                  value={quizDetails.startDate}
                  onChange={(e) => setQuizDetails({...quizDetails, startDate: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="start-time">Start Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="start-time" 
                  type="time" 
                  className="pl-10" 
                  required
                  value={quizDetails.startTime}
                  onChange={(e) => setQuizDetails({...quizDetails, startTime: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input 
                id="duration" 
                type="number" 
                min="1" 
                placeholder="30" 
                value={quizDetails.duration}
                onChange={(e) => setQuizDetails({...quizDetails, duration: parseInt(e.target.value) || 30})}
              />
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Questions</h2>
            <Button type="button" onClick={addQuestion} variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Question
            </Button>
          </div>

          {questions.map((question, qIndex) => (
            <Card key={question.id} className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-medium">Question {qIndex + 1}</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeQuestion(question.id)}
                  disabled={questions.length === 1}
                >
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Remove question</span>
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`question-${question.id}`}>Question Text</Label>
                  <Textarea 
                    id={`question-${question.id}`} 
                    placeholder="Enter your question" 
                    required 
                    value={question.text}
                    onChange={(e) => {
                      const newQuestions = [...questions]
                      if (newQuestions[qIndex]) {
                        newQuestions[qIndex].text = e.target.value
                      }
                      setQuestions(newQuestions)
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Options</Label>
                  <RadioGroup 
                    value={question.answer}
                    onValueChange={(value) => {
                      const newQuestions = [...questions]
                      if (newQuestions[qIndex]) {
                        newQuestions[qIndex].answer = value
                      }
                      setQuestions(newQuestions)
                    }}
                  >
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-start space-x-2">
                        <RadioGroupItem 
                          value={option} 
                          id={`q${question.id}-option-${oIndex}`} 
                          disabled={!option.trim()}
                        />
                        <div className="flex-1 space-y-1">
                          <Input 
                            placeholder={`Option ${oIndex + 1}`} 
                            required 
                            value={option}
                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" asChild>
            <Link href="/dashboard">Cancel</Link>
          </Button>
          <GradientButton type="submit" >
            Create Quiz
          </GradientButton>
        </div>
      </form>
    </div>
  )
}