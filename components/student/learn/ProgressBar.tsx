import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  completed: number;
  total: number;
}

export function ProgressBar({ completed, total }: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
        <span>{completed} of {total} complete</span>
        <span className="text-primary font-bold">{percentage}%</span>
      </div>
      <Progress value={percentage} className="h-2 rounded-full" />
    </div>
  );
}
