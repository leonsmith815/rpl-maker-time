import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

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

    // Use the send-emailjs-notification function which is properly configured for EmailJS
    const emailjsResponse = await fetch(`https://ztlmftmpobqfyauayxkj.supabase.co/functions/v1/send-emailjs-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0bG1mdG1wb2JxZnlhdWF5eGtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MDczMDEsImV4cCI6MjA3MDA4MzMwMX0.MZ0irP-UkC13UU70hW1u46o56nvOkyVZoutdpWzkAHk`,
      },
      body: JSON.stringify(data),
    });

    if (!emailjsResponse.ok) {
      const errorText = await emailjsResponse.text();
      console.error('❌ EmailJS notification failed:', errorText);
      throw new Error(`EmailJS notification failed: ${emailjsResponse.status} - ${errorText}`);
    }

    const emailResult = await emailjsResponse.json();
    console.log('✅ Email sent successfully via EmailJS:', emailResult);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email notification sent successfully',
        emailResponse: emailResult 
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