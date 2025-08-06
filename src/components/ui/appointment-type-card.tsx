import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface AppointmentTypeCardProps {
  title: string;
  description: string;
  isSelected: boolean;
  onSelect: () => void;
}

export function AppointmentTypeCard({ title, description, isSelected, onSelect }: AppointmentTypeCardProps) {
  return (
    <Card 
      className={cn(
        "p-6 cursor-pointer transition-all duration-200 hover:shadow-soft",
        isSelected ? "bg-gradient-hero text-primary-foreground shadow-glow" : "bg-gradient-card hover:bg-secondary/10"
      )}
      onClick={onSelect}
    >
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className={cn(
          "text-sm",
          isSelected ? "text-primary-foreground/90" : "text-muted-foreground"
        )}>
          {description}
        </p>
      </div>
    </Card>
  );
}