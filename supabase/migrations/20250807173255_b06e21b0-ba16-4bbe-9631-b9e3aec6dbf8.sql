-- First, let's see what the current constraint allows by dropping and recreating it with the correct values
ALTER TABLE public.maker_lab_bookings 
DROP CONSTRAINT IF EXISTS maker_lab_bookings_status_check;

-- Add the constraint with all the status values we need
ALTER TABLE public.maker_lab_bookings 
ADD CONSTRAINT maker_lab_bookings_status_check 
CHECK (status IN ('pending', 'scheduled', 'cancelled', 'missed'));