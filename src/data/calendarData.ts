
import { Heart, Calendar } from "lucide-react";

export const calendarData = Array.from({ length: 35 }, (_, index) => {
  const day = index - 5; // Start from a few days before month start
  const isCurrentMonth = day >= 1 && day <= 31;
  const hasAppointments = [15, 22, 28].includes(day);
  const isToday = day === 15;
  
  return {
    date: day > 0 ? day : '',
    isCurrentMonth,
    hasAppointments,
    isToday,
    appointments: hasAppointments ? ['09:00', '11:00', '13:00', '15:00'].slice(0, Math.floor(Math.random() * 3) + 1) : null,
  };
});

export const appointmentDetails = [
  {
    title: "Dentist",
    time: "09:00 - 10:30",
    type: "Checkup",
    icon: Heart,
    color: "bg-blue-500",
  },
  {
    title: "Physiotherapy Appointment", 
    time: "14:00 - 15:30",
    type: "Therapy",
    icon: Calendar,
    color: "bg-green-500",
  },
];
