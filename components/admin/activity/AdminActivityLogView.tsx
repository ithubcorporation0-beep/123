"use client";

import { useState } from "react";
import {
  Activity,
  Search,
  Clock,
  Filter,
  User,
  Shield,
  Layers,
  FileText,
  Settings,
  HardDrive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface LogItem {
  id: string;
  adminEmail: string;
  action: string;
  targetType: string;
  targetId?: string | null;
  details?: string | null;
  createdAt: Date | string;
}

interface AdminActivityLogViewProps {
  initialLogs: LogItem[];
}

export function AdminActivityLogView({ initialLogs }: AdminActivityLogViewProps) {
  const [logs] = useState<LogItem[]>(initialLogs);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = logs.filter((log) => {
    const q = search.toLowerCase();
    const matchesSearch =
      log.adminEmail.toLowerCase().includes(q) ||
      (log.details && log.details.toLowerCase().includes(q)) ||
      log.targetType.toLowerCase().includes(q);

    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    const matchesType = typeFilter === "all" || log.targetType === typeFilter;

    return matchesSearch && matchesAction && matchesType;
  });

  const getActionBadge = (action: string) => {
    switch (action) {
      case "CREATE":
        return <Badge className="bg-emerald-600 text-white text-[10px] uppercase font-bold">CREATE</Badge>;
      case "UPDATE":
        return <Badge className="bg-blue-600 text-white text-[10px] uppercase font-bold">UPDATE</Badge>;
      case "DELETE":
        return <Badge className="bg-rose-600 text-white text-[10px] uppercase font-bold">DELETE</Badge>;
      case "UPLOAD":
        return <Badge className="bg-amber-600 text-white text-[10px] uppercase font-bold">UPLOAD</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px] uppercase font-bold">{action}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-card border shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search details or admin email..."
              className="pl-8 h-8 rounded-xl text-xs bg-background"
            />
          </div>

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="h-8 px-2.5 rounded-xl border bg-background text-xs"
          >
            <option value="all">All Actions</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
            <option value="UPLOAD">UPLOAD</option>
            <option value="SETTING_CHANGE">SETTINGS</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-8 px-2.5 rounded-xl border bg-background text-xs"
          >
            <option value="all">All Resource Types</option>
            <option value="course">Courses</option>
            <option value="module">Modules</option>
            <option value="lesson">Lessons</option>
            <option value="user">Users</option>
            <option value="media">Media</option>
            <option value="content">Website Content</option>
            <option value="setting">Settings</option>
            <option value="enrollment">Enrollments</option>
            <option value="certificate">Certificates</option>
          </select>
        </div>

        <span className="text-xs text-muted-foreground font-medium">
          Showing {filtered.length} of {logs.length} events
        </span>
      </div>

      {/* Activity Table */}
      <div className="rounded-2xl border overflow-hidden bg-card shadow-xs">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="text-xs font-bold w-28">Action</TableHead>
              <TableHead className="text-xs font-bold w-28">Resource</TableHead>
              <TableHead className="text-xs font-bold">Event Details</TableHead>
              <TableHead className="text-xs font-bold">Admin Operator</TableHead>
              <TableHead className="text-xs font-bold text-right">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-xs text-muted-foreground">
                  No activity log entries found matching filters.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((log) => (
                <TableRow key={log.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="py-3">
                    {getActionBadge(log.action)}
                  </TableCell>

                  <TableCell className="py-3">
                    <Badge variant="outline" className="text-[10px] uppercase font-mono">
                      {log.targetType}
                    </Badge>
                  </TableCell>

                  <TableCell className="py-3 text-xs font-medium text-foreground">
                    {log.details || `Operation on ${log.targetType} (${log.targetId || "N/A"})`}
                  </TableCell>

                  <TableCell className="py-3 text-xs text-muted-foreground font-mono">
                    {log.adminEmail}
                  </TableCell>

                  <TableCell className="py-3 text-xs text-muted-foreground text-right whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
