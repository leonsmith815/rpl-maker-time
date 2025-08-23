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
    const requestData: StatusEmailRequest = await req.json();
    console.log("📧 Status email request received:", {
      email: requestData.email,
      status: requestData.status,
      customer: requestData.fullName
    });

    // Get EmailJS credentials from environment
    const EMAILJS_SERVICE_ID = Deno.env.get("EMAILJS_SERVICE_ID") || "service_c5hnxps";
    const EMAILJS_TEMPLATE_ID = Deno.env.get("EMAILJS_TEMPLATE_ID") || "template_2ss175v";
    const EMAILJS_PUBLIC_KEY = Deno.env.get("EMAILJS_PUBLIC_KEY") || "ExUWNRz9bRhzQFxBM";
    const EMAILJS_PRIVATE_KEY = Deno.env.get("EMAILJS_PRIVATE_KEY");

    console.log("🔑 EmailJS Config:", {
      serviceId: EMAILJS_SERVICE_ID,
      templateId: EMAILJS_TEMPLATE_ID,
      publicKey: EMAILJS_PUBLIC_KEY?.substring(0, 8) + "...",
      hasPrivateKey: !!EMAILJS_PRIVATE_KEY
    });

    if (!EMAILJS_PRIVATE_KEY) {
      console.error("❌ Missing EMAILJS_PRIVATE_KEY");
      throw new Error("EMAILJS_PRIVATE_KEY environment variable is required for server-side EmailJS calls");
    }

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

    // Prepare EmailJS template parameters
    const templateParams = {
      to_name: requestData.fullName,
      to_email: requestData.email,
      from_name: 'Rockford Public Library Maker Lab',
      from_email: 'Maker@rockfordpubliclibrary.org',
      reply_to: 'Maker@rockfordpubliclibrary.org',
      subject: emailSubject,
      message: emailBody,
      customer_name: requestData.fullName,
      status: requestData.status,
      selected_dates: formattedDates,
      equipment: equipmentList,
      time_slots: timeSlots
    };

    console.log("📤 Sending email via EmailJS:", {
      service: EMAILJS_SERVICE_ID,
      template: EMAILJS_TEMPLATE_ID,
      to: requestData.email,
      subject: emailSubject,
      templateParamsKeys: Object.keys(templateParams)
    });

    // Send email via EmailJS REST API
    const emailResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        accessToken: EMAILJS_PRIVATE_KEY,
        template_params: templateParams
      })
    });

    console.log("📡 EmailJS API Response Status:", emailResponse.status);

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("❌ EmailJS API Error Details:", {
        status: emailResponse.status,
        statusText: emailResponse.statusText,
        error: errorText,
        headers: Object.fromEntries(emailResponse.headers.entries())
      });
      throw new Error(`EmailJS API error: ${emailResponse.status} - ${errorText}`);
    }

    const responseText = await emailResponse.text();
    console.log("✅ EmailJS Success Response:", responseText);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Status update email sent successfully via EmailJS",
      emailjsResponse: responseText
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