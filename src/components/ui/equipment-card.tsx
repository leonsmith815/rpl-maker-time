import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface EquipmentCardProps {
  name: string;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

export function EquipmentCard({ name, isSelected, onSelect, disabled = false }: EquipmentCardProps) {
  return (
    <Card 
      className={cn(
        "p-4 transition-all duration-200",
        disabled 
          ? "cursor-not-allowed bg-muted text-muted-foreground opacity-50" 
          : "cursor-pointer hover:shadow-soft",
        !disabled && isSelected ? "bg-gradient-hero text-primary-foreground shadow-glow" : "",
        !disabled && !isSelected ? "bg-gradient-card hover:bg-secondary" : ""
      )}
      onClick={disabled ? undefined : onSelect}
    >
      <div className="text-sm font-medium text-center">
        {name}
      </div>
    </Card>
  );
}