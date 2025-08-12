-- Create function to check if user has booked within last 7 days
CREATE OR REPLACE FUNCTION public.check_booking_frequency()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if user has any booking requests in the last 7 days
  IF EXISTS (
    SELECT 1 FROM public.public_booking_requests 
    WHERE email = NEW.email 
    AND submitted_at > NOW() - INTERVAL '7 days'
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
  ) THEN
    RAISE EXCEPTION 'You can only schedule one appointment every 7 days. Please wait before making another booking request.';
  END IF;

  -- Check if user has any confirmed bookings in the last 7 days
  IF EXISTS (
    SELECT 1 FROM public.maker_lab_bookings 
    WHERE email = NEW.email 
    AND created_at > NOW() - INTERVAL '7 days'
    AND status != 'pending'
  ) THEN
    RAISE EXCEPTION 'You can only schedule one appointment every 7 days. Please wait before making another booking request.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce booking frequency on insert
CREATE TRIGGER enforce_booking_frequency
  BEFORE INSERT ON public.public_booking_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.check_booking_frequency();