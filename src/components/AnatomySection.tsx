
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { healthStatusData } from "@/data/healthData";

const AnatomySection = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Health Status</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Health Status Cards */}
        <div className="space-y-4">
          {healthStatusData.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${item.color}`}>
                  <item.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.date}</p>
                </div>
              </div>
              <Badge variant={item.status === 'Good' ? 'default' : 'destructive'}>
                {item.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnatomySection;
