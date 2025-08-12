import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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
    const requestData: StatusEmailRequest = await req.json();
    console.log("📧 Status email request received:", {
      email: requestData.email,
      status: requestData.status,
      customer: requestData.fullName
    });

    // Format data for email
    const formattedDates = requestData.selectedDates.join(', ');
    const equipmentList = requestData.selectedEquipment.join(', ');
    const timeSlots = requestData.selectedTimeSlots.join(', ');

    // Generate email content
    const emailSubject = getEmailSubject(requestData.status);
    const emailBody = getEmailContent(
      requestData.status, 
      requestData.fullName, 
      formattedDates, 
      equipmentList, 
      timeSlots
    );

    console.log("📤 Sending email via Resend:", {
      to: requestData.email,
      subject: emailSubject,
      from: "Maker Lab <Maker@rockfordpubliclibrary.org>"
    });

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: "Maker Lab <Maker@rockfordpubliclibrary.org>",
      to: [requestData.email],
      subject: emailSubject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin: 0 0 10px 0;">Rockford Public Library Maker Lab</h2>
            <p style="color: #666; margin: 0; font-size: 14px;">Booking Status Update</p>
          </div>
          
          <div style="background-color: white; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px;">
            ${emailBody.split('\n').map(line => 
              line.trim() === '' ? '<br>' : 
              line.startsWith('•') ? `<p style="margin: 5px 0; padding-left: 20px;">${line}</p>` :
              `<p style="margin: 10px 0;">${line}</p>`
            ).join('')}
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
            <p style="margin: 0; color: #666; font-size: 12px;">
              This email was sent from the Rockford Public Library Maker Lab booking system.
            </p>
          </div>
        </div>
      `,
      text: emailBody
    });

    console.log("✅ Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailResponse.data?.id,
      message: "Status update email sent successfully" 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("❌ Error sending status email:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to send status update email" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);