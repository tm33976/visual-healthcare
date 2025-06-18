
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

const ActivityFeed = () => {
  const weekData = [
    { day: 'Mon', value: 80 },
    { day: 'Tue', value: 60 },
    { day: 'Wed', value: 100 },
    { day: 'Thu', value: 40 },
    { day: 'Fri', value: 90 },
    { day: 'Sat', value: 30 },
    { day: 'Sun', value: 50 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <BarChart3 className="mr-2 h-5 w-5" />
          Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-600">3 appointments on this week</p>
        </div>
        
        {/* Simple Bar Chart */}
        <div className="flex items-end space-x-2 h-24">
          {weekData.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className="w-full bg-blue-200 rounded-t"
                style={{ height: `${item.value}%` }}
              ></div>
              <span className="text-xs text-gray-500 mt-2">{item.day}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
