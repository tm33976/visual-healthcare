
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Heart } from "lucide-react";
import Layout from "@/components/Layout";
import { fetchAppointments } from "@/utils/appointments";
import { Button } from "@/components/ui/button";

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

const History = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

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

  // Detect guest mode
  const isGuest = typeof window !== "undefined" && localStorage.getItem(GUEST_KEY) === "true";

  const handleClearData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <Layout>
      <div className="p-2 sm:p-4 md:p-6 max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-y-2">
          <h1 className="text-2xl font-bold animate-fade-in">Medical History</h1>
          {isGuest && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearData}
              className="mt-2 sm:mt-0"
            >
              Clear All Data
            </Button>
          )}
        </div>
        
        {appointments.length === 0 ? (
          <Card className="animate-fade-in">
            <CardContent className="p-8 text-center">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No medical history yet</h3>
              <p className="text-gray-500">Your appointment history will appear here once you book appointments</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment, idx) => (
              <Card key={appointment.id || idx} className="animate-enter">
                <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center space-x-4 w-full">
                    <Calendar className="h-5 w-5 text-blue-500 animate-scale-in" />
                    <div>
                      <p className="font-medium">{appointment.specialty}</p>
                      <p className="text-sm text-gray-500">{appointment.doctor}</p>
                      {appointment.notes && (
                        <p className="text-sm text-gray-600 mt-1">Note: {appointment.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right min-w-[110px]">
                    <p className="text-sm font-medium">{formatDate(appointment.date)}</p>
                    <p className="text-sm text-gray-500">{appointment.time}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
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
    </Layout>
  );
};

export default History;

