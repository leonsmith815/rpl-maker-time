-- Migrate existing pending bookings from maker_lab_bookings to public_booking_requests
INSERT INTO public.public_booking_requests (
  full_name,
  email,
  phone,
  access_option,
  selected_dates,
  selected_time_slots,
  selected_equipment,
  preferred_date,
  status,
  created_at,
  updated_at
)
SELECT 
  full_name,
  email,
  phone,
  access_option,
  selected_dates,
  selected_time_slots,
  selected_equipment,
  preferred_date,
  status,
  created_at,
  updated_at
FROM public.maker_lab_bookings
WHERE status = 'pending';

-- Remove the migrated pending bookings from the old table
DELETE FROM public.maker_lab_bookings WHERE status = 'pending';