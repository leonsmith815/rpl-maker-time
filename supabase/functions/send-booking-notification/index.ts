import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingNotificationRequest {
  email: string;
  fullName: string;
  status: string;
  selectedDates: string[];
  selectedTimeSlots: string[];
  selectedEquipment: string[];
  actionDate?: string;
}

const formatDates = (dates: string[]) => {
  return dates.map(dateStr => {
    try {
      if (dateStr.includes('-') && dateStr.length === 10) {
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
        }
      }
      return dateStr;
    } catch (error) {
      return dateStr;
    }
  });
};

const generateEmailContent = (data: BookingNotificationRequest) => {
  const { fullName, status, selectedDates, selectedTimeSlots, selectedEquipment, actionDate } = data;
  const formattedDates = formatDates(selectedDates || []);
  
  let subject = "";
  let content = "";
  
  switch (status) {
    case "scheduled":
      subject = "Your Maker Lab Session Has Been Scheduled - Confirmation Required";
      content = `
        <h2>Great News, ${fullName}!</h2>
        <p>Your Maker Lab booking has been <strong>scheduled</strong>.</p>
        
        <h3>📅 Appointment Details:</h3>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p><strong>Appointment Dates:</strong></p>
          <ul>
            ${(selectedDates && selectedDates.length > 0) ? 
              formattedDates.map(date => `<li style="margin: 5px 0;">${date}</li>`).join('') : 
              '<li>No dates specified</li>'}
          </ul>
          
          <p><strong>Time Slots:</strong></p>
          <ul>
            ${(selectedTimeSlots && selectedTimeSlots.length > 0) ? 
              selectedTimeSlots.map(time => `<li style="margin: 5px 0;">${time}</li>`).join('') : 
              '<li>No time slots specified</li>'}
          </ul>
          
          <p><strong>Equipment Reserved:</strong></p>
          <ul>
            ${(selectedEquipment && selectedEquipment.length > 0) ? 
              selectedEquipment.map(equipment => `<li style="margin: 5px 0;">${equipment}</li>`).join('') : 
              '<li>No equipment specified</li>'}
          </ul>
          
          ${actionDate ? `<p><strong>Scheduled Date:</strong> ${new Date(actionDate).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>` : ''}
        </div>
        
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #ffc107;">
          <p><strong>⚠️ IMPORTANT CONFIRMATION REQUIRED:</strong></p>
          <p>You must confirm your appointment 24 hours prior by emailing <a href="mailto:Maker@rockfordpubliclibrary.org" style="color: #2754C5;">Maker@rockfordpubliclibrary.org</a>. If not confirmed, your appointment will be cancelled and you will need to reschedule.</p>
          <p><strong>Late Arrival Policy:</strong> Your appointment will be considered missed and cancelled if you arrive more than 15 minutes after your scheduled time.</p>
        </div>
        
        <p>Please arrive on time and bring any necessary materials.</p>
        <p>Questions? Email us at <a href="mailto:Maker@rockfordpubliclibrary.org" style="color: #2754C5;">Maker@rockfordpubliclibrary.org</a></p>
      `;
      break;
      
    case "cancelled":
      subject = "Your Maker Lab Session Has Been Cancelled";
      content = `
        <h2>Session Cancelled - ${fullName}</h2>
        <p>We regret to inform you that your Maker Lab booking has been <strong>cancelled</strong>.</p>
        
        <h3>📋 Cancelled Session Details:</h3>
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #ffc107;">
          <p><strong>Cancelled Dates:</strong></p>
          <ul>
            ${(selectedDates && selectedDates.length > 0) ? 
              formattedDates.map(date => `<li style="margin: 5px 0;">${date}</li>`).join('') : 
              '<li>No dates specified</li>'}
          </ul>
          
          <p><strong>Cancelled Time Slots:</strong></p>
          <ul>
            ${(selectedTimeSlots && selectedTimeSlots.length > 0) ? 
              selectedTimeSlots.map(time => `<li style="margin: 5px 0;">${time}</li>`).join('') : 
              '<li>No time slots specified</li>'}
          </ul>
          
          <p><strong>Equipment:</strong></p>
          <ul>
            ${(selectedEquipment && selectedEquipment.length > 0) ? 
              selectedEquipment.map(equipment => `<li style="margin: 5px 0;">${equipment}</li>`).join('') : 
              '<li>No equipment specified</li>'}
          </ul>
          
          ${actionDate ? `<p><strong>Cancellation Date:</strong> ${new Date(actionDate).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>` : ''}
        </div>
        
        <p>If you would like to reschedule or have any questions about this cancellation, please contact us directly.</p>
        <p>To reschedule, please email us at <a href="mailto:Maker@rockfordpubliclibrary.org" style="color: #2754C5;">Maker@rockfordpubliclibrary.org</a></p>
      `;
      break;
      
    case "missed":
      subject = "Maker Lab Session Marked as Missed";
      content = `
        <h2>Session Missed - ${fullName}</h2>
        <p>Your Maker Lab booking has been marked as <strong>missed</strong>.</p>
        
        <h3>📋 Missed Session Details:</h3>
        <div style="background-color: #f8d7da; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #dc3545;">
          <p><strong>Missed Dates:</strong></p>
          <ul>
            ${(selectedDates && selectedDates.length > 0) ? 
              formattedDates.map(date => `<li style="margin: 5px 0;">${date}</li>`).join('') : 
              '<li>No dates specified</li>'}
          </ul>
          
          <p><strong>Missed Time Slots:</strong></p>
          <ul>
            ${(selectedTimeSlots && selectedTimeSlots.length > 0) ? 
              selectedTimeSlots.map(time => `<li style="margin: 5px 0;">${time}</li>`).join('') : 
              '<li>No time slots specified</li>'}
          </ul>
          
          <p><strong>Equipment:</strong></p>
          <ul>
            ${(selectedEquipment && selectedEquipment.length > 0) ? 
              selectedEquipment.map(equipment => `<li style="margin: 5px 0;">${equipment}</li>`).join('') : 
              '<li>No equipment specified</li>'}
          </ul>
          
          ${actionDate ? `<p><strong>Marked as Missed on:</strong> ${new Date(actionDate).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>` : ''}
        </div>
        
        <p>If you believe this was marked in error or would like to reschedule, please contact us or submit a new booking request.</p>
        <p>To book a new session, please email us at <a href="mailto:Maker@rockfordpubliclibrary.org" style="color: #2754C5;">Maker@rockfordpubliclibrary.org</a></p>
      `;
      break;
      
    default:
      subject = "Maker Lab Booking Status Update";
      content = `
        <h2>Booking Status Update - ${fullName}</h2>
        <p>Your Maker Lab booking status has been updated to: <strong>${status}</strong></p>
        
        <h3>📋 Booking Details:</h3>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p><strong>Dates:</strong></p>
          <ul>
            ${formattedDates.map(date => `<li>${date}</li>`).join('')}
          </ul>
          
          <p><strong>Time Slots:</strong></p>
          <ul>
            ${selectedTimeSlots.map(time => `<li>${time}</li>`).join('')}
          </ul>
          
          <p><strong>Equipment:</strong></p>
          <ul>
            ${selectedEquipment.map(equipment => `<li>${equipment}</li>`).join('')}
          </ul>
        </div>
      `;
  }
  
  return {
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        ${content}
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 14px;">
          This is an automated notification from the Maker Lab booking system. 
          If you have any questions, please contact us directly.
        </p>
        <p style="color: #666; font-size: 14px;">
          Best regards,<br>
          The Maker Lab Team
        </p>
      </div>
    `
  };
};

const handler = async (req: Request): Promise<Response> => {
  console.log("Booking notification function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: BookingNotificationRequest = await req.json();
    console.log("Received notification request:", data);

    const { email, fullName } = data;

    if (!email || !fullName) {
      throw new Error("Email and full name are required");
    }

    const { subject, html } = generateEmailContent(data);

    const emailResponse = await resend.emails.send({
      from: "Maker Lab <onboarding@resend.dev>",
      to: [email],
      subject: subject,
      html: html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-booking-notification function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);