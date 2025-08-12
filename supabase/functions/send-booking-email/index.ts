import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookingEmailRequest {
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
    const booking: BookingEmailRequest = await req.json();
    console.log("Booking email request received:", booking);

    const accessTypeText = booking.accessOption === 'training' ? 'Training Session' : 'Appointment';
    
    // Create formatted email content
    const emailContent = `
      <h2>New Maker Lab Booking Request</h2>
      <p><strong>Name:</strong> ${booking.fullName}</p>
      <p><strong>Email:</strong> ${booking.email}</p>
      <p><strong>Phone:</strong> ${booking.phone}</p>
      <p><strong>Access Type:</strong> ${accessTypeText}</p>
      <p><strong>Preferred Dates:</strong> ${booking.selectedDates.join(', ')}</p>
      <p><strong>Time Slots:</strong> ${booking.selectedTimeSlots.join(', ')}</p>
      <p><strong>Equipment:</strong> ${booking.selectedEquipment.join(', ')}</p>
      <p><strong>Preferred Date:</strong> ${booking.preferredDate}</p>
    `;

    // Send admin notification email
    const adminEmailResponse = await resend.emails.send({
      from: "Maker Lab <bookings@resend.dev>",
      to: ["leonsmith815@gmail.com"], // Admin email
      subject: `New Maker Lab Booking Request - ${booking.fullName}`,
      html: emailContent,
    });

    console.log("Admin email sent successfully:", adminEmailResponse);

    // Send confirmation email to user
    const userEmailResponse = await resend.emails.send({
      from: "Maker Lab <bookings@resend.dev>",
      to: [booking.email],
      subject: "Maker Lab Booking Request Received",
      html: `
        <h2>Your Maker Lab Booking Request</h2>
        <p>Hi ${booking.fullName},</p>
        <p>We have received your booking request for the Maker Lab. Here are the details:</p>
        ${emailContent}
        <p>We will contact you soon to confirm your booking.</p>
        <p>Best regards,<br>The Maker Lab Team</p>
      `,
    });

    console.log("User confirmation email sent successfully:", userEmailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Booking emails sent successfully" 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending booking emails:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to send booking emails" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);