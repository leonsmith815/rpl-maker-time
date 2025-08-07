-- Drop existing status check constraint
ALTER TABLE public.maker_lab_bookings 
DROP CONSTRAINT IF EXISTS maker_lab_bookings_status_check;

-- Add new status check constraint with all allowed values
ALTER TABLE public.maker_lab_bookings 
ADD CONSTRAINT maker_lab_bookings_status_check 
CHECK (status IN ('pending', 'scheduled', 'completed', 'cancelled'));