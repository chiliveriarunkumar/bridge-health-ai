import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building, Mail, Phone, Camera, Save, MapPin, FileText, Shield, Bell, Award, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function LabProfile() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    labName: 'Apollo Diagnostics Center',
    registrationNumber: 'LAB-MH-2018-001234',
    nabl: 'NABL-001-2020',
    email: 'contact@apollodiagnostics.com',
    phone: '+91 22 12345678',
    address: '123 Medical Plaza, Bandra West, Mumbai, Maharashtra 400050',
    labIncharge: 'Dr. Rajesh Pathak',
    specialties: ['Clinical Pathology', 'Biochemistry', 'Microbiology', 'Hematology'],
    turnaroundTime: {
      routine: '24',
      urgent: '4',
      stat: '2'
    },
    workingHours: '7:00 AM - 10:00 PM',
    established: '2018',
    totalTests: '50000+',
    certifications: ['NABL', 'ISO 15189', 'CAP']
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: true,
    orderAlerts: true,
    reportReady: true,
    qualityAlerts: true,
    autoAISummary: true
  });

  const handleSave = () => {
    toast({
      title: "Profile updated",
      description: "Your laboratory profile has been saved successfully.",
    });
    setIsEditing(false);
  };

  const handlePreferenceChange = (key: string, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Laboratory Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your laboratory information and settings
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Laboratory Information</CardTitle>
                  <CardDescription>Update your laboratory details and credentials</CardDescription>
                </div>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                >
                  {isEditing ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  ) : (
                    'Edit Profile'
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo Section */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder-lab-logo.jpg" alt="Lab Logo" />
                  <AvatarFallback className="text-lg">
                    <Building className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Change Logo
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="labName">Laboratory Name</Label>
                  <Input
                    id="labName"
                    value={formData.labName}
                    onChange={(e) => setFormData({ ...formData, labName: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="registrationNumber">Registration Number</Label>
                  <Input
                    id="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    disabled={!isEditing}
                    className="font-mono"
                  />
                </div>
                <div>
                  <Label htmlFor="nabl">NABL Accreditation</Label>
                  <Input
                    id="nabl"
                    value={formData.nabl}
                    onChange={(e) => setFormData({ ...formData, nabl: e.target.value })}
                    disabled={!isEditing}
                    className="font-mono"
                  />
                </div>
                <div>
                  <Label htmlFor="established">Established Year</Label>
                  <Input
                    id="established"
                    value={formData.established}
                    onChange={(e) => setFormData({ ...formData, established: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="labIncharge">Lab In-charge</Label>
                  <Input
                    id="labIncharge"
                    value={formData.labIncharge}
                    onChange={(e) => setFormData({ ...formData, labIncharge: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="workingHours">Working Hours</Label>
                  <Input
                    id="workingHours"
                    value={formData.workingHours}
                    onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Laboratory Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>

              <div>
                <Label>Specialties & Departments</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Edit specialties in advanced settings
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Turnaround Time (TAT)
              </CardTitle>
              <CardDescription>Standard processing times for different test priorities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="routine">Routine Tests (Hours)</Label>
                  <Input
                    id="routine"
                    type="number"
                    value={formData.turnaroundTime.routine}
                    onChange={(e) => setFormData({
                      ...formData,
                      turnaroundTime: { ...formData.turnaroundTime, routine: e.target.value }
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="urgent">Urgent Tests (Hours)</Label>
                  <Input
                    id="urgent"
                    type="number"
                    value={formData.turnaroundTime.urgent}
                    onChange={(e) => setFormData({
                      ...formData,
                      turnaroundTime: { ...formData.turnaroundTime, urgent: e.target.value }
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="stat">STAT Tests (Hours)</Label>
                  <Input
                    id="stat"
                    type="number"
                    value={formData.turnaroundTime.stat}
                    onChange={(e) => setFormData({
                      ...formData,
                      turnaroundTime: { ...formData.turnaroundTime, stat: e.target.value }
                    })}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings & Quick Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{formData.totalTests}</p>
                <p className="text-sm text-muted-foreground">Tests Processed</p>
              </div>
              <Separator />
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{formData.established}</p>
                <p className="text-sm text-muted-foreground">Established Since</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-2">Certifications</p>
                <div className="flex flex-wrap gap-1">
                  {formData.certifications.map((cert, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
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
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">General updates</p>
                </div>
                <Switch
                  checked={preferences.emailNotifications}
                  onCheckedChange={(checked) => handlePreferenceChange('emailNotifications', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-muted-foreground">Critical alerts</p>
                </div>
                <Switch
                  checked={preferences.smsNotifications}
                  onCheckedChange={(checked) => handlePreferenceChange('smsNotifications', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">New Order Alerts</p>
                  <p className="text-sm text-muted-foreground">Incoming test orders</p>
                </div>
                <Switch
                  checked={preferences.orderAlerts}
                  onCheckedChange={(checked) => handlePreferenceChange('orderAlerts', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Report Ready Alerts</p>
                  <p className="text-sm text-muted-foreground">Completion notifications</p>
                </div>
                <Switch
                  checked={preferences.reportReady}
                  onCheckedChange={(checked) => handlePreferenceChange('reportReady', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto AI Summary</p>
                  <p className="text-sm text-muted-foreground">Generate AI summaries</p>
                </div>
                <Switch
                  checked={preferences.autoAISummary}
                  onCheckedChange={(checked) => handlePreferenceChange('autoAISummary', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Security & Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                Data Encryption Settings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Access Control
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Compliance Reports
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Audit Logs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}