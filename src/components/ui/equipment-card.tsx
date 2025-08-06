import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface EquipmentCardProps {
  name: string;
  isSelected: boolean;
  onSelect: () => void;
}

export function EquipmentCard({ name, isSelected, onSelect }: EquipmentCardProps) {
  return (
    <Card 
      className={cn(
        "p-4 cursor-pointer transition-all duration-200 hover:shadow-soft",
        isSelected ? "bg-gradient-hero text-primary-foreground shadow-glow" : "bg-gradient-card hover:bg-secondary"
      )}
      onClick={onSelect}
    >
      <div className="text-sm font-medium text-center">
        {name}
      </div>
    </Card>
  );
}