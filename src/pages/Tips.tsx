import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Heart, Phone, Clock, Eye, Thermometer, Zap, Brain, Droplet, Shield } from "lucide-react";
import Layout from "@/components/Layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Tips = () => {
  const emergencyTips = [
    {
      id: "heart-attack",
      title: "Heart Attack",
      icon: Heart,
      category: "Cardiac Emergency",
      color: "text-red-500",
      bgColor: "bg-red-50",
      symptoms: ["Chest pain or discomfort", "Shortness of breath", "Nausea", "Sweating", "Pain in arm, jaw, or back"],
      immediateActions: [
        "Call 911 immediately",
        "Have the person sit down and rest",
        "Give aspirin if not allergic (chew, don't swallow whole)",
        "Loosen tight clothing",
        "Be prepared to perform CPR if person becomes unconscious"
      ],
      dontDo: ["Don't let them drive themselves", "Don't give water or food", "Don't leave them alone"]
    },
    {
      id: "stroke",
      title: "Stroke",
      icon: Brain,
      category: "Neurological Emergency",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      symptoms: ["Sudden face drooping", "Arm weakness", "Speech difficulty", "Sudden confusion", "Severe headache"],
      immediateActions: [
        "Call 911 immediately",
        "Note the time symptoms started",
        "Keep the person calm and lying down",
        "Turn head to side if vomiting",
        "Do not give food, water, or medication"
      ],
      dontDo: ["Don't give aspirin", "Don't let them sleep", "Don't give food or drinks"]
    },
    {
      id: "choking",
      title: "Choking",
      icon: Zap,
      category: "Airway Emergency",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      symptoms: ["Cannot speak or breathe", "Clutching throat", "Blue lips or face", "Weak cough"],
      immediateActions: [
        "Ask 'Are you choking?' If they can't speak, act immediately",
        "Stand behind them, place arms around waist",
        "Make a fist above navel, grasp with other hand",
        "Give quick upward thrusts (Heimlich maneuver)",
        "Continue until object is expelled or person becomes unconscious"
      ],
      dontDo: ["Don't hit on the back if standing", "Don't try to remove object with fingers", "Don't give water"]
    },
    {
      id: "severe-bleeding",
      title: "Severe Bleeding",
      icon: Droplet,
      category: "Trauma Emergency",
      color: "text-red-600",
      bgColor: "bg-red-50",
      symptoms: ["Blood spurting or flowing freely", "Blood soaking through bandages", "Signs of shock"],
      immediateActions: [
        "Call 911 if bleeding is severe",
        "Apply direct pressure with clean cloth",
        "Elevate the injured area above heart level",
        "Apply pressure to pressure points if needed",
        "Cover with bandage and secure"
      ],
      dontDo: ["Don't remove embedded objects", "Don't peek under bandages", "Don't use tourniquet unless trained"]
    },
    {
      id: "burns",
      title: "Severe Burns",
      icon: Thermometer,
      category: "Burn Emergency",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      symptoms: ["Blistering", "White or charred skin", "Burns larger than palm", "Chemical or electrical burns"],
      immediateActions: [
        "Call 911 for severe burns",
        "Cool burn with lukewarm water for 10-15 minutes",
        "Remove jewelry and loose clothing",
        "Cover with sterile gauze",
        "Keep person warm and monitor breathing"
      ],
      dontDo: ["Don't use ice", "Don't break blisters", "Don't apply butter or oils", "Don't remove stuck clothing"]
    },
    {
      id: "allergic-reaction",
      title: "Severe Allergic Reaction",
      icon: Shield,
      category: "Allergic Emergency",
      color: "text-green-600",
      bgColor: "bg-green-50",
      symptoms: ["Difficulty breathing", "Swelling of face/throat", "Rapid pulse", "Dizziness", "Widespread rash"],
      immediateActions: [
        "Call 911 immediately",
        "Use epinephrine auto-injector if available",
        "Help person lie down with legs elevated",
        "Loosen tight clothing",
        "Be prepared for CPR"
      ],
      dontDo: ["Don't give oral medication if swallowing is difficult", "Don't leave person alone", "Don't assume it will get better"]
    },
    {
      id: "eye-injury",
      title: "Eye Injury",
      icon: Eye,
      category: "Eye Emergency",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      symptoms: ["Pain in eye", "Loss of vision", "Blood in eye", "Something stuck in eye"],
      immediateActions: [
        "Don't rub the eye",
        "Flush with clean water for chemical exposure",
        "Cover both eyes with sterile gauze",
        "Seek immediate medical attention",
        "Keep person calm and still"
      ],
      dontDo: ["Don't remove objects from eye", "Don't apply pressure", "Don't use medications unless prescribed"]
    }
  ];

  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", ...Array.from(new Set(emergencyTips.map(tip => tip.category)))];

  const filteredTips = selectedCategory === "All" 
    ? emergencyTips 
    : emergencyTips.filter(tip => tip.category === selectedCategory);

  const emergencyNumbers = [
    { service: "Police", number: "100", description: "Police Emergency Services" },
    { service: "Fire", number: "101", description: "Fire Emergency Services" },
    { service: "Ambulance", number: "102", description: "Medical Emergency Services" },
    { service: "National Emergency", number: "112", description: "All Emergency Services" },
    { service: "Women Helpline", number: "1091", description: "Women Safety & Security" },
    { service: "Child Helpline", number: "1098", description: "Child Safety & Protection" }
  ];

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Medical Emergency Tips</h1>
          <p className="text-gray-600">Important guidance for medical emergencies. Always call 102 or 112 for serious emergencies in India.</p>
        </div>

        {/* Emergency Numbers */}
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center text-red-700">
              <Phone className="h-5 w-5 mr-2" />
              Emergency Numbers (India)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {emergencyNumbers.map((contact, index) => (
                <div key={index} className="text-center">
                  <div className="font-bold text-lg text-red-700">{contact.number}</div>
                  <div className="font-medium">{contact.service}</div>
                  <div className="text-sm text-gray-600">{contact.description}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Emergency Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTips.map((tip) => (
            <Card key={tip.id} className={`${tip.bgColor} border-2`}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <tip.icon className={`h-6 w-6 mr-2 ${tip.color}`} />
                  {tip.title}
                  <span className="ml-2 text-sm bg-white px-2 py-1 rounded-full text-gray-600">
                    {tip.category}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="symptoms">
                    <AccordionTrigger className="text-left">
                      <span className="flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Warning Signs
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-1">
                        {tip.symptoms.map((symptom, index) => (
                          <li key={index} className="text-sm">{symptom}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="actions">
                    <AccordionTrigger className="text-left">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        Immediate Actions
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ol className="list-decimal pl-5 space-y-2">
                        {tip.immediateActions.map((action, index) => (
                          <li key={index} className="text-sm font-medium">{action}</li>
                        ))}
                      </ol>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="dont-do">
                    <AccordionTrigger className="text-left">
                      <span className="flex items-center text-red-600">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        What NOT to Do
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-1">
                        {tip.dontDo.map((item, index) => (
                          <li key={index} className="text-sm text-red-600">{item}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Disclaimer */}
        <Card className="mt-6 border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <strong>Disclaimer:</strong> This information is for educational purposes only and should not replace professional medical advice. 
                Always call 102 (Ambulance) or 112 (National Emergency) or your local emergency number for serious medical emergencies. Consider taking a certified first aid course for proper training.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Tips;
