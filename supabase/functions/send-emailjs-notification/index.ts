import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailNotificationRequest {
  email: string;
  fullName: string;
  status: string;
  selectedDates: string[];
  selectedTimeSlots: string[];
  selectedEquipment: string[];
  actionDate: string;
}

const formatDates = (dates: string[]): string => {
  return dates.map(date => {
    try {
      const dateObj = new Date(date);
      return dateObj.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return date;
    }
  }).join(', ');
};

const formatDateTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return dateString;
  }
};

const getEmailSubject = (status: string, scheduledDateTime?: string): string => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'Maker Lab Booking Confirmation - Request Received';
    case 'scheduled':
      return `Maker Lab Appointment Scheduled - ${scheduledDateTime}`;
    case 'missed':
      return 'Maker Lab Appointment - Marked as Missed';
    case 'cancelled':
      return 'Maker Lab Appointment Cancelled';
    default:
      return 'Maker Lab Booking Update';
  }
};

const getEmailContent = (status: string, customerName: string, scheduledDateTime?: string, dates?: string, equipment?: string): string => {
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
• Equipment: ${equipment}

You will receive another email once your booking has been scheduled or if we need additional information.${baseReminder}

Best regards,
Rockford Public Library Maker Lab Team`;

    case 'scheduled':
      return `Dear ${customerName},

Great news! Your Maker Lab appointment has been scheduled.

Appointment Details:
• Date & Time: ${scheduledDateTime}
• Equipment: ${equipment}
• Duration: 2 hours

IMPORTANT - CONFIRMATION REQUIRED:
You must confirm your appointment 24 hours prior to your scheduled time, or your appointment will be cancelled and you will need to reschedule.

Please note: Appointments will be considered missed and cancelled 15 minutes after the scheduled time.${baseReminder}

Best regards,
Rockford Public Library Maker Lab Team`;

    case 'missed':
      return `Dear ${customerName},

Your Maker Lab appointment scheduled for ${scheduledDateTime || dates} has been marked as missed.

This typically occurs when:
• No confirmation was received 24 hours prior to the appointment
• You did not arrive within 15 minutes of your scheduled time

To schedule a new appointment, please submit a new booking request through our system.

Questions? Contact us at Maker@rockfordpubliclibrary.org

Best regards,
Rockford Public Library Maker Lab Team`;

    case 'cancelled':
      return `Dear ${customerName},

Your Maker Lab appointment scheduled for ${scheduledDateTime || dates} has been cancelled.

If you would like to reschedule, please submit a new booking request through our system.

Questions? Contact us at Maker@rockfordpubliclibrary.org

Best regards,
Rockford Public Library Maker Lab Team`;

    default:
      return `Dear ${customerName},

Your Maker Lab booking status has been updated to: ${status}

Questions? Contact us at Maker@rockfordpubliclibrary.org

Best regards,
Rockford Public Library Maker Lab Team`;
  }
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: EmailNotificationRequest = await req.json();

    // Validate required fields
    if (!data.email || !data.fullName || !data.status) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: email, fullName, status' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get EmailJS credentials from Supabase secrets
    const serviceId = Deno.env.get('EMAILJS_SERVICE_ID');
    const templateId = Deno.env.get('EMAILJS_TEMPLATE_ID');
    const publicKey = Deno.env.get('EMAILJS_PUBLIC_KEY');

    if (!serviceId || !templateId || !publicKey) {
      console.error('Missing EmailJS configuration');
      return new Response(
        JSON.stringify({ error: 'EmailJS configuration not found' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Format data for email
    const formattedDates = formatDates(data.selectedDates || []);
    const equipmentList = (data.selectedEquipment || []).join(', ');
    const timeSlots = (data.selectedTimeSlots || []).join(', ');
    
    let scheduledDateTime = '';
    if (data.actionDate && data.status === 'scheduled') {
      scheduledDateTime = formatDateTime(data.actionDate);
    }

    // Prepare EmailJS template parameters
    const templateParams = {
      to_email: data.email,
      customer_name: data.fullName,
      status: data.status,
      selected_dates: formattedDates,
      equipment_list: equipmentList,
      time_slots: timeSlots,
      scheduled_datetime: scheduledDateTime,
      contact_email: 'Maker@rockfordpubliclibrary.org',
      subject: getEmailSubject(data.status, scheduledDateTime),
      message_content: getEmailContent(data.status, data.fullName, scheduledDateTime, formattedDates, equipmentList),
    };

    console.log('Sending email with EmailJS...', { 
      to: data.email, 
      status: data.status,
      serviceId,
      templateId 
    });

    // Send email via EmailJS REST API with server-side configuration
    const emailResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('EMAILJS_PRIVATE_KEY')}`,
      },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: templateParams,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('EmailJS API error:', errorText);
      throw new Error(`EmailJS API error: ${emailResponse.status} - ${errorText}`);
    }

    const emailResult = await emailResponse.text();
    console.log('Email sent successfully via EmailJS:', emailResult);

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
    console.error('Error in send-emailjs-notification function:', error);
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