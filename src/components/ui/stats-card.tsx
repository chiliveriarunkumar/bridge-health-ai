import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend, 
  className = '' 
}: StatsCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`glass-card hover:shadow-elevate transition-all duration-200 ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
              {description && (
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
              )}
              {trend && (
                <div className={`flex items-center mt-2 text-sm ${
                  trend.isPositive ? 'text-success' : 'text-danger'
                }`}>
                  <span className="font-medium">
                    {trend.isPositive ? '+' : ''}{trend.value}%
                  </span>
                  <span className="ml-1 text-muted-foreground">vs last period</span>
                </div>
              )}
            </div>
            <div className="p-3 bg-brand/10 rounded-xl">
              <Icon className="h-6 w-6 text-brand" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}