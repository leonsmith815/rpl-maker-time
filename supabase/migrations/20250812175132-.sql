-- Clean up existing duplicate booking requests (keep most recent per email within 7 days)
WITH duplicates AS (
  SELECT 
    id,
    email,
    submitted_at,
    ROW_NUMBER() OVER (
      PARTITION BY email 
      ORDER BY submitted_at DESC
    ) as row_num
  FROM public.public_booking_requests
  WHERE EXISTS (
    SELECT 1 
    FROM public.public_booking_requests pbr2 
    WHERE pbr2.email = public_booking_requests.email 
    AND pbr2.id != public_booking_requests.id
    AND ABS(EXTRACT(EPOCH FROM (pbr2.submitted_at - public_booking_requests.submitted_at))) <= 604800 -- 7 days in seconds
  )
)
DELETE FROM public.public_booking_requests 
WHERE id IN (
  SELECT id FROM duplicates WHERE row_num > 1
);

-- Ensure the trigger exists and is properly attached
CREATE TRIGGER check_booking_frequency_trigger
  BEFORE INSERT OR UPDATE ON public.public_booking_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.check_booking_frequency();

-- Add a comment for clarity
COMMENT ON TRIGGER check_booking_frequency_trigger ON public.public_booking_requests IS 
'Prevents users from submitting multiple booking requests within 7 days';