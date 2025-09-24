import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  UserRound, 
  Stethoscope, 
  FlaskConical, 
  ShieldCheck, 
  Bell, 
  FileText, 
  ClipboardList,
  Calendar,
  Pill,
  KeyRound,
  Settings,
  BadgeCheck,
  Upload,
  Users,
  Timer
} from 'lucide-react';
import type { UserRole } from '@/types';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  userRole?: UserRole;
}

const getNavigationItems = (role?: UserRole) => {
  switch (role) {
    case 'patient':
      return [
        { to: '/patient', icon: Home, label: 'Dashboard' },
        { to: '/patient/treatments', icon: Stethoscope, label: 'Treatments' },
        { to: '/patient/reports', icon: FileText, label: 'Reports' },
        { to: '/patient/consents', icon: ShieldCheck, label: 'Consents' },
        { to: '/patient/alerts', icon: Bell, label: 'Alerts' },
        { to: '/patient/schemes', icon: BadgeCheck, label: 'Schemes' },
        { to: '/patient/profile', icon: UserRound, label: 'Profile' },
      ];
    case 'doctor':
      return [
        { to: '/doctor', icon: Home, label: 'Dashboard' },
        { to: '/doctor/new-patient', icon: KeyRound, label: 'New Patient' },
        { to: '/doctor/patients', icon: Users, label: 'My Patients' },
        { to: '/doctor/episodes', icon: ClipboardList, label: 'Episodes' },
        { to: '/doctor/profile', icon: UserRound, label: 'Profile' },
      ];
    case 'lab':
      return [
        { to: '/lab', icon: Home, label: 'Dashboard' },
        { to: '/lab/new-patient', icon: KeyRound, label: 'New Patient' },
        { to: '/lab/reports', icon: FileText, label: 'Reports' },
        { to: '/lab/reports/upload', icon: Upload, label: 'Upload Report' },
        { to: '/lab/patients', icon: Users, label: 'Patients' },
        { to: '/lab/profile', icon: UserRound, label: 'Profile' },
      ];
    default:
      return [];
  }
};

export function Sidebar({ isOpen, userRole }: SidebarProps) {
  const navigationItems = getNavigationItems(userRole);

  return (
    <motion.aside
      initial={{ width: isOpen ? 280 : 80 }}
      animate={{ width: isOpen ? 280 : 80 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="glass-nav border-r border-border/50 flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-border/50">
        <motion.div
          initial={{ opacity: isOpen ? 1 : 0 }}
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center space-x-3"
        >
          <div className="p-2 gradient-brand rounded-xl">
            <Stethoscope className="h-6 w-6 text-white" />
          </div>
          {isOpen && (
            <div>
              <h1 className="text-lg font-semibold text-foreground">UHB</h1>
              <p className="text-sm text-muted-foreground capitalize">{userRole} Portal</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200',
                'hover:bg-sidebar-accent/50 focus-brand',
                isActive 
                  ? 'bg-brand text-brand-foreground shadow-md' 
                  : 'text-sidebar-foreground hover:text-sidebar-accent-foreground'
              )
            }
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {isOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="font-medium"
              >
                {item.label}
              </motion.span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border/50">
        <NavLink
          to={`/${userRole}/profile`}
          className="flex items-center space-x-3 px-3 py-3 rounded-xl hover:bg-sidebar-accent/50 transition-all duration-200 focus-brand"
        >
          <Settings className="h-5 w-5 text-sidebar-foreground" />
          {isOpen && (
            <span className="font-medium text-sidebar-foreground">Settings</span>
          )}
        </NavLink>
      </div>
    </motion.aside>
  );
}