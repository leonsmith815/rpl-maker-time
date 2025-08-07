import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface TimeSlotCardProps {
  time: string;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

export function TimeSlotCard({ time, isSelected, onSelect, disabled = false }: TimeSlotCardProps) {
  return (
    <Card 
      className={cn(
        "p-3 transition-all duration-200",
        disabled 
          ? "cursor-not-allowed bg-muted text-muted-foreground opacity-50" 
          : "cursor-pointer hover:shadow-soft",
        !disabled && isSelected ? "bg-gradient-hero text-primary-foreground shadow-glow" : "",
        !disabled && !isSelected ? "bg-gradient-card hover:bg-secondary" : ""
      )}
      onClick={disabled ? undefined : onSelect}
    >
      <div className="text-sm font-medium text-center">
        {time}
      </div>
    </Card>
  );
}