import { 
  Users, 
  Calendar, 
  ClipboardList, 
  Timer,
  UserCheck,
  Stethoscope,
  Bell,
  KeyRound
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatsCard } from '@/components/ui/stats-card';
import { EmptyState } from '@/components/ui/empty-state';
import { motion } from 'framer-motion';
import { useAuth } from '@/stores/auth';
import { useNavigate } from 'react-router-dom';

// Mock data
const mockOverview = {
  todayAppointments: 6,
  activeEpisodes: 12,
  expiringConsents: 3,
  todayPatients: [
    {
      pin: 'UHB1234',
      name: 'Sarah Johnson',
      age: 34,
      gender: 'F' as const,
      time: '10:00 AM',
      type: 'Follow-up',
      status: 'confirmed'
    },
    {
      pin: 'UHB5678',
      name: 'Robert Chen',
      age: 45,
      gender: 'M' as const,
      time: '11:30 AM', 
      type: 'Consultation',
      status: 'pending'
    },
    {
      pin: 'UHB9012',
      name: 'Maria Garcia',
      age: 28,
      gender: 'F' as const,
      time: '2:00 PM',
      type: 'Check-up',
      status: 'confirmed'
    }
  ]
};

const mockExpiringConsents = [
  {
    id: '1',
    pin: 'UHB1234',
    patientName: 'Sarah Johnson',
    expiresAt: '2024-01-25T15:00:00Z',
    scope: ['currentEpisode', 'allLabs'] as const
  },
  {
    id: '2',
    pin: 'UHB3456',
    patientName: 'John Smith',
    expiresAt: '2024-01-25T18:30:00Z',
    scope: ['last12Months'] as const
  }
];

export default function DoctorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeUntilExpiry = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffHours = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Expires soon';
    if (diffHours < 24) return `${diffHours}h left`;
    return `${Math.floor(diffHours / 24)}d left`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'pill-success';
      case 'pending': return 'pill-warning';
      default: return 'pill-accent';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Good morning, {user?.name?.replace('Dr. ', '')}
          </h1>
          <p className="text-muted-foreground mt-2">
            Here's your practice overview for today
          </p>
        </div>
        <Button 
          onClick={() => navigate('/doctor/new-patient')}
          className="btn-primary"
        >
          <KeyRound className="h-4 w-4 mr-2" />
          Add New Patient
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Today's Appointments"
          value={mockOverview.todayAppointments}
          icon={Calendar}
          description="Scheduled for today"
        />
        <StatsCard
          title="Active Episodes"
          value={mockOverview.activeEpisodes}
          icon={ClipboardList}
          description="Ongoing treatments"
        />
        <StatsCard
          title="Expiring Consents"
          value={mockOverview.expiringConsents}
          icon={Timer}
          description="Need renewal soon"
          className="ring-2 ring-warning/20"
        />
        <StatsCard
          title="Total Patients"
          value="127"
          icon={Users}
          description="Under your care"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-brand" />
                    <span>Today's Appointments</span>
                  </CardTitle>
                  <CardDescription>Your scheduled patients</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  View Full Schedule
                </Button>
              </CardHeader>
              <CardContent>
                {mockOverview.todayPatients.length > 0 ? (
                  <div className="space-y-4">
                    {mockOverview.todayPatients.map((patient, index) => (
                      <motion.div
                        key={patient.pin}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-muted/20 rounded-xl hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-brand/10 rounded-lg">
                            <UserCheck className="h-5 w-5 text-brand" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {patient.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              PIN: {patient.pin} • {patient.age}yo {patient.gender} • {patient.type}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <p className="text-sm font-medium text-foreground">
                              {patient.time}
                            </p>
                            <Badge className={`text-xs ${getStatusColor(patient.status)}`}>
                              {patient.status}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={Calendar}
                    title="No appointments today"
                    description="Your schedule is clear for today"
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-24 flex-col space-y-2"
                    onClick={() => navigate('/doctor/new-patient')}
                  >
                    <KeyRound className="h-6 w-6 text-brand" />
                    <span>New Patient</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-24 flex-col space-y-2"
                    onClick={() => navigate('/doctor/patients')}
                  >
                    <Users className="h-6 w-6 text-brand" />
                    <span>Patient List</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-24 flex-col space-y-2"
                    onClick={() => navigate('/doctor/episodes')}
                  >
                    <ClipboardList className="h-6 w-6 text-brand" />
                    <span>Episodes</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-24 flex-col space-y-2"
                  >
                    <Stethoscope className="h-6 w-6 text-brand" />
                    <span>Templates</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Expiring Consents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Timer className="h-5 w-5 text-warning" />
                  <span>Expiring Consents</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {mockExpiringConsents.length > 0 ? (
                  <div className="space-y-3">
                    {mockExpiringConsents.map((consent) => (
                      <div
                        key={consent.id}
                        className="p-3 bg-warning/10 border border-warning/20 rounded-lg"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {consent.patientName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PIN: {consent.pin}
                            </p>
                          </div>
                          <Badge className="pill-warning text-xs">
                            {getTimeUntilExpiry(consent.expiresAt)}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="sm" className="w-full mt-2 text-xs">
                          Request Renewal
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={Timer}
                    title="No expiring consents"
                    description="All consents are up to date"
                    className="py-6"
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-accent-ui" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-foreground">Lab report available for Sarah Johnson</p>
                      <p className="text-xs text-muted-foreground">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-accent-ui rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-foreground">Consent approved by Robert Chen</p>
                      <p className="text-xs text-muted-foreground">15 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-warning rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-foreground">Appointment rescheduled</p>
                      <p className="text-xs text-muted-foreground">1 hour ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}