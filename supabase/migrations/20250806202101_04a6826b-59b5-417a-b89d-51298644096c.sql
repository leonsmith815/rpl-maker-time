-- Update the CNC Machine entry to Singer Heavy Duty Sewing Machine
UPDATE public.equipment 
SET 
  name = 'Singer Heavy Duty Sewing Machine',
  description = 'Professional-grade sewing machine for fabric and textile projects',
  category = 'Textiles'
WHERE name = 'CNC Machine';