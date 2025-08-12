-- Remove the 7-day policy for confirmed bookings
-- Update the frequency check function to only apply to booking requests
CREATE OR REPLACE FUNCTION public.check_booking_frequency()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Only check frequency for booking requests, not confirmed bookings
  -- This function should only be used on public_booking_requests table
  
  -- Check if user has any booking requests in the last 7 days
  IF EXISTS (
    SELECT 1 FROM public.public_booking_requests 
    WHERE email = NEW.email 
    AND submitted_at > NOW() - INTERVAL '7 days'
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
  ) THEN
    RAISE EXCEPTION 'You can only schedule one appointment every 7 days. Please wait before making another booking request.';
  END IF;

  RETURN NEW;
END;
$function$;

-- Remove the frequency check trigger from confirmed bookings table
DROP TRIGGER IF EXISTS check_booking_frequency_confirmed_trigger ON public.maker_lab_bookings;

-- Simplify the admin promotion function since we no longer need to bypass frequency checks
CREATE OR REPLACE FUNCTION public.promote_booking_request_to_confirmed_admin(request_id uuid, assigned_user_id uuid DEFAULT NULL::uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
  
  -- Create the confirmed booking (no frequency check needed anymore)
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
$function$;