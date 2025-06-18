
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Search, Filter, Calendar, Eye, Share2, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";

const Tests = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const tests = [
    {
      id: "1",
      name: "Blood Test - Complete Panel",
      doctor: "Dr. Manish Jain",
      date: "March 25, 2022",
      status: "Completed",
      result: "Normal",
      category: "Blood Work",
      downloadUrl: "#",
      trending: "stable"
    },
    {
      id: "2",
      name: "ECG",
      doctor: "Dr. Deepika Sharma", 
      date: "March 22, 2022",
      status: "Completed",
      result: "Normal",
      category: "Cardiology",
      downloadUrl: "#",
      trending: "improved"
    },
    {
      id: "3",
      name: "X-Ray Chest",
      doctor: "Dr. Karan Malhotra",
      date: "March 18, 2022", 
      status: "Completed",
      result: "Clear",
      category: "Radiology",
      downloadUrl: "#",
      trending: "stable"
    },
    {
      id: "4",
      name: "Liver Function Test",
      doctor: "Dr. Pooja Nair",
      date: "Scheduled for March 30",
      status: "Pending", 
      result: "Awaiting",
      category: "Blood Work",
      downloadUrl: null,
      trending: null
    },
    {
      id: "5",
      name: "MRI Brain Scan",
      doctor: "Dr. Rahul Gupta",
      date: "March 15, 2022",
      status: "Completed",
      result: "Normal",
      category: "Radiology",
      downloadUrl: "#",
      trending: "stable"
    }
  ];

  const filteredTests = tests
    .filter(test => {
      const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           test.doctor.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === "all" || test.status.toLowerCase() === filterStatus.toLowerCase();
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

  const handleDownload = (test: any) => {
    // Simulate file download
    toast({
      title: "Download Started",
      description: `Downloading ${test.name} report...`,
    });
    
    // Create a mock PDF download
    const element = document.createElement('a');
    element.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(`Medical Test Report\n\nTest: ${test.name}\nDoctor: ${test.doctor}\nDate: ${test.date}\nResult: ${test.result}`);
    element.download = `${test.name.replace(/\s+/g, '_')}_Report.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleShare = (test: any) => {
    if (navigator.share) {
      navigator.share({
        title: test.name,
        text: `Medical test result: ${test.result}`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`Test: ${test.name}\nResult: ${test.result}\nDate: ${test.date}`);
      toast({
        title: "Copied to Clipboard",
        description: "Test details copied to clipboard",
      });
    }
  };

  const handleViewDetails = (test: any) => {
    toast({
      title: "View Details",
      description: `Opening detailed view for ${test.name}`,
    });
  };

  const getTrendingIcon = (trending: string | null) => {
    if (!trending) return null;
    return <TrendingUp className={`h-4 w-4 ${trending === 'improved' ? 'text-green-500' : 'text-blue-500'}`} />;
  };

  const getCompletedTestsCount = () => tests.filter(test => test.status === "Completed").length;
  const getPendingTestsCount = () => tests.filter(test => test.status === "Pending").length;

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Medical Tests</h1>
          <div className="flex space-x-2">
            <Badge variant="secondary" className="text-sm">
              {getCompletedTestsCount()} Completed
            </Badge>
            <Badge variant="outline" className="text-sm">
              {getPendingTestsCount()} Pending
            </Badge>
          </div>
        </div>

        {/* Search and Filter Section */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search tests or doctors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Sort by Date</SelectItem>
                    <SelectItem value="name">Sort by Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tests Grid */}
        <div className="space-y-4">
          {filteredTests.map((test) => (
            <Card key={test.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <FileText className="h-6 w-6 text-blue-500" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{test.name}</p>
                        {getTrendingIcon(test.trending)}
                      </div>
                      <p className="text-sm text-gray-500">Ordered by {test.doctor}</p>
                      <p className="text-sm text-gray-500">{test.date}</p>
                      <Badge variant="outline" className="text-xs mt-1">
                        {test.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right flex items-center space-x-3">
                    <div>
                      <Badge variant={test.status === "Completed" ? "default" : "secondary"}>
                        {test.status}
                      </Badge>
                      <p className="text-sm mt-1 font-medium">{test.result}</p>
                    </div>
                    <div className="flex flex-col space-y-1">
                      {test.status === "Completed" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(test)}
                            className="h-8 px-2"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownload(test)}
                            className="h-8 px-2"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleShare(test)}
                            className="h-8 px-2"
                          >
                            <Share2 className="h-3 w-3 mr-1" />
                            Share
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTests.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tests found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Tests;
