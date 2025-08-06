import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

export function HoursCard() {
  return (
    <Card className="bg-gradient-card shadow-soft">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-primary" />
          <CardTitle className="text-xl">Maker Lab Hours</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Monday – Thursday:</span>
          <span className="font-semibold">11:00 AM to 7:00 PM</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Friday – Saturday:</span>
          <span className="font-semibold">11:00 AM to 4:00 PM</span>
        </div>
      </CardContent>
    </Card>
  );
}