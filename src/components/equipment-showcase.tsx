import { Card, CardContent } from "@/components/ui/card";
import printer3d from "@/assets/3d-printer.jpg";
import laserCutter from "@/assets/laser-cutter.jpg";
import recordingStudio from "@/assets/recording-studio.jpg";
import cncMachine from "@/assets/cnc-machine.jpg";

const equipmentData = [
  {
    name: "3D Printer",
    image: printer3d,
    description: "High-precision 3D printing for prototypes and models"
  },
  {
    name: "Laser Cutter", 
    image: laserCutter,
    description: "Precision cutting and engraving for various materials"
  },
  {
    name: "Recording Studio",
    image: recordingStudio,
    description: "Professional audio recording and editing setup"
  },
  {
    name: "CNC Machine",
    image: cncMachine,
    description: "Computer-controlled machining for precise parts"
  }
];

export function EquipmentShowcase() {
  return (
    <div className="py-16 bg-gradient-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
            State-of-the-Art Equipment
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access professional-grade tools and technology to bring your creative vision to life
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {equipmentData.map((equipment, index) => (
            <Card key={equipment.name} className="group overflow-hidden bg-gradient-card border-border/50 hover:shadow-glow transition-all duration-300">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={equipment.image}
                  alt={equipment.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{equipment.name}</h3>
                <p className="text-sm text-muted-foreground">{equipment.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}