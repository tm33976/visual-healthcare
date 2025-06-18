
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { calendarData, appointmentDetails } from "@/data/calendarData";

const CalendarView = () => {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Get current date and format month/year
  const currentDate = new Date();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const currentMonth = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Calendar className="mr-2 h-5 w-5" />
          {currentMonth}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Calendar Grid */}
        <div className="mb-6">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {calendarData.map((day, index) => (
              <div
                key={index}
                className={`aspect-square flex flex-col items-center justify-start p-1 text-sm border rounded ${
                  day.isCurrentMonth
                    ? day.hasAppointments
                      ? 'bg-blue-50 border-blue-200'
                      : day.isToday
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-200 hover:bg-gray-50'
                    : 'text-gray-300 border-gray-100'
                }`}
              >
                <span className="font-medium">{day.date}</span>
                {day.appointments && (
                  <div className="flex flex-col space-y-1 mt-1">
                    {day.appointments.map((time, timeIndex) => (
                      <span
                        key={timeIndex}
                        className="text-xs bg-blue-100 text-blue-700 px-1 rounded"
                      >
                        {time}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Appointment Details */}
        <div className="space-y-4">
          {appointmentDetails.map((appointment, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className={`p-2 rounded-full ${appointment.color}`}>
                <appointment.icon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{appointment.title}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="mr-1 h-3 w-3" />
                  {appointment.time}
                </div>
              </div>
              <Badge variant="outline">{appointment.type}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarView;
