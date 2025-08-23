import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface StatusEmailRequest {
  email: string;
  fullName: string;
  status: string;
  selectedDates: string[];
  selectedTimeSlots: string[];
  selectedEquipment: string[];
  actionDate?: string;
}

const getEmailSubject = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'Maker Lab Booking Confirmation - Request Received';
    case 'scheduled':
      return 'Maker Lab Appointment Scheduled';
    case 'missed':
      return 'Maker Lab Appointment - Marked as Missed';
    case 'cancelled':
      return 'Maker Lab Appointment Cancelled';
    default:
      return 'Maker Lab Booking Update';
  }
};

const getEmailContent = (status: string, customerName: string, dates: string, equipment: string, timeSlots: string): string => {
  const baseReminder = `

Important Reminders:
• You must confirm your appointment 24 hours prior to your scheduled time, or your appointment will be cancelled and you will need to reschedule
• Appointments will be considered missed and cancelled 15 minutes after the scheduled time

Questions? Contact us at Maker@rockfordpubliclibrary.org`;

  switch (status.toLowerCase()) {
    case 'pending':
      return `Dear ${customerName},

Thank you for submitting your Maker Lab booking request. We have received your application and it is currently being reviewed.

Booking Details:
• Dates Requested: ${dates}
• Time Slots: ${timeSlots}
• Equipment: ${equipment}

You will receive another email once your booking has been scheduled or if we need additional information.${baseReminder}

Best regards,
Rockford Public Library Maker Lab Team`;

    case 'scheduled':
      return `Dear ${customerName},

Great news! Your Maker Lab appointment has been scheduled.

Appointment Details:
• Dates: ${dates}
• Time Slots: ${timeSlots}
• Equipment: ${equipment}
• Duration: 2 hours

IMPORTANT - CONFIRMATION REQUIRED:
You must confirm your appointment 24 hours prior to your scheduled time, or your appointment will be cancelled and you will need to reschedule.

Please note: Appointments will be considered missed and cancelled 15 minutes after the scheduled time.${baseReminder}

Best regards,
Rockford Public Library Maker Lab Team`;

    case 'missed':
      return `Dear ${customerName},

Your Maker Lab appointment has been marked as missed.

Booking Details:
• Dates: ${dates}
• Time Slots: ${timeSlots}
• Equipment: ${equipment}

This typically occurs when:
• No confirmation was received 24 hours prior to the appointment
• You did not arrive within 15 minutes of your scheduled time

To schedule a new appointment, please submit a new booking request through our system.

Questions? Contact us at Maker@rockfordpubliclibrary.org

Best regards,
Rockford Public Library Maker Lab Team`;

    case 'cancelled':
      return `Dear ${customerName},

Your Maker Lab appointment has been cancelled.

Booking Details:
• Dates: ${dates}
• Time Slots: ${timeSlots}
• Equipment: ${equipment}

If you would like to reschedule, please submit a new booking request through our system.

Questions? Contact us at Maker@rockfordpubliclibrary.org

Best regards,
Rockford Public Library Maker Lab Team`;

    default:
      return `Dear ${customerName},

Your Maker Lab booking status has been updated to: ${status}

Booking Details:
• Dates: ${dates}
• Time Slots: ${timeSlots}
• Equipment: ${equipment}

Questions? Contact us at Maker@rockfordpubliclibrary.org

Best regards,
Rockford Public Library Maker Lab Team`;
  }
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: StatusEmailRequest = await req.json();
    console.log("📧 Status email request received:", { 
      email: data.email, 
      status: data.status, 
      customer: data.fullName 
    });

    // Initialize Resend
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    // Format the data for email
    const dates = data.selectedDates.join(', ');
    const timeSlots = data.selectedTimeSlots.join(', ');
    const equipment = data.selectedEquipment.join(', ');
    
    const subject = getEmailSubject(data.status);
    const htmlContent = getEmailContent(data.status, data.fullName, dates, equipment, timeSlots);

    // Send email using Resend
    const emailResponse = await resend.emails.send({
      from: "RPL Maker Lab <onboarding@resend.dev>",
      to: [data.email],
      subject: subject,
      html: htmlContent.replace(/\n/g, '<br>'),
    });

    console.log("✅ Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email notification sent successfully',
        emailResponse: emailResponse 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: any) {
    console.error("❌ Error sending status email:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to send email notification'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
};

serve(handler);