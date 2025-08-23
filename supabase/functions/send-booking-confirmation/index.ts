import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookingConfirmationRequest {
  fullName: string;
  email: string;
  phone: string;
  accessOption: string;
  selectedDates: string[];
  selectedTimeSlots: string[];
  selectedEquipment: string[];
  preferredDate: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const booking: BookingConfirmationRequest = await req.json();
    console.log("Booking confirmation request received:", booking);

    const accessTypeText = booking.accessOption === 'training' ? 'Training Session' : 'Appointment';
    
    // Log the booking details for admin tracking
    console.log("Booking details:", {
      name: booking.fullName,
      email: booking.email,
      phone: booking.phone,
      accessType: accessTypeText,
      dates: booking.selectedDates,
      timeSlots: booking.selectedTimeSlots,
      equipment: booking.selectedEquipment,
      preferredDate: booking.preferredDate
    });

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Booking confirmation logged successfully" 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error processing confirmation request:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to process confirmation request" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);