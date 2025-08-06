import { MakerLabForm } from "@/components/maker-lab-form";
import { HoursCard } from "@/components/hours-card";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-hero text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Logo */}
            <img 
              src="/lovable-uploads/1f2ee43c-4a59-4332-9d94-f6f88c2b19fa.png" 
              alt="Rockford Public Library Logo"
              className="h-20 md:h-24 object-contain"
            />
            
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Maker Lab
              </h1>
              <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto">
                Where Innovation Meets Creation
              </p>
              <p className="text-lg text-primary-foreground/80 mt-4 max-w-3xl mx-auto">
                Access cutting-edge equipment including 3D printers, laser cutters, recording studios, and more. 
                Book training sessions or maker lab time to bring your ideas to life.
              </p>
            </div>
          </div>
        </div>
      </div>

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
