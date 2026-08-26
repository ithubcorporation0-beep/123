"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart3, TrendingUp } from "lucide-react";

export interface DayData {
  date: string;
  enrollments: number;
}

export interface CourseAnalyticsBreakdown {
  id: string;
  title: string;
  isPublished: boolean;
  totalStudents: number;
  totalChapters: number;
  averageCompletion: number;
}

interface EnrollmentChartProps {
  dailyData: DayData[];
  coursesBreakdown: CourseAnalyticsBreakdown[];
}

export function EnrollmentChart({
  dailyData,
  coursesBreakdown,
}: EnrollmentChartProps) {
  const totalEnrollmentsPeriod = dailyData.reduce((acc, d) => acc + d.enrollments, 0);

  return (
    <div className="space-y-8">
      {/* 30-Day Enrollment Chart */}
      <Card className="rounded-3xl border bg-card shadow-xs">
        <CardHeader className="p-6 pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold">Enrollment Trends (Last 30 Days)</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Daily student registrations across all your published courses
            </p>
          </div>
          <Badge variant="secondary" className="gap-1 font-bold text-xs">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            {totalEnrollmentsPeriod} New Learners
          </Badge>
        </CardHeader>

        <CardContent className="p-6 pt-4">
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="enrollmentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={11}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={11}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-2xl border bg-popover p-3 shadow-md text-xs">
                          <p className="font-bold text-popover-foreground">{payload[0].payload.date}</p>
                          <p className="text-primary font-semibold mt-1">
                            {payload[0].value} {payload[0].value === 1 ? "enrollment" : "enrollments"}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="enrollments"
                  stroke="var(--primary)"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#enrollmentGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Per-Course Analytics Breakdown Table */}
      <Card className="rounded-3xl border bg-card shadow-xs overflow-hidden">
        <CardHeader className="p-6 pb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-bold">Course Performance Breakdown</CardTitle>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Detailed completion and enrollment statistics for each of your courses
          </p>
        </CardHeader>

        <CardContent className="p-6 pt-0">
          {coursesBreakdown.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="text-xs font-bold">Course Title</TableHead>
                  <TableHead className="text-xs font-bold">Status</TableHead>
                  <TableHead className="text-xs font-bold">Total Students</TableHead>
                  <TableHead className="text-xs font-bold">Avg. Completion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coursesBreakdown.map((c) => (
                  <TableRow key={c.id} className="hover:bg-muted/10 transition-colors">
                    <TableCell className="py-4 font-bold text-sm text-foreground">
                      {c.title}
                    </TableCell>

                    <TableCell className="py-4">
                      <Badge variant={c.isPublished ? "default" : "secondary"} className="text-[10px] uppercase font-bold">
                        {c.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>

                    <TableCell className="py-4 text-xs font-semibold">
                      {c.totalStudents} {c.totalStudents === 1 ? "student" : "students"}
                    </TableCell>

                    <TableCell className="py-4 max-w-[200px]">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                          <span className="text-foreground">{c.averageCompletion}%</span>
                          <span>{c.totalChapters} lessons</span>
                        </div>
                        <Progress value={c.averageCompletion} className="h-1.5 rounded-full" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-xs text-muted-foreground py-6 text-center">
              No courses created yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
