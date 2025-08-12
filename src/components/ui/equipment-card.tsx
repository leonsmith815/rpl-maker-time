import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface EquipmentCardProps {
  name: string;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  externalLink?: string;
}

export function EquipmentCard({ name, isSelected, onSelect, disabled = false, externalLink }: EquipmentCardProps) {
  const handleClick = () => {
    if (externalLink) {
      window.open(externalLink, '_blank');
    } else {
      onSelect();
    }
  };

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
      onClick={disabled ? undefined : handleClick}
    >
      <div className="text-sm font-medium text-center">
        {name}
        {externalLink && (
          <span className="block text-xs opacity-75 mt-1">
            Click to visit external site →
          </span>
        )}
      </div>
    </Card>
  );
}