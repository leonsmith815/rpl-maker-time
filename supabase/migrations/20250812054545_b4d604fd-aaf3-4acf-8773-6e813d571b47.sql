-- Create table for storing booking requests
CREATE TABLE IF NOT EXISTS public.maker_lab_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  access_option TEXT NOT NULL,
  selected_dates TEXT[] NOT NULL,
  selected_time_slots TEXT[] NOT NULL,
  selected_equipment TEXT[] NOT NULL,
  preferred_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.maker_lab_bookings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert bookings (for form submissions)
CREATE POLICY "Anyone can create bookings" ON public.maker_lab_bookings
  FOR INSERT WITH CHECK (true);

-- Only authenticated users can view bookings
CREATE POLICY "Authenticated users can view bookings" ON public.maker_lab_bookings
  FOR SELECT USING (auth.role() = 'authenticated');

-- Add updated_at trigger
CREATE TRIGGER update_maker_lab_bookings_updated_at
  BEFORE UPDATE ON public.maker_lab_bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();