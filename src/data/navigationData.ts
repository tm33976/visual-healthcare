
import { Calendar, Home, Clock, BarChart3, FileText, HelpCircle, Settings, Heart, Lightbulb, BookOpen } from "lucide-react";

export const navigationItems = [
  {
    name: "Dashboard",
    icon: Home,
    url: "/",
  },
  {
    name: "History",
    icon: Clock,
    url: "/history",
  },
  {
    name: "Calendar",
    icon: Calendar,
    url: "/calendar",
  },
  {
    name: "Appointments",
    icon: Heart,
    url: "/appointments",
  },
  {
    name: "Statistics",
    icon: BarChart3,
    url: "/statistics",
  },
  {
    name: "Tests",
    icon: FileText,
    url: "/tests",
  },
  {
    name: "Tips",
    icon: Lightbulb,
    url: "/tips",
  },
  {
    name: "Diary",
    icon: BookOpen,
    url: "/diary",
  },
  {
    name: "Support",
    icon: HelpCircle,
    url: "/support",
  },
  {
    name: "Setting",
    icon: Settings,
    url: "/settings",
  },
];
