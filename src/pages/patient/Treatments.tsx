import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Stethoscope, 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  Pill,
  Activity,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '@/components/ui/empty-state';
import { motion } from 'framer-motion';

// Mock data
const mockEpisodes = [
  {
    id: 'EP001',
    status: 'ongoing' as const,
    diagnosis: 'Hypertension Management',
    doctorName: 'Dr. Michael Chen',
    doctorId: 'D001',
    startedAt: '2024-01-15T09:00:00Z',
    nextVisitAt: '2024-01-30T10:00:00Z',
    prescriptionCount: 3,
    procedureCount: 2,
    summary: 'Regular monitoring and medication adjustment for blood pressure control'
  },
  {
    id: 'EP002', 
    status: 'upcoming' as const,
    diagnosis: 'Annual Health Checkup',
    doctorName: 'Dr. Sarah Ahmed',
    doctorId: 'D002',
    startedAt: '2024-02-01T14:00:00Z',
    nextVisitAt: '2024-02-01T14:00:00Z',
    prescriptionCount: 0,
    procedureCount: 4,
    summary: 'Comprehensive annual physical examination and preventive care'
  },
  {
    id: 'EP003',
    status: 'closed' as const,
    diagnosis: 'Upper Respiratory Infection',
    doctorName: 'Dr. Michael Chen',
    doctorId: 'D001',
    startedAt: '2023-12-10T11:30:00Z',
    nextVisitAt: null,
    prescriptionCount: 2,
    procedureCount: 1,
    summary: 'Successfully treated acute respiratory infection with full recovery'
  }
];

const mockTreatmentDetails = {
  EP001: {
    medications: [
      {
        name: 'Lisinopril 10mg',
        dosage: '1 tablet daily',
        frequency: 'Once daily in morning',
        duration: 'Ongoing',
        instructions: 'Take with or without food. Monitor blood pressure regularly.'
      },
      {
        name: 'Hydrochlorothiazide 25mg', 
        dosage: '1 tablet daily',
        frequency: 'Once daily in morning',
        duration: 'Ongoing',
        instructions: 'Take in morning to avoid nighttime urination. Stay hydrated.'
      }
    ],
    procedures: [
      {
        name: 'Blood Pressure Monitoring',
        date: '2024-01-15',
        status: 'completed',
        notes: 'BP: 128/82 mmHg - within target range'
      },
      {
        name: 'ECG',
        date: '2024-01-15', 
        status: 'completed',
        notes: 'Normal sinus rhythm, no abnormalities detected'
      }
    ],
    notes: [
      {
        date: '2024-01-15',
        note: 'Patient responding well to current medication regimen. BP shows improvement.',
        author: 'Dr. Michael Chen'
      },
      {
        date: '2024-01-22',
        note: 'Follow-up call: Patient reports no side effects. Adherence good.',
        author: 'Dr. Michael Chen'
      }
    ]
  }
};

export default function Treatments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEpisode, setSelectedEpisode] = useState<string | null>(null);
  const navigate = useNavigate();

  const filteredEpisodes = mockEpisodes.filter(episode => {
    const matchesSearch = episode.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         episode.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || episode.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing': return 'pill-success';
      case 'upcoming': return 'pill-warning';
      case 'closed': return 'pill-accent';
      default: return 'pill-accent';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ongoing': return Activity;
      case 'upcoming': return Calendar;
      case 'closed': return FileText;
      default: return FileText;
    }
  };

  if (selectedEpisode) {
    const episode = mockEpisodes.find(e => e.id === selectedEpisode);
    const details = mockTreatmentDetails[selectedEpisode as keyof typeof mockTreatmentDetails];
    
    if (!episode) return null;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedEpisode(null)}
              className="p-2"
            >
              ← Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{episode.diagnosis}</h1>
              <p className="text-muted-foreground">Episode {episode.id} • {episode.doctorName}</p>
            </div>
          </div>
          <Badge className={getStatusColor(episode.status)}>
            {episode.status}
          </Badge>
        </div>

        {/* Episode Overview */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Treatment Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Started</p>
                <p className="font-medium">{formatDate(episode.startedAt)}</p>
              </div>
              {episode.nextVisitAt && (
                <div>
                  <p className="text-sm text-muted-foreground">Next Visit</p>
                  <p className="font-medium">{formatDate(episode.nextVisitAt)}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Summary</p>
                <p className="font-medium">{episode.summary}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Treatment Details */}
        <Tabs defaultValue="medications" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="procedures">Procedures</TabsTrigger>
            <TabsTrigger value="notes">Doctor Notes</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>

          <TabsContent value="medications" className="space-y-4">
            {details?.medications ? (
              <div className="grid gap-4">
                {details.medications.map((med, index) => (
                  <Card key={index} className="glass-card">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{med.name}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                            <div>
                              <p className="text-sm text-muted-foreground">Dosage</p>
                              <p className="font-medium">{med.dosage}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Frequency</p>
                              <p className="font-medium">{med.frequency}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Duration</p>
                              <p className="font-medium">{med.duration}</p>
                            </div>
                          </div>
                          <div className="mt-3">
                            <p className="text-sm text-muted-foreground">Instructions</p>
                            <p className="text-sm">{med.instructions}</p>
                          </div>
                        </div>
                        <Pill className="h-6 w-6 text-brand ml-4" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Pill}
                title="No medications prescribed"
                description="No medications have been prescribed for this treatment episode"
              />
            )}
          </TabsContent>

          <TabsContent value="procedures" className="space-y-4">
            {details?.procedures ? (
              <div className="space-y-4">
                {details.procedures.map((procedure, index) => (
                  <Card key={index} className="glass-card">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">{procedure.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(procedure.date + 'T00:00:00Z')}
                          </p>
                          <p className="text-sm mt-2">{procedure.notes}</p>
                        </div>
                        <Badge className="pill-success">
                          {procedure.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Activity}
                title="No procedures recorded"
                description="No procedures have been performed for this treatment episode"
              />
            )}
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            {details?.notes ? (
              <div className="space-y-4">
                {details.notes.map((note, index) => (
                  <Card key={index} className="glass-card">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <p className="text-sm text-muted-foreground">
                          {formatDate(note.date + 'T00:00:00Z')}
                        </p>
                        <p className="text-sm font-medium text-brand">{note.author}</p>
                      </div>
                      <p className="text-foreground">{note.note}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={FileText}
                title="No notes available"
                description="No doctor notes have been added for this treatment episode"
              />
            )}
          </TabsContent>

          <TabsContent value="files">
            <EmptyState
              icon={FileText}
              title="No files attached"
              description="No additional files or documents are associated with this treatment"
            />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Treatments</h1>
        <p className="text-muted-foreground mt-2">
          View and manage your treatment episodes and medical care
        </p>
      </div>

      {/* Filters */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search treatments, diagnoses, or doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="focus-brand"
              />
            </div>
            <div className="flex items-center space-x-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Episodes List */}
      {filteredEpisodes.length > 0 ? (
        <div className="grid gap-6">
          {filteredEpisodes.map((episode, index) => {
            const StatusIcon = getStatusIcon(episode.status);
            
            return (
              <motion.div
                key={episode.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card hover:shadow-elevate transition-all duration-200 cursor-pointer"
                      onClick={() => setSelectedEpisode(episode.id)}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-brand/10 rounded-xl">
                          <StatusIcon className="h-6 w-6 text-brand" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-foreground">
                              {episode.diagnosis}
                            </h3>
                            <Badge className={getStatusColor(episode.status)}>
                              {episode.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">{episode.doctorName}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                Started {formatDate(episode.startedAt)}
                              </span>
                            </div>
                            {episode.nextVisitAt && (
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                  Next: {formatDate(episode.nextVisitAt)}
                                </span>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-3">
                            {episode.summary}
                          </p>
                          <div className="flex items-center space-x-6 mt-4">
                            <div className="flex items-center space-x-1">
                              <Pill className="h-4 w-4 text-accent-ui" />
                              <span className="text-sm text-muted-foreground">
                                {episode.prescriptionCount} prescriptions
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Activity className="h-4 w-4 text-accent-ui" />
                              <span className="text-sm text-muted-foreground">
                                {episode.procedureCount} procedures
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Stethoscope}
          title="No treatments found"
          description={searchTerm || statusFilter !== 'all' 
            ? "No treatments match your current filters" 
            : "You don't have any treatment episodes yet"}
        />
      )}
    </div>
  );
}