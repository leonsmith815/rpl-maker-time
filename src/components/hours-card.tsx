import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { StatusIndicator } from "@/components/status-indicator";

export function HoursCard() {
  return (
    <Card className="bg-gradient-section shadow-urban border-0 overflow-hidden relative group hover:shadow-float transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-cyber opacity-5 group-hover:opacity-10 transition-opacity duration-500" />
      
      <CardHeader className="relative text-center pb-4">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
            <Clock className="w-6 h-6 text-primary animate-glow-pulse" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-cyber bg-clip-text text-transparent">
            Lab Hours
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="relative space-y-6 pb-6">
        <div className="space-y-4">
          <div className="group/item p-4 rounded-xl bg-background/50 border border-border/50 hover:border-primary/30 transition-all duration-300">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground font-medium">Monday – Thursday</span>
              <span className="font-bold text-lg bg-gradient-hero bg-clip-text text-transparent">
                11:00 AM – 7:00 PM
              </span>
            </div>
          </div>
          
          <div className="group/item p-4 rounded-xl bg-background/50 border border-border/50 hover:border-primary/30 transition-all duration-300">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground font-medium">Friday – Saturday</span>
              <span className="font-bold text-lg bg-gradient-hero bg-clip-text text-transparent">
                11:00 AM – 4:00 PM
              </span>
            </div>
          </div>

          <div className="group/item p-4 rounded-xl bg-background/50 border border-border/50 hover:border-primary/30 transition-all duration-300">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground font-medium">Sunday</span>
              <span className="font-bold text-lg bg-gradient-hero bg-clip-text text-transparent">
                Closed
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-center pt-2">
          <StatusIndicator />
        </div>
      </CardContent>
    </Card>
  );
}