import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Calendar, Clock } from "lucide-react";
import Layout from "@/components/Layout";
import AppointmentDialog from "@/components/AppointmentDialog";
import { fetchAppointments } from "@/utils/appointments";

interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  status: string;
  notes?: string;
}

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);

  useEffect(() => {
    fetchAppointments().then(setAppointments);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getAppointmentDateTime = (apt: Appointment) => {
    const [time, modifier] = apt.time.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    const [year, month, day] = apt.date.split('-').map(Number);
    return new Date(year, (month || 1) - 1, day || 1, hours, minutes);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingAppointments = appointments
    .filter(apt => {
      const aptDate = new Date(apt.date);
      aptDate.setHours(0, 0, 0, 0);
      return aptDate >= today;
    })
    .sort((a, b) => {
      const adt = getAppointmentDateTime(a);
      const bdt = getAppointmentDateTime(b);
      return adt.getTime() - bdt.getTime();
    });

  const handleDialogClose = (open: boolean) => {
    setIsAppointmentDialogOpen(open);
    if (!open) {
      fetchAppointments().then(setAppointments);
    }
  };

  return (
    <Layout>
      <div className="p-2 sm:p-4 md:p-6 max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-y-2">
          <h1 className="text-2xl font-bold animate-scale-in">Upcoming Appointments</h1>
          {/* No "Book New Appointment" button */}
        </div>
        {upcomingAppointments.length === 0 ? (
          <Card className="animate-fade-in">
            <CardContent className="p-8 text-center">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming appointments</h3>
              <p className="text-gray-500 mb-4">You have no appointments scheduled for today or future dates.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {upcomingAppointments.map((appointment, idx) => (
              <Card key={appointment.id || idx} className="animate-enter">
                <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center space-x-4 w-full">
                    <Heart className="h-8 w-8 text-blue-500 animate-pulse" />
                    <div>
                      <p className="font-medium text-lg">{appointment.doctor}</p>
                      <p className="text-gray-500">{appointment.specialty}</p>
                      {appointment.notes && (
                        <p className="text-sm text-gray-600 mt-1">Note: {appointment.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right min-w-[110px]">
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(appointment.date)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <Clock className="h-4 w-4 mr-1" />
                      {appointment.time}
                    </div>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      appointment.status === "Confirmed" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    } animate-fade-in`}>
                      {appointment.status}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <AppointmentDialog 
        open={isAppointmentDialogOpen} 
        onOpenChange={handleDialogClose} 
      />
    </Layout>
  );
};

export default Appointments;
