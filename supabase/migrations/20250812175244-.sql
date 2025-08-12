-- Clean up existing duplicate confirmed bookings (keep most recent per email within 7 days)
WITH duplicates AS (
  SELECT 
    id,
    email,
    created_at,
    ROW_NUMBER() OVER (
      PARTITION BY email 
      ORDER BY created_at DESC
    ) as row_num
  FROM public.maker_lab_bookings
  WHERE EXISTS (
    SELECT 1 
    FROM public.maker_lab_bookings mlb2 
    WHERE mlb2.email = public.maker_lab_bookings.email 
    AND mlb2.id != public.maker_lab_bookings.id
    AND ABS(EXTRACT(EPOCH FROM (mlb2.created_at - public.maker_lab_bookings.created_at))) <= 604800 -- 7 days in seconds
  )
)
DELETE FROM public.maker_lab_bookings 
WHERE id IN (
  SELECT id FROM duplicates WHERE row_num > 1
);

-- Ensure the trigger exists for confirmed bookings as well
CREATE TRIGGER check_booking_frequency_confirmed_trigger
  BEFORE INSERT OR UPDATE ON public.maker_lab_bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.check_booking_frequency();

-- Add a comment for clarity
COMMENT ON TRIGGER check_booking_frequency_confirmed_trigger ON public.maker_lab_bookings IS 
'Prevents users from having multiple confirmed bookings within 7 days';