import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface TimeSlotCardProps {
  time: string;
  isSelected: boolean;
  onSelect: () => void;
}

export function TimeSlotCard({ time, isSelected, onSelect }: TimeSlotCardProps) {
  return (
    <Card 
      className={cn(
        "p-3 cursor-pointer transition-all duration-200 hover:shadow-soft",
        isSelected ? "bg-gradient-hero text-primary-foreground shadow-glow" : "bg-gradient-card hover:bg-secondary"
      )}
      onClick={onSelect}
    >
      <div className="text-sm font-medium text-center">
        {time}
      </div>
    </Card>
  );
}