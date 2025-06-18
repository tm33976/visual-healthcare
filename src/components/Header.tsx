import { useState, useEffect } from "react";
import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import LogoutButton from "@/components/LogoutButton";
import { supabase } from "@/integrations/supabase/client";
import { fetchAppointments } from "@/utils/appointments";

interface UserProfile {
  username?: string;
  email: string;
  phone: string;
  profileImage: string;
}

interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  status: string;
  notes?: string;
}

const GUEST_KEY = "open_as_guest";

const Header = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    // Load from localStorage, fallback to default
    const fromLocal = localStorage.getItem("userProfile");
    return fromLocal
      ? JSON.parse(fromLocal)
      : {
          username: "User",
          email: "",
          phone: "",
          profileImage: "",
        };
  });
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Detect guest mode
  const isGuest = localStorage.getItem(GUEST_KEY) === "true";

  useEffect(() => {
    // Load appointments with fetchAppointments for guest/auth isolation
    fetchAppointments().then(setAppointments);

    // Listen for storage changes to update appointments in real-time (for guest mode only)
    const handleStorageChange = () => {
      if (isGuest) {
        fetchAppointments().then(setAppointments);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isGuest]);

  useEffect(() => {
    // Listen for live changes (Settings page) to userProfile in localStorage and update if needed
    const handleStorageChange = () => {
      const updated = localStorage.getItem("userProfile");
      if (updated) {
        setUserProfile((prev) => ({ ...prev, ...JSON.parse(updated) }));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    // Fetch username/email from Supabase (do not override profileImage if already set via localStorage)
    async function fetchUserProfile() {
      if (isGuest) return; // Do not fetch profile for guest session
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.id) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .maybeSingle();
        setUserProfile((up) => ({
          ...up,
          username: profileData?.username || up.username || "User",
          email: user.email || up.email || "",
        }));
      }
    }
    fetchUserProfile();
    // eslint-disable-next-line
  }, [isGuest]);

  const getInitials = () => {
    if (isGuest) return "GU";
    if (userProfile.username && userProfile.username.length > 1) {
      return userProfile.username.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  const getUpcomingAppointments = () => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    return appointments
      .filter(apt => apt.date >= todayStr)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5); // Show only next 5 appointments
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const upcomingAppointments = getUpcomingAppointments();

  // MAIN UI
  return (
    <header className="bg-white border-b border-gray-200 px-2 py-3 sm:px-4 md:px-6">
      <div className="flex flex-col gap-y-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-y-2 sm:flex-row sm:items-center sm:space-x-6">
          <h1 className="text-2xl font-bold text-blue-600 flex-shrink-0">Healthcare.</h1>
          
          <div className="relative w-full max-w-xs sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search"
              className="pl-10 w-full bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-gray-600" />
                {upcomingAppointments.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {upcomingAppointments.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 sm:w-80">
              <DropdownMenuLabel>Upcoming Appointments</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {upcomingAppointments.length === 0 ? (
                <DropdownMenuItem disabled>
                  No upcoming appointments
                </DropdownMenuItem>
              ) : (
                upcomingAppointments.map((appointment) => (
                  <DropdownMenuItem key={appointment.id} className="flex flex-col items-start p-3">
                    <div className="font-medium text-sm">{appointment.doctor}</div>
                    <div className="text-xs text-gray-500">{appointment.specialty}</div>
                    <div className="text-xs text-blue-600 mt-1">
                      {formatDate(appointment.date)} at {appointment.time}
                    </div>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              {userProfile.profileImage && !isGuest ? (
                <AvatarImage src={userProfile.profileImage} alt="Profile" />
              ) : (
                <AvatarFallback>{getInitials()}</AvatarFallback>
              )}
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">
                {isGuest ? "Guest" : userProfile.username}
              </p>
              <p className="text-xs text-gray-500">{isGuest ? "Guest" : "Patient"}</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
