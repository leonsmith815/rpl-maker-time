import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TimeSlotCard } from "@/components/ui/time-slot-card";
import { EquipmentCard } from "@/components/ui/equipment-card";
import { AppointmentTypeCard } from "@/components/ui/appointment-type-card";
import { useToast } from "@/hooks/use-toast";

const timeSlots = [
  "Tuesday 11 AM - 1 PM",
  "Tuesday 2 PM - 4 PM", 
  "Wednesday 11 AM - 1 PM",
  "Thursday 11 AM - 1 PM",
  "Thursday 2 PM - 4 PM",
  "Friday 11 AM - 1 PM",
  "Friday 2 PM - 4 PM"
];

const equipment = [
  "Cricut Make",
  "Laser Cutter", 
  "3D Printers",
  "Embroidery Machine",
  "Sewing Machines",
  "Brother Serger",
  "Direct-to-Film (DTF) Printer",
  "Media Room (Green Screen)",
  "Recording Studio (Podcast)"
];

export function MakerLabForm() {
  const [appointmentType, setAppointmentType] = useState<string>("");
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    currentDate: "",
    email: "",
    phone: ""
  });
  const { toast } = useToast();

  const handleTimeSlotSelect = (slot: string) => {
    if (selectedTimeSlots.includes(slot)) {
      setSelectedTimeSlots(prev => prev.filter(s => s !== slot));
    } else if (selectedTimeSlots.length < 3) {
      setSelectedTimeSlots(prev => [...prev, slot]);
    } else {
      toast({
        title: "Maximum 3 time slots",
        description: "Please select only 3 preferred time slots.",
        variant: "destructive"
      });
    }
  };

  const handleEquipmentSelect = (item: string) => {
    if (selectedEquipment.includes(item)) {
      setSelectedEquipment(prev => prev.filter(e => e !== item));
    } else {
      setSelectedEquipment(prev => [...prev, item]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!appointmentType) {
      toast({
        title: "Please select appointment type",
        description: "You must choose either Training or Maker Lab Appointment.",
        variant: "destructive"
      });
      return;
    }

    if (selectedTimeSlots.length !== 3) {
      toast({
        title: "Please select 3 time slots",
        description: "You must select exactly 3 preferred time slots.",
        variant: "destructive"
      });
      return;
    }

    if (appointmentType === "maker-lab" && selectedEquipment.length === 0) {
      toast({
        title: "Please select equipment",
        description: "You must select at least one piece of equipment.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.name || !formData.email || !formData.phone || !formData.currentDate) {
      toast({
        title: "Please fill all fields",
        description: "All fields are required to complete your booking.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Booking submitted!",
      description: "We'll contact you based on availability. Thank you!",
    });

    // Reset form
    setAppointmentType("");
    setSelectedTimeSlots([]);
    setSelectedEquipment([]);
    setFormData({ name: "", currentDate: "", email: "", phone: "" });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-card shadow-soft">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Book Your Appointment</CardTitle>
        <CardDescription className="text-center">
          Choose your appointment type and preferred time slots
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Appointment Type Selection */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">
              Select Appointment Type
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AppointmentTypeCard
                title="Training"
                description="Learn how to use our equipment safely and effectively"
                isSelected={appointmentType === "training"}
                onSelect={() => setAppointmentType("training")}
              />
              <AppointmentTypeCard
                title="Maker Lab Appointment" 
                description="Book time to use equipment for your projects"
                isSelected={appointmentType === "maker-lab"}
                onSelect={() => setAppointmentType("maker-lab")}
              />
            </div>
          </div>

          {/* Time Slots Section */}
          <div className="space-y-4">
            <div>
              <Label className="text-lg font-semibold">
                {appointmentType === "training" ? "Select Training" : "Select"} Time Slots (Choose 3)
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                You will be contacted based on availability. Earliest appointments are for next week.
                Selected: {selectedTimeSlots.length}/3
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {timeSlots.map((slot) => (
                <TimeSlotCard
                  key={slot}
                  time={slot}
                  isSelected={selectedTimeSlots.includes(slot)}
                  onSelect={() => handleTimeSlotSelect(slot)}
                />
              ))}
            </div>
          </div>

          {/* Equipment Section - Only show for Maker Lab appointments */}
          {appointmentType === "maker-lab" && (
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                Select Equipment You Want to Use
              </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {equipment.map((item) => (
                <EquipmentCard
                  key={item}
                  name={item}
                  isSelected={selectedEquipment.includes(item)}
                  onSelect={() => handleEquipmentSelect(item)}
                />
              ))}
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-medium">
                Name *
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-background border-border focus:ring-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentDate" className="text-base font-medium">
                Current Date *
              </Label>
              <Input
                id="currentDate"
                type="date"
                value={formData.currentDate}
                onChange={(e) => setFormData(prev => ({ ...prev, currentDate: e.target.value }))}
                className="bg-background border-border focus:ring-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-medium">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="bg-background border-border focus:ring-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-base font-medium">
                Phone *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="bg-background border-border focus:ring-primary"
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-hero hover:shadow-glow transition-all duration-300 font-semibold"
            size="lg"
          >
            Submit {appointmentType === "training" ? "Training" : "Appointment"} Request
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}