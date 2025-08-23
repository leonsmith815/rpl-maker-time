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

export const sendStatusUpdateEmail = async (data: BookingEmailData): Promise<void> => {
  try {
    console.log('🚀 Starting email send process via Supabase Edge Function...');
    console.log('📧 Email request data:', {
      email: data.email,
      fullName: data.fullName,
      status: data.status,
      datesCount: data.selectedDates.length,
      equipmentCount: data.selectedEquipment.length
    });

    // Call the Supabase Edge Function
    const { data: response, error } = await supabase.functions.invoke('send-status-email', {
      body: {
        email: data.email,
        fullName: data.fullName,
        status: data.status,
        selectedDates: data.selectedDates,
        selectedTimeSlots: data.selectedTimeSlots,
        selectedEquipment: data.selectedEquipment,
        actionDate: data.actionDate
      }
    });

    console.log('📥 Edge Function Response:', { response, error });

    if (error) {
      console.error('❌ Supabase Function Error:', error);
      
      // If there's a network or connection error, log more details
      if (error.message?.includes('non-2xx status code')) {
        console.log('🔍 Checking edge function logs for detailed error...');
        console.log('📋 Edge function might have internal errors. Check the logs for detailed error information.');
      }
      
      throw new Error(`Edge function error: ${error.message}`);
    }

    if (!response?.success) {
      console.error('❌ Email sending failed:', response);
      throw new Error(response?.error || 'Email sending failed');
    }

    console.log('✅ Email sent successfully via Edge Function!');
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
