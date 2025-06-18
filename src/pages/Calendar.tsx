import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
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

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = () => {
    fetchAppointments().then(setAppointments);
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getAppointmentsForDate = (date: string) => {
    return appointments.filter(apt => apt.date === date);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const formatDateForStorage = (day: number) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    );
  };

  const handleDateClick = (day: number) => {
    const dateStr = formatDateForStorage(day);
    setSelectedDate(dateStr);
    setIsAppointmentDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setIsAppointmentDialogOpen(open);
    if (!open) {
      loadAppointments();
      setSelectedDate("");
    }
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const totalCells = Math.ceil((daysInMonth + firstDay) / 7) * 7;

  return (
    <Layout>
      <div className="p-2 sm:p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-y-2">
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <h1 className="text-2xl font-bold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h1>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Calendar View</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map(day => (
                <div
                  key={day}
                  className="p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-gray-500 border-b"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: totalCells }, (_, index) => {
                const day = index - firstDay + 1;
                const isValidDay = day > 0 && day <= daysInMonth;
                const dateStr = isValidDay ? formatDateForStorage(day) : "";
                const dayAppointments = isValidDay ? getAppointmentsForDate(dateStr) : [];
                const isTodayCell = isValidDay && isToday(day);

                return (
                  <div
                    key={index}
                    className={`min-h-[80px] sm:min-h-[120px] p-1 sm:p-2 border rounded-lg cursor-pointer transition-colors ${
                      isValidDay
                        ? isTodayCell
                          ? "bg-blue-50 border-blue-200 hover:bg-blue-100"
                          : "bg-white border-gray-200 hover:bg-gray-50"
                        : "bg-gray-50 border-gray-100"
                    }`}
                    onClick={() => isValidDay && handleDateClick(day)}
                  >
                    {isValidDay && (
                      <>
                        <div className={`text-xs sm:text-sm font-medium mb-1 ${
                          isTodayCell ? "text-blue-600" : "text-gray-900"
                        }`}>
                          {day}
                        </div>
                        <div className="space-y-1">
                          {dayAppointments.slice(0, 3).map((appointment, idx) => (
                            <div
                              key={idx}
                              className="text-[10px] sm:text-xs p-1 bg-blue-100 text-blue-800 rounded truncate"
                              title={`${appointment.time} - ${appointment.doctor}`}
                            >
                              {appointment.time} {appointment.doctor}
                            </div>
                          ))}
                          {dayAppointments.length > 3 && (
                            <div className="text-[10px] sm:text-xs text-gray-500">
                              +{dayAppointments.length - 3} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        {appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]).length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Today's Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {appointments
                  .filter(apt => apt.date === new Date().toISOString().split('T')[0])
                  .map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg gap-2"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{appointment.doctor}</p>
                        <p className="text-xs sm:text-sm text-gray-600">{appointment.specialty}</p>
                        {appointment.notes && (
                          <p className="text-[10px] sm:text-xs text-gray-500 mt-1">{appointment.notes}</p>
                        )}
                      </div>
                      <div className="text-right min-w-[90px]">
                        <p className="text-xs sm:text-sm font-medium text-blue-600">{appointment.time}</p>
                        <Badge variant="outline" className="mt-1">
                          {appointment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <AppointmentDialog
        open={isAppointmentDialogOpen}
        onOpenChange={handleDialogClose}
        preselectedDate={selectedDate}
      />
    </Layout>
  );
};

export default Calendar;
