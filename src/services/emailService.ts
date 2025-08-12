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
      publicKey: EMAILJS_CONFIG.PUBLIC_KEY?.substring(0, 8) + '...'
    });

    // Initialize EmailJS with your public key
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

    // Format dates for display
    const formattedDates = data.selectedDates.join(', ');
    const equipmentList = data.selectedEquipment.join(', ');
    const timeSlots = data.selectedTimeSlots.join(', ');

    // Create complete email content
    const emailSubject = getEmailSubject(data.status);
    const emailBody = getEmailContent(data.status, data.fullName, formattedDates, equipmentList, timeSlots);

    // Simplified template parameters - only essential ones
    const templateParams = {
      to_name: data.fullName,
      to_email: data.email,
      from_name: 'Rockford Public Library Maker Lab',
      from_email: 'Maker@rockfordpubliclibrary.org',
      reply_to: 'Maker@rockfordpubliclibrary.org',
      subject: emailSubject,
      message: emailBody,
      customer_name: data.fullName,
      status: data.status,
      selected_dates: formattedDates,
      equipment: equipmentList,
      time_slots: timeSlots
    };

    console.log('📤 Sending simplified email params:', {
      to_email: templateParams.to_email,
      subject: templateParams.subject,
      message_preview: templateParams.message.substring(0, 100) + '...'
    });

    // Send email via EmailJS
    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams
    );

    console.log('✅ EmailJS Response:', response);
    
    if (response.status === 200) {
      console.log('🎉 Email sent successfully to:', data.email);
      
      // Additional verification - log exactly what was sent
      console.log('📧 Email Details Sent:', {
        recipient: data.email,
        subject: emailSubject,
        status: data.status,
        service: EMAILJS_CONFIG.SERVICE_ID,
        template: EMAILJS_CONFIG.TEMPLATE_ID
      });
    } else {
      console.warn('⚠️ Unexpected response status:', response.status);
      throw new Error(`EmailJS returned status ${response.status}`);
    }

  } catch (error: any) {
    console.error('❌ Failed to send email:', error);
    console.error('🔍 Error details:', {
      name: error?.name,
      message: error?.message,
      emailConfig: {
        service: EMAILJS_CONFIG.SERVICE_ID,
        template: EMAILJS_CONFIG.TEMPLATE_ID,
        recipient: data.email
      }
    });
    throw new Error(`Failed to send email notification: ${error?.message || 'Unknown error'}`);
  }
};

// Test function to verify EmailJS setup
export const testEmailJSConnection = async (): Promise<boolean> => {
  try {
    console.log('🧪 Testing EmailJS connection...');
    
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    
    const testParams = {
      to_name: 'Test User',
      to_email: 'test@example.com',
      from_name: 'Rockford Public Library Maker Lab',
      subject: 'EmailJS Connection Test',
      message: 'This is a test email to verify EmailJS configuration.'
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      testParams
    );

    console.log('✅ Test email response:', response);
    return response.status === 200;
  } catch (error: any) {
    console.error('❌ EmailJS test failed:', error);
    return false;
  }
};

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
