import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Camera, Save, MapPin, FileText, Shield, Bell, Award } from 'lucide-react';
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

export default function DoctorProfile() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Dr. Arjun Patel',
    email: 'arjun.patel@hospital.com',
    phone: '+91 9876543210',
    specialization: 'Cardiology',
    experience: '15',
    qualification: 'MBBS, MD (Cardiology)',
    registrationNumber: 'MH-12345-2008',
    clinicName: 'Apollo Heart Centre',
    clinicAddress: '123 Medical Plaza, Mumbai, Maharashtra 400001',
    consultationFee: '1500',
    bio: 'Experienced cardiologist with 15+ years in interventional cardiology. Specialized in complex cardiac procedures and preventive cardiology.'
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: true,
    appointmentReminders: true,
    labAlerts: true,
    consentExpiry: true
  });

  const specializations = [
    'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology',
    'Gastroenterology', 'Pulmonology', 'Endocrinology', 'Nephrology', 'Oncology'
  ];

  const handleSave = () => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully.",
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
          <h1 className="text-2xl font-semibold text-foreground">Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your professional profile and preferences
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
                  <CardTitle>Professional Information</CardTitle>
                  <CardDescription>Update your professional details and credentials</CardDescription>
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
              {/* Avatar Section */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder-doctor.jpg" alt="Profile" />
                  <AvatarFallback className="text-lg">
                    {formData.name.split(' ').slice(-2).map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  <Label htmlFor="specialization">Specialization</Label>
                  {isEditing ? (
                    <Select value={formData.specialization} onValueChange={(value) => setFormData({ ...formData, specialization: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {specializations.map((spec) => (
                          <SelectItem key={spec} value={spec}>
                            {spec}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="specialization"
                      value={formData.specialization}
                      disabled
                    />
                  )}
                </div>
                <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="qualification">Qualifications</Label>
                  <Input
                    id="qualification"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    disabled={!isEditing}
                    placeholder="e.g., MBBS, MD (Specialty)"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  disabled={!isEditing}
                  rows={4}
                  placeholder="Brief description of your expertise and experience..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Clinic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="clinicName">Clinic/Hospital Name</Label>
                <Input
                  id="clinicName"
                  value={formData.clinicName}
                  onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="clinicAddress">Clinic Address</Label>
                <Textarea
                  id="clinicAddress"
                  value={formData.clinicAddress}
                  onChange={(e) => setFormData({ ...formData, clinicAddress: e.target.value })}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="consultationFee">Consultation Fee (₹)</Label>
                <Input
                  id="consultationFee"
                  type="number"
                  value={formData.consultationFee}
                  onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                  disabled={!isEditing}
                />
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
                Quick Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{formData.experience}</p>
                <p className="text-sm text-muted-foreground">Years Experience</p>
              </div>
              <Separator />
              <div>
                <Badge variant="secondary" className="w-full justify-center">
                  {formData.specialization}
                </Badge>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium">Registration</p>
                <p className="text-sm text-muted-foreground font-mono">{formData.registrationNumber}</p>
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
                  <p className="text-sm text-muted-foreground">Urgent alerts</p>
                </div>
                <Switch
                  checked={preferences.smsNotifications}
                  onCheckedChange={(checked) => handlePreferenceChange('smsNotifications', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Appointment Reminders</p>
                  <p className="text-sm text-muted-foreground">Daily schedule</p>
                </div>
                <Switch
                  checked={preferences.appointmentReminders}
                  onCheckedChange={(checked) => handlePreferenceChange('appointmentReminders', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Lab Alerts</p>
                  <p className="text-sm text-muted-foreground">New reports</p>
                </div>
                <Switch
                  checked={preferences.labAlerts}
                  onCheckedChange={(checked) => handlePreferenceChange('labAlerts', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Consent Expiry</p>
                  <p className="text-sm text-muted-foreground">Access warnings</p>
                </div>
                <Switch
                  checked={preferences.consentExpiry}
                  onCheckedChange={(checked) => handlePreferenceChange('consentExpiry', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Two-Factor Authentication
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Digital Signature
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}