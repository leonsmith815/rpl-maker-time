import { ContactForm } from "@/components/contact-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="flex justify-between items-center p-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Maker Lab
        </Button>
        
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
      <div className="bg-gradient-hero text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/004a9351-90ac-46eb-a06c-85b258b488e8.png" 
              alt="Rockford Public Library" 
              className="h-16 md:h-20 rounded-xl"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Get in Touch
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto">
            Questions about the Maker Lab? We're here to help!
          </p>
        </div>
      </div>

      {/* Contact Form */}
      <div className="container mx-auto px-4 py-12">
        <ContactForm />
      </div>

      {/* Additional Info */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="text-center">
            <h3 className="font-semibold text-lg mb-2">Visit Us</h3>
            <p className="text-muted-foreground">
              Rockford Public Library<br />
              Maker Lab
            </p>
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-lg mb-2">Email</h3>
            <p className="text-muted-foreground">
              makerlab@rpl.org
            </p>
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-lg mb-2">Hours</h3>
            <p className="text-muted-foreground">
              Check our main page<br />
              for current hours
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;