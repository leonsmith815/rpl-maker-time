-- Create policy to allow admins to update booking status
CREATE POLICY "Admins can update bookings" 
ON public.maker_lab_bookings 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'::app_role));