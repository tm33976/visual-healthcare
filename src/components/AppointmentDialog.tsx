import { useState, useEffect } from "react";
import { Calendar, Clock, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { addAppointment } from "@/utils/appointments";

interface AppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedDate?: string;
}

const AppointmentDialog = ({ open, onOpenChange, preselectedDate }: AppointmentDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    doctor: "",
    date: "",
    time: "",
    notes: "",
  });

  // Set preselected date when dialog opens
  useEffect(() => {
    if (open && preselectedDate) {
      setFormData(prev => ({ ...prev, date: preselectedDate }));
    }
  }, [open, preselectedDate]);

  const doctors = [
    { id: "dr-arjun", name: "Dr. Arjun Mehta", specialty: "Cardiology" },
    { id: "dr-neha", name: "Dr. Neha Gupta", specialty: "Dermatology" },
    { id: "dr-rohit", name: "Dr. Rohit Agarwal", specialty: "Orthopedic" },
    { id: "dr-priya", name: "Dr. Priya Sharma", specialty: "General Medicine" },
  ];

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.doctor || !formData.date || !formData.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Find selected doctor
    const selectedDoctor = doctors.find(doc => doc.id === formData.doctor);
    
    // Create appointment object
    const appointment = {
      id: Date.now().toString(),
      doctor: selectedDoctor?.name || "",
      specialty: selectedDoctor?.specialty || "",
      date: formData.date,
      time: formData.time,
      notes: formData.notes,
      status: "Confirmed",
      createdAt: new Date().toISOString()
    };

    // Save using our new utility (works for guest or authenticated)
    const success = await addAppointment(appointment);
    if (success) {
      toast({
        title: "Appointment Booked Successfully!",
        description: `Your appointment with ${selectedDoctor?.name} on ${formData.date} at ${formData.time} has been scheduled.`,
        duration: 5000,
      });
    } else {
      toast({
        title: "Failed to book appointment",
        description: "There was an error saving your appointment.",
        variant: "destructive",
      });
    }
    // Reset form and close dialog
    setFormData({ doctor: "", date: "", time: "", notes: "" });
    onOpenChange(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Book Appointment
          </DialogTitle>
          <DialogDescription>
            Schedule your appointment with one of our healthcare professionals.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="doctor" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Select Doctor *
            </Label>
            <Select value={formData.doctor} onValueChange={(value) => handleInputChange("doctor", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Appointment Date *
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Appointment Time *
            </Label>
            <Select value={formData.time} onValueChange={(value) => handleInputChange("time", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select time slot" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Additional Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Any specific concerns or symptoms..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Book Appointment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDialog;
