## EmailJS Template Code - Copy and Paste

### SUBJECT LINE:
```
{{subject}}
```

### EMAIL BODY (HTML Template):
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
            background-color: #f5f5f5;
        }
        .container {
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background-color: #2563eb;
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 30px 20px;
            white-space: pre-line;
        }
        .important-box {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .contact-box {
            background-color: #dbeafe;
            border: 1px solid #3b82f6;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
        }
        .footer {
            background-color: #f8fafc;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
            font-size: 14px;
            color: #64748b;
        }
        .status-badge {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 12px;
            margin-bottom: 10px;
        }
        .status-pending { background-color: #fbbf24; color: #92400e; }
        .status-scheduled { background-color: #34d399; color: #047857; }
        .status-missed { background-color: #f87171; color: #dc2626; }
        .status-cancelled { background-color: #6b7280; color: #374151; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔧 Rockford Public Library</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px;">Maker Lab</p>
        </div>
        
        <div class="content">
            <div class="status-badge status-{{status}}">{{status}}</div>
            
            {{message_content}}
            
            <div class="contact-box">
                <strong>📧 Questions or Need Help?</strong><br>
                Contact us at: <a href="mailto:{{contact_email}}" style="color: #2563eb; text-decoration: none;">{{contact_email}}</a>
            </div>
        </div>
        
        <div class="footer">
            <p>This email was sent from the Rockford Public Library Maker Lab booking system.</p>
            <p>© Rockford Public Library - Maker Lab Team</p>
        </div>
    </div>
</body>
</html>
```

### ALTERNATIVE - Simple Text Template:
If you prefer text-only emails, use this instead:

```
{{message_content}}

---
📧 Contact: {{contact_email}}
🏛️ Rockford Public Library Maker Lab Team

This is an automated message from the Maker Lab booking system.
```

### COPY THESE EXACT STEPS:

1. **Go to EmailJS Dashboard → Templates → Create New Template**

2. **Paste this in the SUBJECT field:**
   ```
   {{subject}}
   ```

3. **Paste the HTML code above in the CONTENT/BODY field**

4. **Set TO field as:**
   ```
   {{to_email}}
   ```

5. **Save the template and note the Template ID**

That's it! Your template is ready to receive the dynamic content from your admin dashboard.