import { MakerLabForm } from "@/components/maker-lab-form";
import { HoursCard } from "@/components/hours-card";
import { EquipmentShowcase } from "@/components/equipment-showcase";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Access Button */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin-auth")}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <Shield className="w-4 h-4" />
          Admin
        </Button>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-hero text-primary-foreground py-16 relative">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/004a9351-90ac-46eb-a06c-85b258b488e8.png" 
              alt="Rockford Public Library" 
              className="h-16 md:h-20 rounded-xl"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            RPL Maker Lab
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto">
            Where Innovation Meets Creation
          </p>
          <p className="text-lg text-primary-foreground/80 mt-4 max-w-3xl mx-auto">
            Access cutting-edge equipment including 3D printers, laser cutters, recording studios, and more. 
            Book your time slot and bring your ideas to life.
          </p>
        </div>
      </div>

      {/* Equipment Showcase */}
      <EquipmentShowcase />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Hours Card */}
          <div className="lg:col-span-1">
            <HoursCard />
          </div>
          
          {/* Main Form */}
          <div className="lg:col-span-3">
            <MakerLabForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
