
import { Heart, Calendar, Bone, Wind } from "lucide-react";

export const upcomingScheduleData = [
  {
    day: "On Thursday",
    appointments: [
      {
        title: "Health checkup complete",
        time: "09:00 AM",
        type: "Checkup",
        icon: Heart,
        color: "bg-green-500",
        doctor: "Dr. Arjun Mehta"
      },
      {
        title: "Ophthalmologist",
        time: "11:30 AM", 
        type: "Eyes",
        icon: Calendar,
        color: "bg-blue-500",
        doctor: "Dr. Sunita Reddy"
      },
    ],
  },
  {
    day: "On Saturday",
    appointments: [
      {
        title: "Cardiologist",
        time: "10:00 AM",
        type: "Heart",
        icon: Heart,
        color: "bg-red-500",
        doctor: "Dr. Vikram Singh"
      },
      {
        title: "Neurologist",
        time: "14:00 PM",
        type: "Brain",
        icon: Bone,
        color: "bg-purple-500",
        doctor: "Dr. Kavita Joshi"
      },
    ],
  },
];
