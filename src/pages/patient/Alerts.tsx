import { useState } from 'react';
import { 
  Bell, 
  Pill, 
  Calendar, 
  FileText, 
  ShieldCheck,
  Clock,
  CheckCircle,
  Settings,
  Plus,
  Trash2,
  Edit
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { EmptyState } from '@/components/ui/empty-state';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import type { Alert } from '@/types';

// Mock data
const mockTodayAlerts: Alert[] = [
  {
    id: 'A001',
    type: 'medication',
    title: 'Morning Medications',
    message: 'Time to take Lisinopril 10mg and Hydrochlorothiazide 25mg',
    createdAt: '2024-01-25T08:00:00Z',
    isRead: false,
    priority: 'high',
    actionUrl: '/patient/treatments'
  },
  {
    id: 'A002', 
    type: 'appointment',
    title: 'Upcoming Appointment',
    message: 'Follow-up with Dr. Michael Chen tomorrow at 10:00 AM',
    createdAt: '2024-01-25T09:00:00Z',
    isRead: false,
    priority: 'medium',
    actionUrl: '/patient/treatments'
  },
  {
    id: 'A003',
    type: 'report',
    title: 'New Lab Report Available',
    message: 'Your Complete Blood Count results from MedLab Services are ready',
    createdAt: '2024-01-25T14:30:00Z',
    isRead: true,
    priority: 'medium',
    actionUrl: '/patient/reports'
  }
];

const mockMedicationReminders = [
  {
    id: 'MR001',
    name: 'Lisinopril 10mg',
    dosage: '1 tablet',
    times: ['08:00', '20:00'],
    taken: [true, false],
    frequency: 'Twice daily',
    isActive: true
  },
  {
    id: 'MR002',
    name: 'Hydrochlorothiazide 25mg',
    dosage: '1 tablet',
    times: ['08:00'],
    taken: [true],
    frequency: 'Once daily',
    isActive: true
  },
  {
    id: 'MR003',
    name: 'Vitamin D3',
    dosage: '1000 IU',
    times: ['08:00'],
    taken: [false],
    frequency: 'Once daily',
    isActive: false
  }
];

const mockUpcomingAppointments = [
  {
    id: 'AP001',
    doctorName: 'Dr. Michael Chen',
    type: 'Follow-up Consultation',
    date: '2024-01-26T10:00:00Z',
    location: 'Cardiology Clinic',
    confirmed: true
  },
  {
    id: 'AP002',
    doctorName: 'Dr. Sarah Ahmed',
    type: 'Annual Health Checkup',
    date: '2024-02-01T14:00:00Z',
    location: 'General Medicine',
    confirmed: false
  }
];

const notificationPreferences = {
  sms: true,
  email: true,
  push: true,
  medicationReminders: true,
  appointmentReminders: true,
  reportAlerts: true,
  consentRequests: true
};

export default function Alerts() {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [reminderForm, setReminderForm] = useState({
    name: '',
    dosage: '',
    frequency: 'once',
    times: ['08:00'],
    notes: ''
  });

  const formatTime = (timeString: string) => {
    return new Date(`2024-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'pill-danger';
      case 'medium': return 'pill-warning';
      default: return 'pill-accent';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'medication': return Pill;
      case 'appointment': return Calendar;
      case 'report': return FileText;
      case 'consent': return ShieldCheck;
      default: return Bell;
    }
  };

  const handleMarkMedicationTaken = (medicationId: string, timeIndex: number) => {
    toast({
      title: 'Medication marked as taken',
      description: 'Great job staying on track with your medications!',
    });
  };

  const handleAddReminder = () => {
    toast({
      title: 'Reminder added',
      description: `Medication reminder for ${reminderForm.name} has been created`,
    });
    setShowReminderForm(false);
    setReminderForm({
      name: '',
      dosage: '',
      frequency: 'once',
      times: ['08:00'],
      notes: ''
    });
  };

  const todayMeds = mockMedicationReminders.filter(med => med.isActive);
  const upcomingAlerts = mockTodayAlerts.filter(alert => !alert.isRead);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Health Alerts</h1>
          <p className="text-muted-foreground mt-2">
            Manage your medication reminders and health notifications
          </p>
        </div>
        <Button variant="outline" onClick={() => setShowPreferences(true)}>
          <Settings className="h-4 w-4 mr-2" />
          Preferences
        </Button>
      </div>

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unread Alerts</p>
                <p className="text-3xl font-bold text-danger mt-2">{upcomingAlerts.length}</p>
              </div>
              <div className="p-3 bg-danger/10 rounded-xl">
                <Bell className="h-6 w-6 text-danger" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Medications</p>
                <p className="text-3xl font-bold text-brand mt-2">{todayMeds.length}</p>
              </div>
              <div className="p-3 bg-brand/10 rounded-xl">
                <Pill className="h-6 w-6 text-brand" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Next Appointment</p>
                <p className="text-xl font-bold text-accent-ui mt-2">Tomorrow</p>
              </div>
              <div className="p-3 bg-accent-ui/10 rounded-xl">
                <Calendar className="h-6 w-6 text-accent-ui" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="today" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Today's Alerts */}
        <TabsContent value="today" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Recent Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mockTodayAlerts.length > 0 ? (
                <div className="space-y-4">
                  {mockTodayAlerts.map((alert, index) => {
                    const AlertIcon = getAlertIcon(alert.type);
                    
                    return (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-xl border transition-all ${
                          alert.isRead 
                            ? 'bg-muted/10 border-muted/20' 
                            : 'bg-warning/5 border-warning/20'
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <div className={`p-2 rounded-lg ${
                            alert.isRead ? 'bg-muted/20' : 'bg-warning/10'
                          }`}>
                            <AlertIcon className={`h-5 w-5 ${
                              alert.isRead ? 'text-muted-foreground' : 'text-warning'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className={`font-medium ${
                                alert.isRead ? 'text-muted-foreground' : 'text-foreground'
                              }`}>
                                {alert.title}
                              </h3>
                              <div className="flex items-center space-x-2">
                                <Badge className={getPriorityColor(alert.priority)}>
                                  {alert.priority}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {formatDateTime(alert.createdAt)}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {alert.message}
                            </p>
                            {alert.actionUrl && !alert.isRead && (
                              <Button variant="outline" size="sm">
                                Take Action
                              </Button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  icon={Bell}
                  title="No alerts today"
                  description="All caught up! No new notifications for today."
                  className="py-8"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medication Reminders */}
        <TabsContent value="medications" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Medication Reminders</h2>
            <Button onClick={() => setShowReminderForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Reminder
            </Button>
          </div>

          {todayMeds.length > 0 ? (
            <div className="space-y-4">
              {todayMeds.map((med, index) => (
                <motion.div
                  key={med.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-card">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="p-3 bg-brand/10 rounded-xl">
                            <Pill className="h-6 w-6 text-brand" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground mb-1">
                              {med.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              {med.dosage} • {med.frequency}
                            </p>
                            <div className="space-y-3">
                              {med.times.map((time, timeIndex) => (
                                <div key={timeIndex} className="flex items-center space-x-3">
                                  <Checkbox
                                    checked={med.taken[timeIndex]}
                                    onCheckedChange={() => handleMarkMedicationTaken(med.id, timeIndex)}
                                  />
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm font-medium">
                                    {formatTime(time)}
                                  </span>
                                  {med.taken[timeIndex] && (
                                    <Badge className="pill-success">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Taken
                                    </Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Pill}
              title="No medication reminders"
              description="Add your medications to get timely reminders"
              action={{
                label: 'Add First Reminder',
                onClick: () => setShowReminderForm(true)
              }}
            />
          )}
        </TabsContent>

        {/* Appointments */}
        <TabsContent value="appointments" className="space-y-6">
          <h2 className="text-xl font-semibold text-foreground">Upcoming Appointments</h2>
          
          {mockUpcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {mockUpcomingAppointments.map((appointment, index) => (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-accent-ui/10 rounded-xl">
                            <Calendar className="h-6 w-6 text-accent-ui" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">
                              {appointment.type}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {appointment.doctorName} • {appointment.location}
                            </p>
                            <p className="text-sm font-medium text-accent-ui mt-1">
                              {formatDateTime(appointment.date)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className={appointment.confirmed ? 'pill-success' : 'pill-warning'}>
                            {appointment.confirmed ? 'Confirmed' : 'Pending'}
                          </Badge>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Calendar}
              title="No upcoming appointments"
              description="You don't have any scheduled appointments"
            />
          )}
        </TabsContent>

        {/* History */}
        <TabsContent value="history">
          <EmptyState
            icon={Bell}
            title="Alert history"
            description="Your past notifications and alerts will appear here"
            className="py-12"
          />
        </TabsContent>
      </Tabs>

      {/* Notification Preferences Modal */}
      <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notification Preferences</DialogTitle>
            <DialogDescription>
              Choose how you'd like to receive health alerts and reminders
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Channels */}
            <div>
              <h3 className="font-medium text-foreground mb-3">Notification Channels</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms">SMS Messages</Label>
                  <Switch id="sms" defaultChecked={notificationPreferences.sms} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="email">Email Notifications</Label>
                  <Switch id="email" defaultChecked={notificationPreferences.email} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="push">Push Notifications</Label>
                  <Switch id="push" defaultChecked={notificationPreferences.push} />
                </div>
              </div>
            </div>

            {/* Alert Types */}
            <div>
              <h3 className="font-medium text-foreground mb-3">Alert Types</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="med">Medication Reminders</Label>
                  <Switch id="med" defaultChecked={notificationPreferences.medicationReminders} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="appt">Appointment Reminders</Label>
                  <Switch id="appt" defaultChecked={notificationPreferences.appointmentReminders} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="reports">New Report Alerts</Label>
                  <Switch id="reports" defaultChecked={notificationPreferences.reportAlerts} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="consent">Consent Requests</Label>
                  <Switch id="consent" defaultChecked={notificationPreferences.consentRequests} />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreferences(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast({ title: 'Preferences saved', description: 'Your notification settings have been updated' });
              setShowPreferences(false);
            }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Reminder Modal */}
      <Dialog open={showReminderForm} onOpenChange={setShowReminderForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Medication Reminder</DialogTitle>
            <DialogDescription>
              Set up a new reminder for your medication schedule
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="med-name">Medication Name</Label>
                <Input
                  id="med-name"
                  placeholder="e.g., Lisinopril 10mg"
                  value={reminderForm.name}
                  onChange={(e) => setReminderForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  placeholder="e.g., 1 tablet"
                  value={reminderForm.dosage}
                  onChange={(e) => setReminderForm(prev => ({ ...prev, dosage: e.target.value }))}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="frequency">Frequency</Label>
              <Select value={reminderForm.frequency} onValueChange={(value) => setReminderForm(prev => ({ ...prev, frequency: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="once">Once daily</SelectItem>
                  <SelectItem value="twice">Twice daily</SelectItem>
                  <SelectItem value="three">Three times daily</SelectItem>
                  <SelectItem value="four">Four times daily</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="time">Reminder Time</Label>
              <Input
                id="time"
                type="time"
                value={reminderForm.times[0]}
                onChange={(e) => setReminderForm(prev => ({ ...prev, times: [e.target.value] }))}
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Special instructions or notes..."
                value={reminderForm.notes}
                onChange={(e) => setReminderForm(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReminderForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddReminder}>
              Add Reminder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}