// Common types
export type Status = 'pending' | 'in_progress' | 'completed' | 'on_hold' | 'overdue'
export type Priority = 'high' | 'medium' | 'low'
export type Theme = 'light' | 'dark' | 'system'

// User & Auth
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'admin' | 'member' | 'viewer'
}

// Documents
export interface Document {
  id: string
  title: string
  slug: string
  category: 'ata' | 'business_plan' | 'research' | 'legal' | 'financial'
  contentPath: string
  createdAt: string
  updatedAt: string
  project?: string
  tags: string[]
  excerpt?: string
}

// Projects
export interface Project {
  id: string
  name: string
  slug: string
  description: string
  status: Status
  progress: number
  startDate: string
  endDate?: string
  budget?: number
  currentSpend?: number
  owner: string
  team: string[]
  milestones: Milestone[]
  color: string
  icon: string
}

export interface Milestone {
  id: string
  title: string
  date: string
  completed: boolean
  description?: string
}

// Actions / Tasks
export interface Action {
  id: string
  title: string
  description?: string
  status: Status
  priority: Priority
  owner: string
  deadline: string
  createdAt: string
  completedAt?: string
  project?: string
  tags: string[]
}

// Stakeholders
export interface Stakeholder {
  id: string
  name: string
  role: string
  company?: string
  email?: string
  phone?: string
  location?: string
  avatar?: string
  bio?: string
  expertise: string[]
  projects: string[]
  socialLinks?: {
    linkedin?: string
    instagram?: string
    website?: string
  }
}

// Financial
export interface FinancialMetric {
  id: string
  name: string
  value: number
  currency: string
  change?: number
  changeType?: 'increase' | 'decrease'
  period: string
}

export interface RevenueProjection {
  period: string
  projected: number
  actual?: number
  variance?: number
}

// Timeline
export interface TimelineEvent {
  id: string
  title: string
  date: string
  type: 'milestone' | 'meeting' | 'deadline' | 'launch' | 'review'
  project?: string
  description?: string
  completed: boolean
}

// Dashboard
export interface DashboardMetric {
  id: string
  label: string
  value: string | number
  change?: number
  icon: string
  color: string
}

export interface ActivityItem {
  id: string
  type: 'document' | 'action' | 'project' | 'meeting' | 'financial'
  title: string
  description: string
  timestamp: string
  user?: string
  link?: string
}
