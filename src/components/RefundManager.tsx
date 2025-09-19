import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { processRefund } from '@/services/stripe/backend';

const RefundManager = () => {
  const { toast } = useToast();
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [refundType, setRefundType] = useState('full');
  const [customAmount, setCustomAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentIntentId) {
      toast({
        title: "Error",
        description: "Please enter a payment intent ID",
        variant: "destructive",
      });
      return;
    }
    
    let refundAmount: number | undefined;
    if (refundType === 'partial') {
      if (!customAmount) {
        toast({
          title: "Error",
          description: "Please enter a refund amount",
          variant: "destructive",
        });
        return;
      }
      refundAmount = parseFloat(customAmount) * 100; // Convert to cents
    }
    
    try {
      setProcessing(true);
      
      await processRefund({
        paymentIntentId,
        amount: refundAmount,
        reason
      });
      
      toast({
        title: "Success",
        description: "Refund has been processed successfully",
      });
      
      // Reset form
      setPaymentIntentId('');
      setAmount('');
      setReason('');
      setRefundType('full');
      setCustomAmount('');
    } catch (error) {
      console.error('Error processing refund:', error);
      toast({
        title: "Error",
        description: "Failed to process refund",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Refund</CardTitle>
        <CardDescription>
          Process a refund for a previous payment
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="paymentIntentId">Payment Intent ID</Label>
            <Input
              id="paymentIntentId"
              value={paymentIntentId}
              onChange={(e) => setPaymentIntentId(e.target.value)}
              placeholder="Enter payment intent ID"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Refund Type</Label>
            <Select value={refundType} onValueChange={setRefundType}>
              <SelectTrigger>
                <SelectValue placeholder="Select refund type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full Refund</SelectItem>
                <SelectItem value="partial">Partial Refund</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {refundType === 'partial' && (
            <div className="space-y-2">
              <Label htmlFor="customAmount">Refund Amount</Label>
              <Input
                id="customAmount"
                type="number"
                step="0.01"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Enter refund amount"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Refund</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="duplicate">Duplicate</SelectItem>
                <SelectItem value="fraudulent">Fraudulent</SelectItem>
                <SelectItem value="requested_by_customer">Requested by Customer</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {reason === 'other' && (
            <div className="space-y-2">
              <Label htmlFor="customReason">Custom Reason</Label>
              <Textarea
                id="customReason"
                placeholder="Enter custom reason for refund"
              />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full"
            disabled={processing}
          >
            {processing ? 'Processing Refund...' : 'Process Refund'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default RefundManager;