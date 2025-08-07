-- Assign admin role to makerlabrpl@gmail.com
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users 
WHERE email = 'makerlabrpl@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Add action_date column to track when status changes
ALTER TABLE public.maker_lab_bookings 
ADD COLUMN action_date timestamp with time zone;