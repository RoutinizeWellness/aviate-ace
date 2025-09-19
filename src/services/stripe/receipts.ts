// Receipt generation service for Stripe payments

import { generateReceipt } from './backend';

// Generate and download receipt as PDF
export const downloadReceipt = async (paymentIntentId: string) => {
  try {
    // In a real implementation, you would fetch the payment intent details
    const paymentIntent = {
      id: paymentIntentId,
      amount: 9999, // $99.99
      currency: 'usd',
      created: Math.floor(Date.now() / 1000),
      description: 'Aviate Ace Subscription',
      metadata: {
        userId: 'user_mock123',
        planId: 'a320-basic'
      }
    };
    
    // Generate receipt
    const receipt = await generateReceipt(paymentIntent);
    
    // In a real implementation, you would either:
    // 1. Redirect to the hosted receipt URL
    // 2. Generate a PDF and trigger download
    // 3. Return the receipt data for display
    
    console.log('Receipt generated:', receipt);
    
    // For demo purposes, we'll just return the receipt data
    return {
      ...receipt,
      paymentIntent,
      downloadUrl: receipt.hosted_invoice_url || receipt.url
    };
  } catch (error) {
    console.error('Error generating receipt:', error);
    throw new Error('Failed to generate receipt');
  }
};

// Generate receipt HTML for display
export const generateReceiptHtml = (receiptData: any) => {
  const {
    paymentIntent,
    customerName = 'John Doe',
    customerEmail = 'john@example.com'
  } = receiptData;
  
  const amount = (paymentIntent.amount / 100).toFixed(2);
  const date = new Date(paymentIntent.created * 1000).toLocaleDateString();
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Payment Receipt</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .company-info { text-align: left; }
        .receipt-info { text-align: right; }
        .details-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .details-table td, .details-table th { border: 1px solid #ddd; padding: 12px; text-align: left; }
        .details-table th { background-color: #f5f5f5; }
        .total-row { font-weight: bold; }
        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <div style="display: flex; justify-content: space-between;">
          <div class="company-info">
            <h1>Aviate Ace</h1>
            <p>123 Aviation Way<br>Flight City, FC 12345</p>
          </div>
          <div class="receipt-info">
            <h2>Payment Receipt</h2>
            <p>Receipt #: ${paymentIntent.id.substring(0, 10)}<br>
            Date: ${date}<br>
            Payment Method: Card ending in 4242</p>
          </div>
        </div>
      </div>
      
      <div>
        <h3>Bill To:</h3>
        <p>${customerName}<br>${customerEmail}</p>
      </div>
      
      <table class="details-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${paymentIntent.description}</td>
            <td>$${amount}</td>
          </tr>
          <tr class="total-row">
            <td>Total Paid</td>
            <td>$${amount}</td>
          </tr>
        </tbody>
      </table>
      
      <div class="footer">
        <p>Thank you for your business!<br>
        This is an automated receipt. No signature required.</p>
      </div>
    </body>
    </html>
  `;
};

// Send receipt via email
export const sendReceiptEmail = async (receiptData: any) => {
  try {
    // In a real implementation, you would send an email with the receipt
    console.log('Sending receipt email to:', receiptData.customerEmail);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { success: true, message: 'Receipt email sent successfully' };
  } catch (error) {
    console.error('Error sending receipt email:', error);
    throw new Error('Failed to send receipt email');
  }
};

// Get receipt history for a user
export const getReceiptHistory = async (userId: string) => {
  try {
    // In a real implementation, you would fetch receipt history from your database
    console.log(`Fetching receipt history for user ${userId}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock receipt history
    return [
      {
        id: 'rc_mock1',
        paymentIntentId: 'pi_mock1',
        amount: 9999,
        currency: 'usd',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        description: 'Aviate Ace A320 Type Rating - Premium',
        url: 'https://example.com/receipt/rc_mock1'
      },
      {
        id: 'rc_mock2',
        paymentIntentId: 'pi_mock2',
        amount: 19999,
        currency: 'usd',
        date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
        description: 'Aviate Ace Complete Package',
        url: 'https://example.com/receipt/rc_mock2'
      }
    ];
  } catch (error) {
    console.error('Error fetching receipt history:', error);
    throw new Error('Failed to fetch receipt history');
  }
};