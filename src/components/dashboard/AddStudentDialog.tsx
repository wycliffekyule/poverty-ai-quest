import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
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
import { useToast } from "@/hooks/use-toast";

interface AddStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const studentSchema = z.object({
  student_name: z.string().trim().min(1, "Student name is required").max(100, "Student name too long"),
  class_name: z.string().trim().min(1, "Class is required").max(50, "Class name too long"),
  total_fees: z.number().positive("Total fees must be positive").max(100000, "Total fees exceeds maximum"),
  parent_name: z.string().trim().max(100, "Parent name too long").optional(),
  parent_contact: z.string().trim().max(255, "Parent contact too long").optional(),
});

export function AddStudentDialog({ open, onOpenChange }: AddStudentDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    student_name: "",
    class_name: "",
    total_fees: "",
    parent_name: "",
    parent_contact: "",
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input
    const parsed = studentSchema.safeParse({
      student_name: formData.student_name.trim(),
      class_name: formData.class_name.trim(),
      total_fees: Number(formData.total_fees),
      parent_name: formData.parent_name ? formData.parent_name.trim() : undefined,
      parent_contact: formData.parent_contact ? formData.parent_contact.trim() : undefined,
    });

    if (!parsed.success) {
      toast({
        title: "Validation Error",
        description: parsed.error.errors[0]?.message ?? "Please check your input.",
        variant: "destructive",
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast({
        title: "Error",
        description: "You must be signed in to add a student.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("students").insert({
      ...parsed.data,
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
        description: "Student added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["class-summary"] });
      onOpenChange(false);
      setFormData({
        student_name: "",
        class_name: "",
        total_fees: "",
        parent_name: "",
        parent_contact: "",
      });
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>Enter student details and fee information</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="student_name">Student Name *</Label>
            <Input
              id="student_name"
              value={formData.student_name}
              onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="class_name">Class *</Label>
            <Input
              id="class_name"
              placeholder="e.g., Grade 5A"
              value={formData.class_name}
              onChange={(e) => setFormData({ ...formData, class_name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="total_fees">Total Fees ($) *</Label>
            <Input
              id="total_fees"
              type="number"
              step="0.01"
              value={formData.total_fees}
              onChange={(e) => setFormData({ ...formData, total_fees: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="parent_name">Parent/Guardian Name</Label>
            <Input
              id="parent_name"
              value={formData.parent_name}
              onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="parent_contact">Parent Contact</Label>
            <Input
              id="parent_contact"
              placeholder="Phone or email"
              value={formData.parent_contact}
              onChange={(e) => setFormData({ ...formData, parent_contact: e.target.value })}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Student"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
