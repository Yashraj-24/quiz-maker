"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, GradientButton, EmptyState } from "@/app/components/ui-components"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BookOpen, ChevronDown, Copy, Edit, Eye, MoreHorizontal, PlusCircle, Search, Trash2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {api} from "@/trpc/react"

export default function MyQuizzesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedQuizzes, setSelectedQuizzes] = useState<string[]>([])

  const getSession = api.auth.getSession.useQuery();
  const getAllQuizzes = api.quiz.getAllQuiz.useQuery(getSession.data?.user?.id!, {
    enabled: !!getSession.data?.user?.id,
  })

  const filteredQuizzes = (getAllQuizzes.data || []).filter((quiz) => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
    // const matchesStatus = selectedStatus === "all" || quiz.status === selectedStatus
    return matchesSearch
  })
    console.log(getAllQuizzes.data)

  const handleSelectQuiz = (quizId: string) => {
    if (selectedQuizzes.includes(quizId)) {
      setSelectedQuizzes(selectedQuizzes.filter((id) => id !== quizId))
    } else {
      setSelectedQuizzes([...selectedQuizzes, quizId])
    }
  }

  const handleSelectAll = () => {
    if (selectedQuizzes.length === filteredQuizzes.length) {
      setSelectedQuizzes([])
    } else {
      setSelectedQuizzes(filteredQuizzes.map((quiz) => quiz.id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Quizzes</h1>
          <p className="text-muted-foreground">
            Manage all your quizzes in one place. Create, edit, and track your quizzes.
          </p>
        </div>
        <GradientButton asChild>
          <Link href="/dashboard/create-quiz">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Quiz
          </Link>
        </GradientButton>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="all">All Quizzes</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <Card className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"></div>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search quizzes..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {/* <div className="flex gap-2">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      Sort
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Newest First</DropdownMenuItem>
                    <DropdownMenuItem>Oldest First</DropdownMenuItem>
                    <DropdownMenuItem>A-Z</DropdownMenuItem>
                    <DropdownMenuItem>Z-A</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div> */}

            {filteredQuizzes.length === 0 ? (
              <EmptyState
                title="No quizzes found"
                description="Try adjusting your search or filter to find what you're looking for."
                icon={BookOpen}
                action={
                  <Button asChild>
                    <Link href="/dashboard/create-quiz">Create Quiz</Link>
                  </Button>
                }
              />
            ) : (
              <div className="mt-6">
                <div className="mb-4 flex items-center">
                  <Checkbox
                    id="select-all"
                    checked={
                      selectedQuizzes.length === getAllQuizzes.data?.length &&
                      getAllQuizzes.data?.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                  <label htmlFor="select-all" className="ml-2 text-sm font-medium">
                    Select All
                  </label>
                  {selectedQuizzes.length > 0 && (
                    <div className="ml-auto flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {selectedQuizzes.length} selected
                      </span>
                      <Button variant="outline" size="sm">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {getAllQuizzes.data?.map((quiz) => (
                    <div
                      key={quiz.title}
                      className="flex flex-col rounded-lg border p-4 transition-all hover:shadow-sm sm:flex-row sm:items-center"
                    >
                      <div className="flex items-center gap-4">
                        <Checkbox
                          id={`quiz-${quiz.id}`}
                          checked={selectedQuizzes.includes(quiz.id)}
                          onCheckedChange={() => handleSelectQuiz(quiz.id)}
                        />
                        <div className="rounded-lg bg-primary/10 p-2 text-primary">
                          <BookOpen className="h-5 w-5" />
                        </div>
                      </div>

                      <div className="ml-0 mt-4 flex-1 sm:ml-4 sm:mt-0">
                        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                          <div>
                            <h3 className="font-medium">{quiz.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {/* {quiz.questions} questions • {quiz.duration} */}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {/* <Badge
                              variant={
                                quiz.status === "active"
                                  ? "default"
                                  : quiz.status === "draft"
                                  ? "outline"
                                  : "secondary"
                              }
                              className={
                                quiz.status === "active"
                                  ? "bg-green-500"
                                  : quiz.status === "completed"
                                  ? "bg-blue-500"
                                  : ""
                              }
                            >
                              {quiz.status.charAt(0).toUpperCase() + quiz.status.slice(1)}
                            </Badge> */}
                            {/* <p className="text-sm text-muted-foreground">{quiz.date}</p> */}
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Eye className="h-4 w-4" />
                            {/* <span>{quiz.views} views</span> */}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                              <circle cx="9" cy="7" r="4" />
                              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                            {/* <span>{quiz.participants} participants</span> */}
                          </div>
                          <div className="ml-auto flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/dashboard/quiz/${quiz.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </Link>
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">More options</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Copy className="mr-2 h-4 w-4" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <Card className="p-6">
            <EmptyState
              title="No active quizzes"
              description="You don't have any active quizzes at the moment. Create a new quiz to get started."
              icon={BookOpen}
              action={
                <Button asChild>
                  <Link href="/dashboard/create-quiz">Create Quiz</Link>
                </Button>
              }
            />
          </Card>
        </TabsContent>

        <TabsContent value="draft">
          <Card className="p-6">
            <EmptyState
              title="No draft quizzes"
              description="You don't have any quizzes in draft. Create a new quiz to get started."
              icon={BookOpen}
              action={
                <Button asChild>
                  <Link href="/dashboard/create-quiz">Create Quiz</Link>
                </Button>
              }
            />
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card className="p-6">
            <EmptyState
              title="No completed quizzes"
              description="You don't have any completed quizzes at the moment."
              icon={BookOpen}
              action={
                <Button asChild>
                  <Link href="/dashboard/create-quiz">Create Quiz</Link>
                </Button>
              }
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
