import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Bell, Shield, Camera, Volume2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import ChangePasswordDialog from "@/components/ChangePasswordDialog";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage: string;
  username?: string; // Add for username sync
}

interface NotificationSettings {
  appointmentReminders: boolean;
  testResults: boolean;
  healthTips: boolean;
  reminderTone: string;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
}

const GUEST_KEY = "open_as_guest";

const Settings = () => {
  const { toast } = useToast();
  const isGuest = localStorage.getItem(GUEST_KEY) === "true";
  
  // Initialize state with data from localStorage or defaults
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : {
      firstName: "John",
      lastName: "Doe", 
      email: "john.doe@example.com",
      phone: "+91 98765 43210",
      profileImage: "",
      username: "John Doe"
    };
  });

  const [notifications, setNotifications] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('notificationSettings');
    return saved ? JSON.parse(saved) : {
      appointmentReminders: false,
      testResults: true,
      healthTips: false,
      reminderTone: "pleasant"
    };
  });

  const [security, setSecurity] = useState<SecuritySettings>(() => {
    const saved = localStorage.getItem('securitySettings');
    return saved ? JSON.parse(saved) : {
      twoFactorAuth: false
    };
  });

  // Save both in Supabase and localStorage
  useEffect(() => {
    // Always ensure username is updated in localStorage (for Header)
    const withUsername = {
      ...userProfile,
      username: `${userProfile.firstName} ${userProfile.lastName}`.trim() || userProfile.username
    };
    localStorage.setItem('userProfile', JSON.stringify(withUsername));
    // Trigger storage event for other components to update
    window.dispatchEvent(new Event('storage'));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('securitySettings', JSON.stringify(security));
  }, [security]);

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isGuest) return;
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setUserProfile(prev => ({
          ...prev,
          profileImage: imageUrl
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNotificationChange = (field: keyof NotificationSettings, value: boolean | string) => {
    setNotifications(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSecurityChange = (field: keyof SecuritySettings, value: boolean) => {
    setSecurity(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    if (isGuest) return;
    // Save to Supabase "profiles" if logged in (do not update for guest)
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id) {
      // Compose the username (use full name)
      const username = `${userProfile.firstName} ${userProfile.lastName}`.trim();
      // Update only if changed
      await supabase.from("profiles").update({ username: username || "User" }).eq("id", user.id);
      // Sync in state/localStorage (triggers Header live update)
      setUserProfile((prev) => ({
        ...prev,
        username
      }));
    }
    // Show success toast
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleChangePassword = () => {
    toast({
      title: "Password Change",
      description: "Password change functionality would be implemented here.",
    });
  };

  const playRingtone = (tone: string) => {
    // Create a simple audio context for demonstration
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Different tones based on selection
    const frequencies = {
      pleasant: [523.25, 659.25, 783.99], // C-E-G chord
      gentle: [440, 554.37, 659.25], // A-C#-E chord
      soft: [349.23, 440, 523.25], // F-A-C chord
      chime: [1046.5, 1318.5, 1568] // Higher octave C-E-G
    };
    
    const toneFreqs = frequencies[tone as keyof typeof frequencies] || frequencies.pleasant;
    
    toneFreqs.forEach((freq, index) => {
      setTimeout(() => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.frequency.setValueAtTime(freq, audioContext.currentTime);
        osc.type = 'sine';
        
        gain.gain.setValueAtTime(0, audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
        gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
        
        osc.start(audioContext.currentTime);
        osc.stop(audioContext.currentTime + 0.5);
      }, index * 200);
    });

    toast({
      title: "Ringtone Preview",
      description: `Playing ${tone} notification tone`,
    });
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Profile Information
                {isGuest && <span className="ml-2 text-xs text-red-500">(Guest mode: Read Only)</span>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
                    {userProfile.profileImage ? (
                      <img 
                        src={userProfile.profileImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <label className={`absolute bottom-0 right-0 bg-blue-600 rounded-full p-1 cursor-pointer hover:bg-blue-700 ${isGuest ? "pointer-events-none opacity-50" : ""}`}>
                    <Camera className="h-3 w-3 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageUpload}
                      className="hidden"
                      disabled={isGuest}
                    />
                  </label>
                </div>
                <div>
                  <p className="font-medium">Profile Picture</p>
                  <p className="text-sm text-gray-500">Click the camera icon to upload</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <Input 
                    value={userProfile.firstName}
                    onChange={(e) => handleProfileChange('firstName', e.target.value)}
                    disabled={isGuest}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <Input 
                    value={userProfile.lastName}
                    onChange={(e) => handleProfileChange('lastName', e.target.value)}
                    disabled={isGuest}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input 
                  value={userProfile.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  disabled={isGuest}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <Input 
                  value={userProfile.phone}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                  disabled={isGuest}
                />
              </div>
              {!isGuest && <Button onClick={handleSaveProfile}>Save Changes</Button>}
              {isGuest && <div className="mt-2 text-xs text-gray-500">Profile is read only in Guest Mode.</div>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Appointment Reminders</p>
                  <p className="text-sm text-gray-500">Get notified about upcoming appointments</p>
                </div>
                <Switch 
                  checked={notifications.appointmentReminders}
                  onCheckedChange={(checked) => handleNotificationChange('appointmentReminders', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Test Results</p>
                  <p className="text-sm text-gray-500">Receive notifications when test results are ready</p>
                </div>
                <Switch 
                  checked={notifications.testResults}
                  onCheckedChange={(checked) => handleNotificationChange('testResults', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Health Tips</p>
                  <p className="text-sm text-gray-500">Weekly health and wellness tips</p>
                </div>
                <Switch 
                  checked={notifications.healthTips}
                  onCheckedChange={(checked) => handleNotificationChange('healthTips', checked)}
                />
              </div>
              
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium flex items-center">
                      <Volume2 className="h-4 w-4 mr-2" />
                      Notification Ringtone
                    </p>
                    <p className="text-sm text-gray-500">Choose your preferred notification sound</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select 
                      value={notifications.reminderTone} 
                      onValueChange={(value) => handleNotificationChange('reminderTone', value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pleasant">Pleasant</SelectItem>
                        <SelectItem value="gentle">Gentle</SelectItem>
                        <SelectItem value="soft">Soft</SelectItem>
                        <SelectItem value="chime">Chime</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => playRingtone(notifications.reminderTone)}
                    >
                      Test
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={isGuest ? "opacity-60 pointer-events-none relative" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Privacy & Security
                {isGuest && <span className="ml-2 text-xs text-red-500">(Disabled in Guest mode)</span>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Add an extra layer of security</p>
                </div>
                <Switch 
                  checked={security.twoFactorAuth}
                  onCheckedChange={(checked) => handleSecurityChange('twoFactorAuth', checked)}
                  disabled={isGuest}
                />
              </div>
              <div>
                <ChangePasswordDialog />
              </div>
              {isGuest && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-lg z-10">
                  <span className="text-sm text-gray-600">Privacy & Security features are unavailable in Guest Mode.</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
