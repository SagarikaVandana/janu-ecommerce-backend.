import nodemailer from 'nodemailer';
import twilio from 'twilio';
import sgMail from '@sendgrid/mail';

// Configure SendGrid for email
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Configure Twilio for SMS
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN 
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

// Email transporter (using Gmail SMTP as fallback)
const emailTransporter = process.env.EMAIL_USER && process.env.EMAIL_PASSWORD 
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
  : null;

class NotificationService {
  // Send email notification
  async sendEmail(to, subject, htmlContent) {
    try {
      if (process.env.SENDGRID_API_KEY) {
        // Use SendGrid
        const msg = {
          to,
          from: process.env.FROM_EMAIL || 'noreply@janucollections.com',
          subject,
          html: htmlContent,
        };
        await sgMail.send(msg);
      } else if (emailTransporter) {
        // Use Gmail SMTP
        await emailTransporter.sendMail({
          from: process.env.EMAIL_USER,
          to,
          subject,
          html: htmlContent,
        });
      } else {
        console.log('Email service not configured. Email would be sent to:', to);
        console.log('Subject:', subject);
        console.log('Content:', htmlContent);
      }
      return true;
    } catch (error) {
      console.error('Email sending error:', error);
      return false;
    }
  }

  // Send SMS notification
  async sendSMS(to, message) {
    try {
      if (twilioClient && process.env.TWILIO_PHONE_NUMBER) {
        await twilioClient.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: to,
        });
        return true;
      } else {
        console.log('SMS service not configured. SMS would be sent to:', to);
        console.log('Message:', message);
        return false;
      }
    } catch (error) {
      console.error('SMS sending error:', error);
      return false;
    }
  }

  // Send WhatsApp notification (using Twilio WhatsApp API)
  async sendWhatsApp(to, message) {
    try {
      if (twilioClient && process.env.TWILIO_WHATSAPP_NUMBER) {
        await twilioClient.messages.create({
          body: message,
          from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
          to: `whatsapp:${to}`,
        });
        return true;
      } else {
        console.log('WhatsApp service not configured. WhatsApp would be sent to:', to);
        console.log('Message:', message);
        return false;
      }
    } catch (error) {
      console.error('WhatsApp sending error:', error);
      return false;
    }
  }

  // Generate order confirmation email HTML
  generateOrderConfirmationEmail(order, user) {
    const orderItems = order.items.map(item => 
      `<tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.size}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">₹${item.price}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">₹${item.price * item.quantity}</td>
      </tr>`
    ).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmed - Janu Collections</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4f46e5; margin: 0;">Janu Collections</h1>
            <p style="color: #666; margin: 10px 0;">Premium Women's Fashion</p>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #059669; margin: 0 0 10px 0;">✅ Order Confirmed!</h2>
            <p style="margin: 0;">Dear ${user.name},</p>
            <p style="margin: 10px 0;">Your order has been confirmed and is being processed. We'll notify you once it's shipped.</p>
          </div>
          
          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 15px 0; color: #374151;">Order Details</h3>
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Status:</strong> <span style="color: #059669; font-weight: bold;">Confirmed</span></p>
            
            <h4 style="margin: 20px 0 10px 0; color: #374151;">Items Ordered:</h4>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <thead>
                <tr style="background: #f9fafb;">
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb;">Item</th>
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb;">Size</th>
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb;">Price</th>
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb;">Qty</th>
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${orderItems}
              </tbody>
            </table>
            
            <div style="border-top: 2px solid #e5e7eb; padding-top: 15px;">
              <p><strong>Subtotal:</strong> ₹${order.totalAmount - order.shippingCost}</p>
              <p><strong>Shipping:</strong> ₹${order.shippingCost}</p>
              <p style="font-size: 18px; font-weight: bold; color: #4f46e5;"><strong>Total:</strong> ₹${order.totalAmount}</p>
            </div>
          </div>
          
          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 15px 0; color: #374151;">Shipping Address</h3>
            <p style="margin: 5px 0;">${order.shippingInfo.fullName}</p>
            <p style="margin: 5px 0;">${order.shippingInfo.address}</p>
            <p style="margin: 5px 0;">${order.shippingInfo.city}, ${order.shippingInfo.state} ${order.shippingInfo.pincode}</p>
            <p style="margin: 5px 0;">Phone: ${order.shippingInfo.phone}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 8px;">
            <p style="margin: 0 0 10px 0;">Thank you for choosing Janu Collections!</p>
            <p style="margin: 0; color: #666;">We'll keep you updated on your order status.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Generate SMS message
  generateOrderConfirmationSMS(order, user) {
    return `Hi ${user.name}! Your order #${order._id.slice(-8)} has been confirmed and is being processed. Total: ₹${order.totalAmount}. We'll notify you when it ships. Thank you for choosing Janu Collections!`;
  }

  // Generate WhatsApp message
  generateOrderConfirmationWhatsApp(order, user) {
    return `Hi ${user.name}! 🎉

Your order has been *CONFIRMED* and is being processed.

📦 Order ID: ${order._id.slice(-8)}
💰 Total Amount: ₹${order.totalAmount}
📅 Order Date: ${new Date(order.createdAt).toLocaleDateString()}

We'll notify you once your order is shipped and on its way to you.

Thank you for choosing Janu Collections! 💫

For any queries, please contact our customer support.`;
  }

  // Send order confirmation notifications
  async sendOrderConfirmationNotifications(order, user) {
    const results = {
      email: false,
      sms: false,
      whatsapp: false,
    };

    try {
      // Send email notification
      const emailSubject = `Order Confirmed - Janu Collections (Order #${order._id.slice(-8)})`;
      const emailContent = this.generateOrderConfirmationEmail(order, user);
      results.email = await this.sendEmail(user.email, emailSubject, emailContent);

      // Send SMS notification (if phone number is available)
      if (order.shippingInfo.phone) {
        const smsMessage = this.generateOrderConfirmationSMS(order, user);
        results.sms = await this.sendSMS(order.shippingInfo.phone, smsMessage);
      }

      // Send WhatsApp notification (if phone number is available)
      if (order.shippingInfo.phone) {
        const whatsappMessage = this.generateOrderConfirmationWhatsApp(order, user);
        results.whatsapp = await this.sendWhatsApp(order.shippingInfo.phone, whatsappMessage);
      }

      console.log('Notification results:', results);
      return results;
    } catch (error) {
      console.error('Error sending notifications:', error);
      return results;
    }
  }
}

export default new NotificationService(); 