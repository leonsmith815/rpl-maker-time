import { Card, CardContent } from "@/components/ui/card";
import printer3d from "@/assets/3d-printer.jpg";
import laserCutter from "@/assets/laser-cutter.jpg";
import recordingStudio from "@/assets/recording-studio.jpg";
import cncMachine from "@/assets/singer-sewing-machine.jpg";

const equipmentData = [
  {
    name: "3D Printer",
    image: printer3d,
    description: "High-precision 3D printing for prototypes and models"
  },
  {
    name: "DTF Printer", 
    image: "/lovable-uploads/1ed23010-8854-4b8c-88de-4c9cf80c23c7.png",
    description: "Direct-to-film printing for high-quality custom designs on textiles"
  },
  {
    name: "Recording Studio",
    image: recordingStudio,
    description: "Professional audio recording and editing setup"
  },
  {
    name: "Singer Heavy Duty Sewing Machine",
    image: cncMachine,
    description: "Professional-grade sewing machine for fabric and textile projects"
  }
];

export function EquipmentShowcase() {
  const handleSewingMachineClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Sewing machine clicked - navigating to external site');
    window.location.href = 'https://services.rockfordpubliclibrary.org/events?r=thismonth';
  };

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
          {equipmentData.map((equipment, index) => {
            if (equipment.name === "Singer Heavy Duty Sewing Machine") {
              return (
                <button
                  key={equipment.name}
                  onClick={handleSewingMachineClick}
                  className="group overflow-hidden bg-gradient-card border-border/50 hover:shadow-glow transition-all duration-300 cursor-pointer rounded-lg border text-left w-full p-0"
                >
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={equipment.image}
                      alt={equipment.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{equipment.name}</h3>
                    <p className="text-sm text-muted-foreground">{equipment.description}</p>
                    <p className="text-xs text-primary mt-2 font-medium">
                      Click to book appointment →
                    </p>
                  </div>
                </button>
              );
            }
            
            return (
              <Card 
                key={equipment.name} 
                className="group overflow-hidden bg-gradient-card border-border/50 hover:shadow-glow transition-all duration-300"
              >
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
            );
          })}
        </div>
      </div>
    </div>
  );
}