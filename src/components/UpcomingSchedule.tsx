
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import SimpleAppointmentCard from "./SimpleAppointmentCard";
import { upcomingScheduleData } from "@/data/scheduleData";

const UpcomingSchedule = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Clock className="mr-2 h-5 w-5" />
          The Upcoming Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {upcomingScheduleData.map((dayData, index) => (
            <div key={index}>
              <h4 className="font-medium text-gray-700 mb-3">{dayData.day}</h4>
              <div className="space-y-3">
                {dayData.appointments.map((appointment, appointmentIndex) => (
                  <SimpleAppointmentCard
                    key={appointmentIndex}
                    title={appointment.title}
                    time={appointment.time}
                    type={appointment.type}
                    icon={appointment.icon}
                    color={appointment.color}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingSchedule;
