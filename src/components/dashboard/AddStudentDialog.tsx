import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from("students").insert({
      ...formData,
      total_fees: Number(formData.total_fees),
      created_by: user?.id,
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
