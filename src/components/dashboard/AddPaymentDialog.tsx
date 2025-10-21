import { useState } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface AddPaymentDialogProps {
  studentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const paymentSchema = z.object({
  amount: z.number().positive("Amount must be positive").max(100000, "Amount exceeds maximum"),
  payment_date: z.string().refine((d) => {
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return false;
    const today = new Date();
    dt.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    return dt <= today;
  }, "Cannot use future dates"),
  payment_method: z.string().trim().max(50, "Payment method too long").optional(),
  notes: z.string().trim().max(500, "Notes too long").optional(),
});

export function AddPaymentDialog({ studentId, open, onOpenChange }: AddPaymentDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    payment_date: new Date().toISOString().split("T")[0],
    payment_method: "",
    notes: "",
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: student } = useQuery({
    queryKey: ["student", studentId],
    queryFn: async () => {
      const { data } = await supabase
        .from("students")
        .select("*, payments(amount)")
        .eq("id", studentId)
        .single();
      return data;
    },
    enabled: !!studentId,
  });

  const totalPaid = student?.payments?.reduce(
    (sum: number, p: any) => sum + Number(p.amount),
    0
  ) || 0;
  const balance = student ? Number(student.total_fees) - totalPaid : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = paymentSchema.safeParse({
      amount: Number(formData.amount),
      payment_date: formData.payment_date,
      payment_method: formData.payment_method ? formData.payment_method.trim() : undefined,
      notes: formData.notes ? formData.notes.trim() : undefined,
    });

    if (!parsed.success) {
      toast({
        title: "Validation Error",
        description: parsed.error.errors[0]?.message ?? "Please check your input.",
        variant: "destructive",
      });
      return;
    }

    if (student) {
      const amount = parsed.data.amount;
      if (amount > balance && balance > 0) {
        toast({
          title: "Validation Error",
          description: "Amount exceeds remaining balance.",
          variant: "destructive",
        });
        return;
      }
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast({
        title: "Error",
        description: "You must be signed in to record a payment.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("payments").insert({
      student_id: studentId,
      amount: parsed.data.amount,
      payment_date: parsed.data.payment_date,
      payment_method: parsed.data.payment_method ?? null,
      notes: parsed.data.notes ?? null,
      created_by: user.id,
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Payment recorded successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["class-summary"] });
      queryClient.invalidateQueries({ queryKey: ["student", studentId] });
      onOpenChange(false);
      setFormData({
        amount: "",
        payment_date: new Date().toISOString().split("T")[0],
        payment_method: "",
        notes: "",
      });
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Payment</DialogTitle>
          <DialogDescription>
            Record a payment for {student?.student_name}
          </DialogDescription>
        </DialogHeader>
        {student && (
          <div className="bg-muted p-3 rounded-md mb-4">
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Fees:</span>
                <span className="font-semibold">${Number(student.total_fees).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Already Paid:</span>
                <span className="font-semibold">${totalPaid.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-1">
                <span className="text-muted-foreground">Remaining Balance:</span>
                <span className={`font-bold ${balance > 0 ? 'text-destructive' : 'text-green-600'}`}>
                  ${balance.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($) *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="payment_date">Payment Date *</Label>
            <Input
              id="payment_date"
              type="date"
              value={formData.payment_date}
              onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="payment_method">Payment Method</Label>
            <Input
              id="payment_method"
              placeholder="Cash, Check, Card, etc."
              value={formData.payment_method}
              onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes (optional)"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Recording..." : "Record Payment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
