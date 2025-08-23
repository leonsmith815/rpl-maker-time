import { supabase } from '@/integrations/supabase/client';

interface BookingEmailData {
  email: string;
  fullName: string;
  status: string;
  selectedDates: string[];
  selectedTimeSlots: string[];
  selectedEquipment: string[];
  actionDate?: string;
}

const getEmailSubject = (status: string): string => {
  switch (status) {
    case 'scheduled':
      return 'Your Maker Lab booking has been scheduled';
    case 'cancelled':
      return 'Your Maker Lab booking has been cancelled';
    case 'missed':
      return 'Missed Maker Lab booking notification';
    default:
      return `Maker Lab booking status update: ${status}`;
  }
};

const getEmailContent = (
  fullName: string,
  status: string,
  selectedDates: string[],
  selectedTimeSlots: string[],
  selectedEquipment: string[],
  actionDate?: string
): string => {
  const equipmentList = selectedEquipment.join(', ');
  const datesList = selectedDates.join(', ');
  const timeSlotsList = selectedTimeSlots.join(', ');
  
  let statusMessage = '';
  
  switch (status) {
    case 'scheduled':
      statusMessage = `Great news! Your Maker Lab booking has been officially scheduled.

📅 Scheduled Dates: ${datesList}
⏰ Time Slots: ${timeSlotsList}
🔧 Equipment: ${equipmentList}

Please arrive 5 minutes early for your session. If you need to make any changes, please contact us as soon as possible.`;
      break;
      
    case 'cancelled':
      statusMessage = `We're writing to inform you that your Maker Lab booking has been cancelled.

📅 Originally Scheduled: ${datesList}
⏰ Time Slots: ${timeSlotsList}
🔧 Equipment: ${equipmentList}

If you'd like to reschedule, please submit a new booking request through our website.`;
      break;
      
    case 'missed':
      statusMessage = `We noticed you missed your scheduled Maker Lab session.

📅 Missed Date: ${datesList}
⏰ Time Slot: ${timeSlotsList}
🔧 Equipment: ${equipmentList}

If you'd like to reschedule, please submit a new booking request. We understand that schedules can change!`;
      break;
      
    default:
      statusMessage = `Your Maker Lab booking status has been updated to: ${status}

📅 Dates: ${datesList}
⏰ Time Slots: ${timeSlotsList}
🔧 Equipment: ${equipmentList}`;
  }

  return `Hi ${fullName},

${statusMessage}

If you have any questions, please don't hesitate to contact us.

Best regards,
RPL Maker Lab Team`;
};

export const sendStatusUpdateEmail = async (data: BookingEmailData): Promise<void> => {
  try {
    console.log('🚀 Starting email send process via frontend EmailJS...');
    console.log('📧 Email request data:', {
      email: data.email,
      fullName: data.fullName,
      status: data.status,
      datesCount: data.selectedDates.length,
      equipmentCount: data.selectedEquipment.length
    });

    // Check if EmailJS is available
    if (!window.emailjs) {
      throw new Error('EmailJS is not loaded');
    }

    const emailContent = getEmailContent(
      data.fullName,
      data.status,
      data.selectedDates,
      data.selectedTimeSlots,
      data.selectedEquipment,
      data.actionDate
    );

    const subject = getEmailSubject(data.status);

    // Send email using EmailJS from frontend
    const response = await window.emailjs.send('service_c5hnxps', 'template_2ss175v', {
      to_email: data.email,
      customer_name: data.fullName,
      from_name: 'RPL Maker Lab',
      subject: subject,
      message_content: emailContent,
      equipment_list: data.selectedEquipment.join(', '),
      selected_dates: data.selectedDates.join(', '),
      selected_time_slots: data.selectedTimeSlots.join(', '),
      status: data.status
    });

    console.log('✅ Email sent successfully via frontend EmailJS!');
    console.log('📬 Email details:', {
      recipient: data.email,
      status: data.status,
      response: response
    });

  } catch (error: any) {
    console.error('❌ Failed to send status update email:', error);
    console.error('🔍 Error details:', {
      name: error?.name,
      message: error?.message,
      recipient: data.email,
      status: data.status
    });
    throw new Error(`Failed to send email notification: ${error?.message || 'Unknown error'}`);
  }
};

// Test function to verify email system
export const testEmailSystem = async (): Promise<boolean> => {
  try {
    console.log('🧪 Testing email system...');
    
    const testData: BookingEmailData = {
      email: 'test@example.com',
      fullName: 'Test User',
      status: 'scheduled',
      selectedDates: ['Wednesday, August 13th, 2025'],
      selectedTimeSlots: ['Wednesday 11 AM - 1 PM'],
      selectedEquipment: ['3D Printer']
    };

    await sendStatusUpdateEmail(testData);
    console.log('✅ Email system test passed');
    return true;
  } catch (error: any) {
    console.error('❌ Email system test failed:', error);
    return false;
  }
};
