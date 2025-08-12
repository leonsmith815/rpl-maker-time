# EmailJS Template Configuration

## Template Setup Instructions

### 1. Create New Template in EmailJS Dashboard
Go to your EmailJS dashboard and create a new email template with these settings:

### 2. Template Variables
Use these exact variable names in your template:

- `{{to_email}}` - Recipient email
- `{{customer_name}}` - Customer's name
- `{{status}}` - Booking status
- `{{selected_dates}}` - Customer's selected dates
- `{{equipment_list}}` - Selected equipment
- `{{time_slots}}` - Selected time slots
- `{{scheduled_datetime}}` - Scheduled appointment date/time
- `{{contact_email}}` - Contact email
- `{{subject}}` - Email subject
- `{{message_content}}` - Full email body

### 3. Email Template Structure

**From Name:** Rockford Public Library Maker Lab
**From Email:** [Your verified email address]
**To:** {{to_email}}
**Subject:** {{subject}}

**Email Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .content {
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #e9ecef;
            border-radius: 8px;
        }
        .footer {
            margin-top: 20px;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 8px;
            font-size: 14px;
        }
        .important {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }
        .contact-info {
            background-color: #e7f3ff;
            padding: 10px;
            border-radius: 5px;
            margin-top: 15px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>Rockford Public Library - Maker Lab</h2>
    </div>
    
    <div class="content">
        {{message_content}}
    </div>
    
    <div class="footer">
        <p><strong>Contact Information:</strong></p>
        <div class="contact-info">
            <p>📧 Email: {{contact_email}}</p>
            <p>🏛️ Rockford Public Library Maker Lab</p>
        </div>
    </div>
</body>
</html>
```

### 4. Alternative Simple Template

If you prefer a simpler text-based template:

**Subject:** {{subject}}

**Body (Text):**
```
{{message_content}}

---
Contact us at: {{contact_email}}
Rockford Public Library Maker Lab Team
```

### 5. Test Template

Create a test template first with these parameters:
- Service: [Your email service]
- Template ID: [Note this for your code]
- Test with sample data to ensure formatting works correctly

### 6. Production Template Variables

Your edge function will send these exact parameters:
```json
{
  "to_email": "customer@example.com",
  "customer_name": "John Doe",
  "status": "scheduled",
  "selected_dates": "Tuesday, January 15, 2024",
  "equipment_list": "3D Printer, Laser Cutter",
  "time_slots": "10:00 AM - 12:00 PM",
  "scheduled_datetime": "Tuesday, January 15, 2024 at 10:00 AM",
  "contact_email": "Maker@rockfordpubliclibrary.org",
  "subject": "Maker Lab Appointment Scheduled - Tuesday, January 15, 2024 at 10:00 AM",
  "message_content": "[Full formatted message content]"
}
```

### 7. Template Testing

Test your template with different status types:
1. **pending** - New booking confirmation
2. **scheduled** - Appointment confirmed with date/time
3. **missed** - Appointment was missed
4. **cancelled** - Appointment was cancelled

Your EmailJS integration is now ready to send professional emails automatically when booking statuses change!