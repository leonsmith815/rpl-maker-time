-- Create equipment table
CREATE TABLE public.equipment (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  category TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create time slots table
CREATE TABLE public.time_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slot_time TEXT NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create maker lab bookings table
CREATE TABLE public.maker_lab_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  access_option TEXT NOT NULL CHECK (access_option IN ('training', 'appointment')),
  selected_dates TEXT[] NOT NULL,
  selected_time_slots TEXT[] NOT NULL,
  selected_equipment TEXT[] NOT NULL,
  full_name TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maker_lab_bookings ENABLE ROW LEVEL SECURITY;

-- Equipment policies (public read access)
CREATE POLICY "Equipment is viewable by everyone" 
ON public.equipment 
FOR SELECT 
USING (true);

-- Time slots policies (public read access)
CREATE POLICY "Time slots are viewable by everyone" 
ON public.time_slots 
FOR SELECT 
USING (true);

-- Booking policies
CREATE POLICY "Users can view their own bookings" 
ON public.maker_lab_bookings 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create bookings" 
ON public.maker_lab_bookings 
FOR INSERT 
WITH CHECK (true);

-- Insert default equipment
INSERT INTO public.equipment (name, description, category) VALUES
('3D Printer', 'High-precision 3D printing for prototypes and models', 'Manufacturing'),
('Laser Cutter', 'Precision cutting and engraving for various materials', 'Manufacturing'),
('CNC Machine', 'Computer-controlled machining for precise parts', 'Manufacturing'),
('Recording Studio', 'Professional audio recording and editing setup', 'Media'),
('Electronics Station', 'Soldering and circuit building workspace', 'Electronics'),
('Woodworking Tools', 'Complete woodworking setup with power tools', 'Woodworking');

-- Insert default time slots
INSERT INTO public.time_slots (slot_time) VALUES
('9:00 AM - 10:30 AM'),
('10:30 AM - 12:00 PM'),
('12:00 PM - 1:30 PM'),
('1:30 PM - 3:00 PM'),
('3:00 PM - 4:30 PM'),
('4:30 PM - 6:00 PM'),
('6:00 PM - 7:30 PM');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_equipment_updated_at
  BEFORE UPDATE ON public.equipment
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_time_slots_updated_at
  BEFORE UPDATE ON public.time_slots
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_maker_lab_bookings_updated_at
  BEFORE UPDATE ON public.maker_lab_bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();