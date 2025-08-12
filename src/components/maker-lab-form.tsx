import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { TimeSlotCard } from "@/components/ui/time-slot-card";
import { EquipmentCard } from "@/components/ui/equipment-card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

declare global {
  interface Window {
    emailjs: any;
  }
}
import { format } from "date-fns";
const timeSlots = ["Tuesday 11 AM - 1 PM", "Tuesday 2 PM - 4 PM", "Wednesday 11 AM - 1 PM", "Thursday 11 AM - 1 PM", "Thursday 2 PM - 4 PM", "Friday 11 AM - 1 PM", "Friday 2 PM - 4 PM"];
const equipment = ["Cricut Make", "Laser Cutter", "3D Printers", "Embroidery Machine", "Sewing Machines", "Brother Serger", "Direct-to-Film (DTF) Printer", "Media Room (Green Screen)", "Recording Studio (Podcast)"];
export function MakerLabForm() {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string>("");
  const [accessOption, setAccessOption] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    currentDate: "",
    email: "",
    phone: ""
  });
  const {
    toast
  } = useToast();

  useEffect(() => {
    // Set current date on component mount
    try {
      const today = new Date();
      const formattedDate = format(today, "MM/dd/yyyy");
      console.log("Setting current date:", formattedDate);
      setFormData(prev => ({
        ...prev,
        currentDate: formattedDate
      }));
    } catch (error) {
      console.error("Error formatting date:", error);
      // Fallback to simple date format if format function fails
      const fallbackDate = new Date().toLocaleDateString();
      setFormData(prev => ({
        ...prev,
        currentDate: fallbackDate
      }));
    }
  }, []);
  const handleTimeSlotSelect = (slot: string) => {
    if (selectedTimeSlots.includes(slot)) {
      setSelectedTimeSlots(prev => prev.filter(s => s !== slot));
    } else if (selectedTimeSlots.length < 3) {
      setSelectedTimeSlots(prev => [...prev, slot]);
    } else {
      toast({
        title: "Maximum 3 time slots",
        description: "Please select up to 3 preferred time slots.",
        variant: "destructive"
      });
    }
  };

  // Helper function to extract day from time slot
  const getDayFromTimeSlot = (timeSlot: string): string => {
    return timeSlot.split(' ')[0]; // Gets "Tuesday", "Wednesday", etc.
  };

  // Helper function to get day names from selected dates
  const getSelectedDayNames = (): string[] => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return selectedDates.map(date => dayNames[date.getDay()]);
  };

  // Check if a time slot should be disabled
  const isTimeSlotDisabled = (timeSlot: string): boolean => {
    if (selectedDates.length === 0) return false; // If no dates selected, don't disable any slots
    const slotDay = getDayFromTimeSlot(timeSlot);
    const selectedDayNames = getSelectedDayNames();
    return !selectedDayNames.includes(slotDay);
  };
  const handleEquipmentSelect = (item: string) => {
    setSelectedEquipment(item);
  };
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    if (selectedDates.some(d => d.toDateString() === date.toDateString())) {
      setSelectedDates(prev => prev.filter(d => d.toDateString() !== date.toDateString()));
    } else if (selectedDates.length < 3) {
      setSelectedDates(prev => [...prev, date]);
    } else {
      toast({
        title: "Maximum 3 dates",
        description: "Please select only 3 preferred dates.",
        variant: "destructive"
      });
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all required fields
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Please fill all fields",
        description: "Name, email, and phone number are required.",
        variant: "destructive"
      });
      return;
    }
    
    if (!accessOption) {
      toast({
        title: "Please select access option",
        description: "You must select either Training or Appointment.",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedDates.length === 0) {
      toast({
        title: "Please select dates",
        description: "You must select at least one date from the calendar.",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedTimeSlots.length === 0) {
      toast({
        title: "Please select time slots",
        description: "You must select at least 1 preferred time slot.",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedEquipment) {
      toast({
        title: "Please select equipment",
        description: "You must select one piece of equipment.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Prepare data for EmailJS with correct field mapping
      const preferredDates = selectedDates.map(date => format(date, "EEEE, MMMM do, yyyy")).join(", ");
      const timeSlots = selectedTimeSlots.join(", ");
      
      const emailData = {
        user_name: formData.name,
        user_email: formData.email,
        user_phone: formData.phone,
        lab_access: accessOption,
        preferred_dates: preferredDates,
        time_slots: timeSlots,
        equipment: selectedEquipment
      };

      console.log('Sending email data:', emailData);
      console.log('EmailJS service available:', !!window.emailjs);

      // Send email using EmailJS
      if (window.emailjs) {
        console.log('About to send email with service: service_c5hnxps, template: template_s5pm6ri');
        const response = await window.emailjs.send(
          'service_c5hnxps',
          'template_s5pm6ri',
          emailData,
          'ExUWNRz9bRhzQFxBM'
        );

        console.log('EmailJS raw response:', response);
        
        if (response.status === 200) {
          console.log('Email sent successfully with status 200');
        } else {
          console.warn('EmailJS returned non-200 status:', response.status, response.text);
        }

        toast({
          title: "Success!",
          description: "Your booking request has been sent successfully! We'll contact you soon."
        });

        // Reset form after successful submission
        setSelectedDates([]);
        setSelectedTimeSlots([]);
        setSelectedEquipment("");
        setAccessOption("");
        setFormData({
          name: "",
          currentDate: format(new Date(), "MM/dd/yyyy"),
          email: "",
          phone: ""
        });

      } else {
        throw new Error('EmailJS not available');
      }

    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Error",
        description: "Failed to send your booking request. Please try again.",
        variant: "destructive"
      });
    }
  };
  return <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-cyber p-12 text-center shadow-urban">
        <div className="absolute inset-0 bg-background/10 backdrop-blur-sm" />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Open Maker Lab
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Unleash your creativity with cutting-edge tools and professional-grade equipment. 
            Book your innovation session today.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}} />
      </div>

      <Card className="bg-gradient-section shadow-urban border-0 overflow-hidden animate-slide-up">
        <div className="absolute inset-0 bg-gradient-cyber opacity-5" />
      <CardContent className="relative space-y-12 p-8 md:p-12">
        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Lab Access Options Section */}
          <div className="space-y-6 group">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-hero text-white font-bold flex items-center justify-center shadow-glow">
                1
              </div>
              <h2 className="text-2xl font-bold bg-gradient-cyber bg-clip-text text-transparent">
                Lab Access Options
              </h2>
            </div>
            <div className="space-y-6 p-8 bg-gradient-section rounded-2xl border border-border/50 shadow-float">
              <p className="text-muted-foreground text-lg leading-relaxed">
                To begin using the lab, you must first complete the required training or schedule an appointment. Below are the three access options available:
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl bg-background/70 border border-border/50 hover:border-primary/30 transition-all duration-300 group/option">
                  <h4 className="font-bold text-lg text-foreground mb-3 group-hover/option:text-primary transition-colors">Training Session</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">All users must complete a training session before using the lab equipment. This ensures safe and proper use of all resources.</p>
                </div>
                
                <div className="p-6 rounded-xl bg-background/70 border border-border/50 hover:border-primary/30 transition-all duration-300 group/option">
                  <h4 className="font-bold text-lg text-foreground mb-3 group-hover/option:text-primary transition-colors">Scheduled Appointment</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Once training is complete, you may schedule an appointment to reserve your preferred equipment. This guarantees your access during the scheduled time.</p>
                </div>
                
                <div className="p-6 rounded-xl bg-background/70 border border-border/50 hover:border-primary/30 transition-all duration-300 group/option">
                  <h4 className="font-bold text-lg text-foreground mb-3 group-hover/option:text-primary transition-colors">Walk-In Access</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">After completing training, you may also use the lab during open hours on a walk-in basis. Please note, walk-in use is only allowed if no appointments are scheduled during that time.</p>
                </div>
              </div>
              
              <div className="p-6 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-foreground font-semibold mb-4 text-center">
                  To guarantee access to specific equipment, we strongly recommend scheduling an appointment in advance.
                </p>
                
                <div className="space-y-1">
                  <Label className="text-base font-semibold text-foreground">Please select one of the following options to proceed:</Label>
                  <RadioGroup value={accessOption} onValueChange={setAccessOption} className="mt-4 space-y-4">
                    <div className="flex items-center space-x-3 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
                      <RadioGroupItem value="training" id="training" className="text-primary" />
                      <Label htmlFor="training" className="text-base font-medium cursor-pointer flex-1">I would like to schedule a Training Session.</Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
                      <RadioGroupItem value="appointment" id="appointment" className="text-primary" />
                      <Label htmlFor="appointment" className="text-base font-medium cursor-pointer flex-1">I have completed training and would like to make an Appointment.</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          </div>

          {/* Date Selection Section */}
          <div className="space-y-6 group">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-hero text-white font-bold flex items-center justify-center shadow-glow">
                2
              </div>
              <h2 className="text-2xl font-bold bg-gradient-cyber bg-clip-text text-transparent">
                Select Your Preferred Dates
              </h2>
            </div>
            <div className="p-8 bg-gradient-section rounded-2xl border border-border/50 shadow-float">
              <p className="text-center text-lg font-semibold text-foreground mb-2">
                Click on the calendar to select up to 3 preferred dates. Earliest appointments are for next week.
              </p>
              <div className="text-center mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <span className="text-primary font-bold">Selected dates: {selectedDates.length}/3</span>
                </span>
              </div>
              <div className="flex justify-center">
                <div className="p-6 rounded-2xl bg-background/80 shadow-urban">
                  <Calendar 
                    mode="multiple" 
                    selected={selectedDates} 
                    onSelect={dates => setSelectedDates(dates || [])} 
                    disabled={date => {
                    const isPastDate = date < new Date();
                    const isMaxSelected = selectedDates.length >= 3 && !selectedDates.some(d => d.toDateString() === date.toDateString());
                    // Maker Lab is open Tuesday-Friday (days 2-5)
                    const isClosed = date.getDay() === 0 || date.getDay() === 1 || date.getDay() === 6; // Sunday (0), Monday (1), Saturday (6)
                    return isPastDate || isMaxSelected || isClosed;
                  }}
                    className="rounded-xl border-0 shadow-none bg-transparent" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Time Slots Section */}
          <div className="space-y-6 group">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-hero text-white font-bold flex items-center justify-center shadow-glow">
                3
              </div>
              <h2 className="text-2xl font-bold bg-gradient-cyber bg-clip-text text-transparent">
                Choose Your Time Slots
              </h2>
            </div>
            <div className="p-8 bg-gradient-section rounded-2xl border border-border/50 shadow-float">
              <p className="text-muted-foreground text-lg mb-2 text-center">
                Select 1-3 preferred time slots. {selectedDates.length > 0 ? "Only slots for your selected days are available." : "Please select dates first to see available time slots."}
              </p>
              <div className="text-center mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <span className="text-primary font-bold">Selected: {selectedTimeSlots.length}/3</span>
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {timeSlots.map(slot => <TimeSlotCard key={slot} time={slot} isSelected={selectedTimeSlots.includes(slot)} onSelect={() => handleTimeSlotSelect(slot)} disabled={isTimeSlotDisabled(slot)} />)}
              </div>
            </div>
          </div>

          {/* Equipment Section */}
          <div className="space-y-6 group">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-hero text-white font-bold flex items-center justify-center shadow-glow">
                4
              </div>
              <h2 className="text-2xl font-bold bg-gradient-cyber bg-clip-text text-transparent">
                Select Your Equipment (Choose One)
              </h2>
            </div>
            <div className="p-8 bg-gradient-section rounded-2xl border border-border/50 shadow-float">
              <p className="text-muted-foreground text-lg mb-6 text-center">
                Please select one piece of equipment for your session.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {equipment.map(item => <EquipmentCard key={item} name={item} isSelected={selectedEquipment === item} onSelect={() => handleEquipmentSelect(item)} disabled={item === "Laser Cutter"} />)}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6 group">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-hero text-white font-bold flex items-center justify-center shadow-glow">
                5
              </div>
              <h2 className="text-2xl font-bold bg-gradient-cyber bg-clip-text text-transparent">
                Your Information
              </h2>
            </div>
            <div className="p-8 bg-gradient-section rounded-2xl border border-border/50 shadow-float">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-base font-semibold text-foreground flex items-center gap-2">
                    <span className="text-primary">•</span> Name *
                  </Label>
                  <Input 
                    id="name" 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      name: e.target.value
                    }))} 
                    className="h-12 bg-background/70 border-border/50 focus:border-primary focus:ring-primary/20 rounded-xl text-base" 
                    required 
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="currentDate" className="text-base font-semibold text-foreground flex items-center gap-2">
                    <span className="text-primary">•</span> Current Date *
                  </Label>
                  <Input 
                    id="currentDate" 
                    type="text" 
                    value={formData.currentDate} 
                    readOnly
                    className="h-12 bg-background/70 border-border/50 focus:border-primary focus:ring-primary/20 rounded-xl text-base cursor-not-allowed opacity-70" 
                    required 
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="email" className="text-base font-semibold text-foreground flex items-center gap-2">
                    <span className="text-primary">•</span> Email *
                  </Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      email: e.target.value
                    }))} 
                    className="h-12 bg-background/70 border-border/50 focus:border-primary focus:ring-primary/20 rounded-xl text-base" 
                    required 
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-base font-semibold text-foreground flex items-center gap-2">
                    <span className="text-primary">•</span> Phone *
                  </Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    value={formData.phone} 
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      phone: e.target.value
                    }))} 
                    className="h-12 bg-background/70 border-border/50 focus:border-primary focus:ring-primary/20 rounded-xl text-base" 
                    required 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <Button 
              type="submit" 
              className="w-full h-14 bg-gradient-cyber hover:shadow-glow transition-all duration-500 font-bold text-lg rounded-2xl border-0 hover:scale-[1.02] active:scale-[0.98]" 
              size="lg"
            >
              <span className="flex items-center gap-3">
                Submit Booking Request
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              </span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
    </div>;
}