-- Add delete policy for admins on maker_lab_bookings
CREATE POLICY "Admins can delete bookings" 
ON public.maker_lab_bookings 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));