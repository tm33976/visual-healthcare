
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface SimpleAppointmentCardProps {
  title: string;
  time: string;
  type: string;
  icon: React.ElementType;
  color: string;
}

const SimpleAppointmentCard = ({ title, time, type, icon: IconComponent, color }: SimpleAppointmentCardProps) => {
  return (
    <div className="flex items-center space-x-4 p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <div className={`p-2 rounded-full ${color}`}>
        <IconComponent className="h-4 w-4 text-white" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-900 text-sm">{title}</p>
        <div className="flex items-center text-xs text-gray-500">
          <Clock className="mr-1 h-3 w-3" />
          {time}
        </div>
      </div>
      <Badge variant="outline" className="text-xs">
        {type}
      </Badge>
    </div>
  );
};

export default SimpleAppointmentCard;
