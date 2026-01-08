"use client";

import { CheckCircle2, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  status: "completed" | "current" | "pending";
}

interface ProgressTimelineProps {
  steps: TimelineStep[];
}

export function ProgressTimeline({ steps }: ProgressTimelineProps) {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div key={step.id} className="flex gap-4">
          {/* Icon */}
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border-2",
                step.status === "completed" &&
                  "border-bangladesh-green bg-bangladesh-green text-white",
                step.status === "current" &&
                  "border-bangladesh-green bg-bangladesh-green/10 text-bangladesh-green animate-pulse",
                step.status === "pending" &&
                  "border-muted-foreground/30 bg-background text-muted-foreground"
              )}
            >
              {step.status === "completed" ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : step.status === "current" ? (
                <Clock className="h-5 w-5" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-full w-0.5 flex-1 mt-2",
                  step.status === "completed"
                    ? "bg-bangladesh-green"
                    : "bg-muted-foreground/20"
                )}
                style={{ minHeight: "40px" }}
              />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 pb-8">
            <h3
              className={cn(
                "font-semibold",
                step.status === "completed" && "text-bangladesh-green",
                step.status === "current" && "text-bangladesh-green",
                step.status === "pending" && "text-muted-foreground"
              )}
            >
              {step.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {step.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

