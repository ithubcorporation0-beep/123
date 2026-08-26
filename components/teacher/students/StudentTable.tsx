"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, Search, User, Users, X } from "lucide-react";

export interface StudentEnrollmentRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentAvatar?: string | null;
  courseId: string;
  courseTitle: string;
  enrolledAt: Date | string;
  completedChapters: number;
  totalChapters: number;
  progressPercent: number;
}

interface StudentTableProps {
  enrollments: StudentEnrollmentRecord[];
}

export function StudentTable({ enrollments }: StudentTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAsc, setSortAsc] = useState(false);

  const filteredAndSorted = useMemo(() => {
    let list = [...enrollments];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (item) =>
          item.studentName.toLowerCase().includes(q) ||
          item.studentEmail.toLowerCase().includes(q) ||
          item.courseTitle.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      const dateA = new Date(a.enrolledAt).getTime();
      const dateB = new Date(b.enrolledAt).getTime();
      return sortAsc ? dateA - dateB : dateB - dateA;
    });

    return list;
  }, [enrollments, searchTerm, sortAsc]);

  return (
    <div className="space-y-4">
      {/* Search and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name or course..."
            className="pl-10 pr-9 rounded-2xl h-10 text-xs bg-card border shadow-xs"
          />
          {searchTerm && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setSearchTerm("")}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full text-muted-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        <Button
          onClick={() => setSortAsc((prev) => !prev)}
          variant="outline"
          size="sm"
          className="rounded-2xl text-xs gap-1.5 font-medium ml-auto"
        >
          <ArrowUpDown className="h-3.5 w-3.5" />
          Sort by Date ({sortAsc ? "Oldest First" : "Newest First"})
        </Button>
      </div>

      {/* Enrollments Table */}
      {filteredAndSorted.length > 0 ? (
        <div className="rounded-3xl border bg-card shadow-xs overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="text-xs font-bold">Student</TableHead>
                <TableHead className="text-xs font-bold">Enrolled Course</TableHead>
                <TableHead className="text-xs font-bold">Enrolled Date</TableHead>
                <TableHead className="text-xs font-bold">Course Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSorted.map((item) => {
                const formattedDate = new Date(item.enrolledAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <TableRow key={item.id} className="hover:bg-muted/10 transition-colors">
                    {/* Student Info */}
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-9 h-9 rounded-full overflow-hidden border bg-muted flex items-center justify-center shrink-0">
                          {item.studentAvatar ? (
                            <Image src={item.studentAvatar} alt={item.studentName} fill className="object-cover" />
                          ) : (
                            <User className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground leading-snug">{item.studentName}</p>
                          <p className="text-xs text-muted-foreground">{item.studentEmail}</p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Course Title */}
                    <TableCell className="py-4">
                      <Badge variant="secondary" className="font-semibold text-xs max-w-[200px] truncate block">
                        {item.courseTitle}
                      </Badge>
                    </TableCell>

                    {/* Enrolled Date */}
                    <TableCell className="py-4 text-xs font-medium text-muted-foreground">
                      {formattedDate}
                    </TableCell>

                    {/* Progress */}
                    <TableCell className="py-4 max-w-[200px]">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                          <span className="text-foreground">{item.progressPercent}%</span>
                          <span>{item.completedChapters}/{item.totalChapters} lessons</span>
                        </div>
                        <Progress value={item.progressPercent} className="h-1.5 rounded-full" />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="py-12">
          <EmptyState
            icon={Users}
            title="No student records found"
            description={searchTerm ? "No students matching your search query." : "No learners have enrolled in your courses yet."}
          />
        </div>
      )}
    </div>
  );
}
