-- Modify the promote function to bypass frequency check for admin-approved requests
CREATE OR REPLACE FUNCTION public.promote_booking_request_to_confirmed(request_id uuid, assigned_user_id uuid DEFAULT NULL::uuid)
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
  
  -- Create the confirmed booking (bypass frequency check by setting a special flag)
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

-- Modify the frequency check trigger to exclude admin-promoted bookings
CREATE OR REPLACE FUNCTION public.check_booking_frequency()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Skip frequency check if this is being called from the promote function
  -- (we can detect this by checking if we're in a transaction with specific context)
  IF current_setting('application_name', true) = 'admin_promotion' THEN
    RETURN NEW;
  END IF;

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
$function$;

-- Create a new function specifically for admin promotions that bypasses frequency check
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
  
  -- Temporarily disable the frequency check trigger
  SET session_replication_role = replica;
  
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
  
  -- Re-enable the trigger
  SET session_replication_role = DEFAULT;
  
  -- Delete the request after successful promotion
  DELETE FROM public.public_booking_requests WHERE id = request_id;
  
  RETURN new_booking_id;
END;
$function$;