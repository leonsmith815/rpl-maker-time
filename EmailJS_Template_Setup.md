# EmailJS Template Setup Instructions

## Step 1: Configure Your EmailJS Credentials

In `src/services/emailService.ts`, replace the placeholder values with your actual EmailJS credentials:

```javascript
const EMAILJS_CONFIG = {
  SERVICE_ID: 'your_actual_service_id', // Replace with your EmailJS Service ID
  TEMPLATE_ID: 'your_actual_template_id', // Replace with your EmailJS Template ID  
  PUBLIC_KEY: 'your_actual_public_key', // Replace with your EmailJS Public Key
};
```

## Step 2: Create EmailJS Template

Go to your EmailJS Dashboard and create a new email template with the following parameters:

### Template Variables (use these exact names):
- `{{to_email}}` - Customer's email address
- `{{customer_name}}` - Customer's full name
- `{{status}}` - Booking status (pending, scheduled, missed, cancelled)
- `{{selected_dates}}` - Formatted dates customer selected
- `{{equipment_list}}` - Equipment customer selected
- `{{time_slots}}` - Time slots customer selected
- `{{scheduled_datetime}}` - Scheduled appointment date and time (for scheduled status)
- `{{contact_email}}` - Contact email (Maker@rockfordpubliclibrary.org)
- `{{subject}}` - Email subject line
- `{{message_content}}` - Main email body content

### Email Template Structure:

**Subject:** `{{subject}}`

**Body:**
```
{{message_content}}
```

### Alternative Detailed Template:

If you prefer to customize the template directly in EmailJS instead of using the dynamic content:

**Subject:** `Maker Lab - {{status}} - {{customer_name}}`

**Body:**
```
Dear {{customer_name}},

Your Maker Lab booking status has been updated to: {{status}}

Booking Details:
- Equipment: {{equipment_list}}
- Requested Dates: {{selected_dates}}
- Time Slots: {{time_slots}}

{{#if scheduled_datetime}}
Scheduled Appointment: {{scheduled_datetime}}

IMPORTANT - CONFIRMATION REQUIRED:
You must confirm your appointment 24 hours prior to your scheduled time, or your appointment will be cancelled and you will need to reschedule.
{{/if}}

Important Reminders:
• You must confirm your appointment 24 hours prior to your scheduled time, or your appointment will be cancelled and you will need to reschedule
• Appointments will be considered missed and cancelled 15 minutes after the scheduled time

Questions? Contact us at {{contact_email}}

Best regards,
Rockford Public Library Maker Lab Team
```

## Step 3: Test the Integration

1. Update your credentials in the emailService.ts file
2. Go to your admin dashboard at `/admin`
3. Change a booking status and verify the email is sent
4. Check your EmailJS dashboard for delivery logs

## Step 4: Email Content Preview

The system will automatically send different email content based on the status:

### PENDING Status Email:
- Subject: "Maker Lab Booking Confirmation - Request Received"
- Content: Acknowledges submission, lists booking details, includes important reminders

### SCHEDULED Status Email:
- Subject: "Maker Lab Appointment Scheduled - [Date] at [Time]"
- Content: Confirms appointment details, emphasizes confirmation requirement

### MISSED Status Email:
- Subject: "Maker Lab Appointment - Marked as Missed"
- Content: Explains why marked as missed, provides rebooking instructions

### CANCELLED Status Email:
- Subject: "Maker Lab Appointment Cancelled"
- Content: Confirms cancellation, provides rebooking instructions

All emails include the contact email: Maker@rockfordpubliclibrary.org