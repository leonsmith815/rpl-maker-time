import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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
    console.log("Sending confirmation email for booking:", booking);

    const accessTypeText = booking.accessOption === 'training' ? 'Training Session' : 'Appointment';
    
    const emailResponse = await resend.emails.send({
      from: "RPL Maker Lab <onboarding@resend.dev>",
      to: [booking.email],
      subject: `Maker Lab ${accessTypeText} Request Received`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin-bottom: 10px;">RPL Maker Lab</h1>
            <p style="color: #666; font-size: 18px;">Booking Confirmation</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #2563eb 0%, #ea580c 50%, #dc2626 100%); padding: 20px; border-radius: 12px; margin-bottom: 30px;">
            <h2 style="color: white; margin: 0; text-align: center;">Thank you for your ${accessTypeText} request!</h2>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #1e293b; margin-top: 0;">Booking Details</h3>
            <p><strong>Name:</strong> ${booking.fullName}</p>
            <p><strong>Email:</strong> ${booking.email}</p>
            <p><strong>Phone:</strong> ${booking.phone}</p>
            <p><strong>Access Type:</strong> ${accessTypeText}</p>
            <p><strong>Submission Date:</strong> ${booking.preferredDate}</p>
          </div>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h4 style="color: #0369a1; margin-top: 0;">Preferred Dates:</h4>
            <ul style="margin: 0; padding-left: 20px;">
              ${booking.selectedDates.map(date => `<li>${date}</li>`).join('')}
            </ul>
          </div>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h4 style="color: #92400e; margin-top: 0;">Preferred Time Slots:</h4>
            <ul style="margin: 0; padding-left: 20px;">
              ${booking.selectedTimeSlots.map(slot => `<li>${slot}</li>`).join('')}
            </ul>
          </div>
          
          <div style="background: #fce7f3; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h4 style="color: #be185d; margin-top: 0;">Selected Equipment:</h4>
            <ul style="margin: 0; padding-left: 20px;">
              ${booking.selectedEquipment.map(equipment => `<li>${equipment}</li>`).join('')}
            </ul>
          </div>
          
          <div style="background: #dcfce7; padding: 20px; border-radius: 8px; border-left: 4px solid #16a34a;">
            <h4 style="color: #15803d; margin-top: 0;">What happens next?</h4>
            <p style="margin-bottom: 10px;">• We'll review your request and check availability</p>
            <p style="margin-bottom: 10px;">• You'll receive a confirmation email with your scheduled time</p>
            <p style="margin-bottom: 10px;">• Please arrive 5 minutes early for your session</p>
            <p style="margin: 0;">• Bring a valid ID and be ready to create!</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; margin: 0;">
              Questions? Contact us at <a href="mailto:makerlab@rpl.org" style="color: #2563eb;">makerlab@rpl.org</a>
            </p>
            <p style="color: #64748b; margin: 10px 0 0 0; font-size: 14px;">
              Rockford Public Library Maker Lab<br>
              Where Innovation Meets Creation
            </p>
          </div>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      messageId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending confirmation email:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to send confirmation email" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);