-- Create a secure public booking requests table
CREATE TABLE public.public_booking_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  access_option TEXT NOT NULL,
  selected_dates TEXT[] NOT NULL,
  selected_time_slots TEXT[] NOT NULL,
  selected_equipment TEXT[] NOT NULL,
  preferred_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  -- Add rate limiting fields
  ip_address INET,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on the new table
ALTER TABLE public.public_booking_requests ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_public_booking_requests_email ON public.public_booking_requests(email);
CREATE INDEX idx_public_booking_requests_created_at ON public.public_booking_requests(created_at);

-- RLS Policies for public_booking_requests
-- Only allow INSERT for anonymous users (no SELECT access)
CREATE POLICY "Allow anonymous booking submissions" 
ON public.public_booking_requests 
FOR INSERT 
WITH CHECK (true);

-- Only admins can view booking requests
CREATE POLICY "Admins can view all booking requests" 
ON public.public_booking_requests 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update booking requests
CREATE POLICY "Admins can update booking requests" 
ON public.public_booking_requests 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete booking requests
CREATE POLICY "Admins can delete booking requests" 
ON public.public_booking_requests 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Update trigger for automatic timestamp updates on the new table
CREATE TRIGGER update_public_booking_requests_updated_at
BEFORE UPDATE ON public.public_booking_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update the existing maker_lab_bookings table RLS policies to be more secure
-- Remove the anonymous insert policy since all bookings should now be created by admins
DROP POLICY IF EXISTS "Anyone can insert bookings" ON public.maker_lab_bookings;

-- Create new secure policies for maker_lab_bookings
CREATE POLICY "Only admins can create confirmed bookings" 
ON public.maker_lab_bookings 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create a function to promote a booking request to a confirmed booking
CREATE OR REPLACE FUNCTION public.promote_booking_request_to_confirmed(
  request_id UUID,
  assigned_user_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  request_record RECORD;
  new_booking_id UUID;
BEGIN
  -- Only admins can call this function
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Only admins can promote booking requests';
  END IF;
  
  -- Get the request record
  SELECT * INTO request_record 
  FROM public.public_booking_requests 
  WHERE id = request_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Booking request not found';
  END IF;
  
  -- Create the confirmed booking
  INSERT INTO public.maker_lab_bookings (
    user_id,
    full_name,
    email,
    phone,
    access_option,
    selected_dates,
    selected_time_slots,
    selected_equipment,
    preferred_date,
    status
  ) VALUES (
    assigned_user_id,
    request_record.full_name,
    request_record.email,
    request_record.phone,
    request_record.access_option,
    request_record.selected_dates,
    request_record.selected_time_slots,
    request_record.selected_equipment,
    request_record.preferred_date,
    'scheduled'
  ) RETURNING id INTO new_booking_id;
  
  -- Delete the request after successful promotion
  DELETE FROM public.public_booking_requests WHERE id = request_id;
  
  RETURN new_booking_id;
END;
$$;