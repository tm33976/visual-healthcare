import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Heart, Activity } from "lucide-react";
import Layout from "@/components/Layout";
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

const Statistics = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    // Use fetchAppointments for both guest and auth mode
    fetchAppointments().then(setAppointments);
  }, []);

  const calculateStats = () => {
    const totalAppointments = appointments.length;
    
    const confirmedAppointments = appointments.filter(apt => apt.status === "Confirmed").length;
    const pendingAppointments = appointments.filter(apt => apt.status === "Pending").length;
    
    // Get unique specialties count as active treatments
    const uniqueSpecialties = new Set(appointments.map(apt => apt.specialty));
    const activeTreatments = uniqueSpecialties.size;
    
    // Calculate health score based on confirmed appointments ratio
    const healthScore = totalAppointments > 0 ? Math.round((confirmedAppointments / totalAppointments) * 100) : 0;
    
    return {
      totalAppointments,
      healthScore,
      activeTreatments,
      confirmedAppointments,
      pendingAppointments
    };
  };

  const stats = calculateStats();
  
  const statsCards = [
    {
      title: "Total Appointments",
      value: stats.totalAppointments.toString(),
      change: stats.confirmedAppointments > stats.pendingAppointments ? "+12%" : "0%",
      icon: BarChart3
    },
    {
      title: "Health Score",
      value: `${stats.healthScore}%`, 
      change: stats.healthScore >= 80 ? "+5%" : stats.healthScore >= 50 ? "0%" : "-5%",
      icon: Heart
    },
    {
      title: "Active Treatments",
      value: stats.activeTreatments.toString(),
      change: "0%",
      icon: Activity
    }
  ];

  const getRecentVisits = () => {
    return appointments
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const recentVisits = getRecentVisits();

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Health Statistics</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className={`text-sm ${
                      stat.change.startsWith('+') ? 'text-green-600' : 
                      stat.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {stat.change}
                    </p>
                  </div>
                  <stat.icon className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Doctor Visits</CardTitle>
          </CardHeader>
          <CardContent>
            {recentVisits.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No appointments found. Book your first appointment to see statistics.
              </div>
            ) : (
              <div className="space-y-3">
                {recentVisits.map((appointment) => (
                  <div key={appointment.id} className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{appointment.doctor} - {appointment.specialty}</span>
                      {appointment.notes && (
                        <p className="text-sm text-gray-600">Note: {appointment.notes}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-gray-500">{formatDate(appointment.date)}</span>
                      <div className="mt-1">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          appointment.status === "Confirmed" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Statistics;
