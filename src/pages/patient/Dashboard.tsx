import { 
  Calendar, 
  FileText, 
  Stethoscope, 
  ShieldCheck, 
  Bell, 
  BadgeCheck,
  TrendingUp,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatsCard } from '@/components/ui/stats-card';
import { EmptyState } from '@/components/ui/empty-state';
import { motion } from 'framer-motion';
import { useAuth } from '@/stores/auth';

// Mock data
const mockOverview = {
  activeEpisodes: 2,
  upcomingAppointments: 1,
  recentReports: 3,
  pendingConsents: 1,
  todayAlerts: 2,
  nextAppointment: {
    date: '2024-01-25T10:00:00Z',
    doctorName: 'Dr. Michael Chen',
    type: 'Follow-up Consultation'
  },
  recentReportsList: [
    {
      id: '1',
      testName: 'Complete Blood Count',
      uploadedAt: '2024-01-20T14:30:00Z',
      labName: 'MedLab Services',
      status: 'available' as const
    },
    {
      id: '2', 
      testName: 'Lipid Profile',
      uploadedAt: '2024-01-18T09:15:00Z',
      labName: 'DiagnosticCare',
      status: 'available' as const
    }
  ]
};

const mockAlerts = [
  {
    id: '1',
    type: 'medication' as const,
    title: 'Medication Reminder',
    message: 'Time to take your morning medications',
    priority: 'high' as const,
    isRead: false
  },
  {
    id: '2',
    type: 'appointment' as const, 
    title: 'Upcoming Appointment',
    message: 'Appointment with Dr. Chen tomorrow at 10:00 AM',
    priority: 'medium' as const,
    isRead: false
  }
];

export default function PatientDashboard() {
  const { user } = useAuth();

  const formatDate = (dateString: string) => {
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-muted-foreground mt-2">
          Your health overview and recent activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Active Treatments"
          value={mockOverview.activeEpisodes}
          icon={Stethoscope}
          description="Ongoing care episodes"
        />
        <StatsCard
          title="Upcoming Appointments"
          value={mockOverview.upcomingAppointments}
          icon={Calendar}
          description="Scheduled visits"
        />
        <StatsCard
          title="Recent Reports"
          value={mockOverview.recentReports}
          icon={FileText}
          description="Lab results available"
        />
        <StatsCard
          title="Consent Requests"
          value={mockOverview.pendingConsents}
          icon={ShieldCheck}
          description="Awaiting your approval"
          className="ring-2 ring-warning/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Next Appointment */}
          {mockOverview.nextAppointment && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-brand" />
                    <span>Next Appointment</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-lg font-semibold text-foreground">
                        {mockOverview.nextAppointment.type}
                      </p>
                      <p className="text-muted-foreground">
                        with {mockOverview.nextAppointment.doctorName}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Clock className="h-4 w-4 text-accent-ui" />
                        <span className="text-sm text-accent-ui font-medium">
                          {formatDate(mockOverview.nextAppointment.date)}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Recent Reports */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-brand" />
                    <span>Recent Lab Reports</span>
                  </CardTitle>
                  <CardDescription>Your latest test results</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                {mockOverview.recentReportsList.length > 0 ? (
                  <div className="space-y-4">
                    {mockOverview.recentReportsList.map((report, index) => (
                      <motion.div
                        key={report.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-muted/20 rounded-xl hover:bg-muted/30 transition-colors"
                      >
                        <div>
                          <p className="font-medium text-foreground">{report.testName}</p>
                          <p className="text-sm text-muted-foreground">
                            {report.labName} • {formatDate(report.uploadedAt)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className="pill-success">Available</Badge>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={FileText}
                    title="No reports yet"
                    description="Your lab reports will appear here once available"
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-warning" />
                  <span>Today's Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {mockAlerts.length > 0 ? (
                  <div className="space-y-3">
                    {mockAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="flex items-start space-x-3 p-3 bg-muted/20 rounded-lg"
                      >
                        <AlertCircle className={`h-4 w-4 mt-0.5 ${
                          alert.priority === 'high' ? 'text-danger' : 
                          alert.priority === 'medium' ? 'text-warning' : 'text-accent-ui'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            {alert.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {alert.message}
                          </p>
                        </div>
                        <Badge className={`text-xs ${getPriorityColor(alert.priority)}`}>
                          {alert.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={Bell}
                    title="No alerts today"
                    description="All caught up!"
                    className="py-6"
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Manage Consents
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <BadgeCheck className="h-4 w-4 mr-2" />
                  Apply for Schemes
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Download Records
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}