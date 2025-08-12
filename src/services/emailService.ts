import emailjs from '@emailjs/browser';
import { format } from 'date-fns';

// EmailJS Configuration - Your actual credentials
const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_c5hnxps', // Your EmailJS Service ID
  TEMPLATE_ID: 'template_2ss175v', // Your EmailJS Template ID  
  PUBLIC_KEY: 'ExUWNRz9bRhzQFxBM', // Your EmailJS Public Key
};

interface BookingEmailData {
  email: string;
  fullName: string;
  status: string;
  selectedDates: string[];
  selectedTimeSlots: string[];
  selectedEquipment: string[];
  actionDate: string;
}

export const sendStatusUpdateEmail = async (data: BookingEmailData): Promise<void> => {
  try {
    console.log('🚀 Starting email send process...');
    console.log('📧 EmailJS Config:', {
      serviceId: EMAILJS_CONFIG.SERVICE_ID,
      templateId: EMAILJS_CONFIG.TEMPLATE_ID,
      publicKey: EMAILJS_CONFIG.PUBLIC_KEY?.substring(0, 8) + '...' // Only show first 8 chars for security
    });

    // Initialize EmailJS with your public key
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

    // Format dates for display
    const formattedDates = data.selectedDates.map(date => {
      try {
        return format(new Date(date), 'EEEE, MMMM d, yyyy');
      } catch {
        return date; // fallback to original if parsing fails
      }
    }).join(', ');

    // Format equipment list
    const equipmentList = data.selectedEquipment.join(', ');

    // Format time slots
    const timeSlots = data.selectedTimeSlots.join(', ');

    // Format action date/time
    let scheduledDateTime = '';
    if (data.actionDate && data.status === 'scheduled') {
      try {
        const actionDate = new Date(data.actionDate);
        scheduledDateTime = format(actionDate, 'EEEE, MMMM d, yyyy \'at\' h:mm a');
      } catch {
        scheduledDateTime = data.actionDate;
      }
    }

    // Prepare email template parameters - matching exactly what EmailJS template expects
    const templateParams = {
      to_email: data.email,
      to_name: data.fullName,
      customer_name: data.fullName,
      status: data.status,
      booking_status: data.status,
      selected_dates: formattedDates,
      requested_dates: formattedDates,
      equipment_list: equipmentList,
      equipment: equipmentList,
      time_slots: timeSlots,
      times: timeSlots,
      scheduled_datetime: scheduledDateTime,
      appointment_datetime: scheduledDateTime,
      contact_email: 'Maker@rockfordpubliclibrary.org',
      from_email: 'Maker@rockfordpubliclibrary.org',
      from_name: 'Rockford Public Library Maker Lab',
      reply_to: 'Maker@rockfordpubliclibrary.org',
      
      // Status-specific content
      subject: getEmailSubject(data.status, scheduledDateTime),
      email_subject: getEmailSubject(data.status, scheduledDateTime),
      message: getEmailContent(data.status, data.fullName, scheduledDateTime, formattedDates, equipmentList),
      message_content: getEmailContent(data.status, data.fullName, scheduledDateTime, formattedDates, equipmentList),
      email_body: getEmailContent(data.status, data.fullName, scheduledDateTime, formattedDates, equipmentList),
    };

    console.log('📤 Sending email with detailed params:', {
      to_email: templateParams.to_email,
      customer_name: templateParams.customer_name,
      status: templateParams.status,
      subject: templateParams.subject,
      templateParamsKeys: Object.keys(templateParams)
    });

    // Send email via EmailJS
    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams
    );

    console.log('✅ EmailJS Response:', response);
    console.log('📬 Email should be sent to:', data.email);
    
    if (response.status === 200) {
      console.log('🎉 Email sent successfully! Customer should receive notification.');
    } else {
      console.warn('⚠️ Unexpected response status:', response.status);
    }

  } catch (error) {
    console.error('❌ Failed to send email:', error);
    console.error('🔍 Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    throw new Error(`Failed to send email notification: ${error.message}`);
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
