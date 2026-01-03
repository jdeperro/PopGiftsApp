/**
 * SMS Service
 * 
 * Handles all SMS messaging via Twilio
 */

import twilio from 'twilio';

export interface SMSMessage {
  to: string;
  body: string;
  from?: string;
}

export interface SMSResult {
  sid: string;
  status: string;
  to: string;
  from: string;
  body: string;
}

class SMSService {
  private client: any;
  private fromNumber: string;
  private useMock: boolean;

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER || '+18553890451';

    // Use mock if credentials are test credentials or not configured
    const isTestCredentials = accountSid?.startsWith('ACtest');
    this.useMock = !accountSid || !authToken || isTestCredentials;

    if (this.useMock) {
      console.log('📱 Using MOCK SMS service (test credentials or not configured)');
      this.client = null;
    } else {
      this.client = twilio(accountSid, authToken);
      console.log('📱 Twilio SMS service initialized with REAL credentials');
    }
  }

  /**
   * Send a single SMS message
   */
  async sendSMS(to: string, body: string): Promise<SMSResult> {
    // Format phone number
    const formattedTo = this.formatPhoneNumber(to);

    if (this.useMock || !this.client) {
      // Mock mode - log to console
      console.log('\n📱 [MOCK SMS SENT]');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`📞 To: ${formattedTo}`);
      console.log(`📤 From: ${this.fromNumber}`);
      console.log(`💬 Message:`);
      console.log(`   ${body}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      return {
        sid: `mock_sms_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        status: 'delivered',
        to: formattedTo,
        from: this.fromNumber,
        body: body
      };
    }

    try {
      const message = await this.client.messages.create({
        body: body,
        from: this.fromNumber,
        to: formattedTo
      });

      console.log('✅ SMS sent:', message.sid);

      return {
        sid: message.sid,
        status: message.status,
        to: message.to,
        from: message.from,
        body: message.body
      };
    } catch (error) {
      console.error('❌ Failed to send SMS:', error);
      throw error;
    }
  }

  /**
   * Send gift link to recipient
   */
  async sendGiftLink(recipientPhone: string, giftUrl: string, senderName?: string): Promise<SMSResult> {
    const message = senderName
      ? `🎁 ${senderName} sent you a gift! Open it here: ${giftUrl}`
      : `🎁 You've received a gift! Open it here: ${giftUrl}`;

    return this.sendSMS(recipientPhone, message);
  }

  /**
   * Send group gift notification
   */
  async sendGroupGiftNotification(
    recipientPhone: string,
    viewerPhones: string[],
    giftUrl: string,
    senderName?: string
  ): Promise<{ recipient: SMSResult; viewers: SMSResult[] }> {
    // Send to recipient
    const recipientMessage = senderName
      ? `🎉 ${senderName} and friends sent you a group gift! ${giftUrl}`
      : `🎉 You've received a group gift from friends! ${giftUrl}`;

    const recipientResult = await this.sendSMS(recipientPhone, recipientMessage);

    // Send to all viewers
    const viewerMessage = `🎁 Your group gift has been sent! The recipient will love it.`;
    const viewerResults = await Promise.all(
      viewerPhones.map(phone => this.sendSMS(phone, viewerMessage))
    );

    return {
      recipient: recipientResult,
      viewers: viewerResults
    };
  }

  /**
   * Send viewer invitation
   */
  async sendViewerInvitation(
    viewerPhone: string,
    invitationUrl: string,
    senderName: string,
    recipientName: string
  ): Promise<SMSResult> {
    const message = `🎁 ${senderName} invited you to contribute to a group gift for ${recipientName}! Join here: ${invitationUrl}`;
    return this.sendSMS(viewerPhone, message);
  }

  /**
   * Send viewer message after card is opened
   */
  async sendViewerMessage(
    recipientPhone: string,
    viewerName: string,
    message: string
  ): Promise<SMSResult> {
    const fullMessage = `💌 Message from ${viewerName}: ${message}`;
    return this.sendSMS(recipientPhone, fullMessage);
  }

  /**
   * Send verification code for phone authentication
   */
  async sendVerificationCode(phoneNumber: string, code: string): Promise<SMSResult> {
    const message = `Your Pop Gifts verification code is: ${code}. Valid for 5 minutes.`;
    return this.sendSMS(phoneNumber, message);
  }

  /**
   * Send multiple SMS messages (batch)
   */
  async sendBatch(messages: SMSMessage[]): Promise<SMSResult[]> {
    return Promise.all(
      messages.map(msg =>
        this.sendSMS(msg.to, msg.body)
      )
    );
  }

  /**
   * Check message status
   */
  async getMessageStatus(messageSid: string): Promise<string> {
    if (!this.client) {
      return 'sent'; // Mock
    }

    try {
      const message = await this.client.messages(messageSid).fetch();
      return message.status;
    } catch (error) {
      console.error('Failed to fetch message status:', error);
      throw error;
    }
  }

  /**
   * Format phone number to E.164 format
   */
  private formatPhoneNumber(phone: string): string {
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '');

    // Add country code if missing (assume US)
    if (digits.length === 10) {
      return `+1${digits}`;
    }

    if (digits.length === 11 && digits.startsWith('1')) {
      return `+${digits}`;
    }

    // Already has country code
    if (phone.startsWith('+')) {
      return phone;
    }

    return `+${digits}`;
  }

  /**
   * Validate phone number format
   */
  isValidPhoneNumber(phone: string): boolean {
    const formatted = this.formatPhoneNumber(phone);
    // Basic validation: must start with + and have 11-15 digits
    return /^\+\d{11,15}$/.test(formatted);
  }
}

// Export singleton instance
export const smsService = new SMSService();
export default smsService;
