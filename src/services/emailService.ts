import emailjs from '@emailjs/browser';
import { format } from 'date-fns';

// EmailJS Configuration - Replace with your actual values
const EMAILJS_CONFIG = {
  SERVICE_ID: 'YOUR_SERVICE_ID', // Replace with your EmailJS Service ID
  TEMPLATE_ID: 'YOUR_TEMPLATE_ID', // Replace with your EmailJS Template ID  
  PUBLIC_KEY: 'YOUR_PUBLIC_KEY', // Replace with your EmailJS Public Key
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

    // Prepare email template parameters
    const templateParams = {
      to_email: data.email,
      customer_name: data.fullName,
      status: data.status,
      selected_dates: formattedDates,
      equipment_list: equipmentList,
      time_slots: timeSlots,
      scheduled_datetime: scheduledDateTime,
      contact_email: 'Maker@rockfordpubliclibrary.org',
      
      // Status-specific content
      subject: getEmailSubject(data.status, scheduledDateTime),
      message_content: getEmailContent(data.status, data.fullName, scheduledDateTime, formattedDates, equipmentList),
    };

    console.log('Sending email with params:', templateParams);

    // Send email via EmailJS
    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams
    );

    console.log('Email sent successfully:', response);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send email notification');
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