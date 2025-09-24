import { 
  FlaskConical, 
  Upload, 
  Users, 
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  KeyRound,
  TrendingUp
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
  pendingOrders: 8,
  inProgress: 12,
  completedToday: 15,
  recentUploads: [
    {
      id: '1',
      patientPin: 'UHB1234',
      patientName: 'Sarah Johnson',
      testName: 'Complete Blood Count',
      uploadedAt: '2024-01-24T14:30:00Z',
      status: 'available' as const
    },
    {
      id: '2',
      patientPin: 'UHB5678', 
      patientName: 'Robert Chen',
      testName: 'Lipid Profile',
      uploadedAt: '2024-01-24T11:15:00Z',
      status: 'available' as const
    },
    {
      id: '3',
      patientPin: 'UHB9012',
      patientName: 'Maria Garcia',
      testName: 'Thyroid Function',
      uploadedAt: '2024-01-24T09:45:00Z',
      status: 'available' as const
    }
  ]
};

const mockPendingOrders = [
  {
    id: '1',
    patientPin: 'UHB3456',
    patientName: 'John Smith',
    tests: ['HbA1c', 'Fasting Glucose'],
    orderedBy: 'Dr. Michael Chen',
    orderedAt: '2024-01-24T08:00:00Z',
    priority: 'high' as const
  },
  {
    id: '2',
    patientPin: 'UHB7890',
    patientName: 'Emily Wilson',
    tests: ['Complete Blood Count'],
    orderedBy: 'Dr. Sarah Ahmed',
    orderedAt: '2024-01-24T10:30:00Z',
    priority: 'normal' as const
  }
];

export default function LabDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'pill-danger';
      case 'urgent': return 'pill-danger';
      case 'normal': return 'pill-accent';
      default: return 'pill-accent';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {user?.name} Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Laboratory operations and test management
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline"
            onClick={() => navigate('/lab/new-patient')}
          >
            <KeyRound className="h-4 w-4 mr-2" />
            New Patient
          </Button>
          <Button 
            onClick={() => navigate('/lab/reports/upload')}
            className="btn-primary"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Pending Orders"
          value={mockOverview.pendingOrders}
          icon={Clock}
          description="Awaiting processing"
          className="ring-2 ring-warning/20"
        />
        <StatsCard
          title="In Progress"
          value={mockOverview.inProgress}
          icon={FlaskConical}
          description="Currently testing"
        />
        <StatsCard
          title="Completed Today"
          value={mockOverview.completedToday}
          icon={CheckCircle}
          description="Reports uploaded"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Total Patients"
          value="89"
          icon={Users}
          description="This month"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-warning" />
                    <span>Pending Orders</span>
                  </CardTitle>
                  <CardDescription>Tests waiting to be processed</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  View All Orders
                </Button>
              </CardHeader>
              <CardContent>
                {mockPendingOrders.length > 0 ? (
                  <div className="space-y-4">
                    {mockPendingOrders.map((order, index) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-muted/20 rounded-xl hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-warning/10 rounded-lg">
                            <AlertTriangle className="h-5 w-5 text-warning" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {order.patientName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              PIN: {order.patientPin} • {order.tests.join(', ')}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Ordered by {order.orderedBy} • {formatDateTime(order.orderedAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className={`text-xs ${getPriorityColor(order.priority)}`}>
                            {order.priority}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            Process
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={Clock}
                    title="No pending orders"
                    description="All orders have been processed"
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Uploads */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-success" />
                    <span>Recent Uploads</span>
                  </CardTitle>
                  <CardDescription>Latest test reports uploaded</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  View All Reports
                </Button>
              </CardHeader>
              <CardContent>
                {mockOverview.recentUploads.length > 0 ? (
                  <div className="space-y-4">
                    {mockOverview.recentUploads.map((upload, index) => (
                      <motion.div
                        key={upload.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-muted/20 rounded-xl hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-success/10 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-success" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {upload.testName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {upload.patientName} • PIN: {upload.patientPin}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Uploaded {formatDateTime(upload.uploadedAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
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
                    title="No recent uploads"
                    description="Start uploading test reports"
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common laboratory tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => navigate('/lab/reports/upload')}
                  className="w-full justify-start btn-primary"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Report
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/lab/new-patient')}
                >
                  <KeyRound className="h-4 w-4 mr-2" />
                  New Patient Access
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/lab/reports')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Manage Reports
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/lab/patients')}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Patient Directory
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Performance Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-accent-ui" />
                  <span>This Week</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Reports Uploaded</span>
                  <span className="font-semibold text-foreground">47</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg. Turnaround</span>
                  <span className="font-semibold text-foreground">2.3 hrs</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Patients Served</span>
                  <span className="font-semibold text-foreground">89</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Quality Score</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-success">98.5%</span>
                    <Badge className="pill-success text-xs">Excellent</Badge>
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