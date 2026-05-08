import { Appointment, SidebarItem, StatCard } from '@/types/dashboard';

export const sidebarItems: SidebarItem[] = [
  {
    label: 'Dashboard',
    icon: 'dashboard',
    active: true,
  },
  {
    label: 'Patients',
    icon: 'group',
  },
  {
    label: 'Availability',
    icon: 'calendar_month',
  },
  {
    label: 'Call Logs',
    icon: 'call',
  },
];

export const stats: StatCard[] = [
  {
    title: 'Appointments Today',
    value: '24',
    icon: 'calendar_today',
  },
  {
    title: 'AI Calls Handled',
    value: '18',
    icon: 'phone_in_talk',
  },
  {
    title: 'Cancellations',
    value: '2',
    icon: 'cancel',
    danger: true,
  },
];

export const appointments: Appointment[] = [
  {
    patient: 'Sarah Jenkins',
    time: '09:00 AM - 09:45 AM',
    type: 'Initial Consultation',
    aiBooked: true,
  },
  {
    patient: 'Michael Chen',
    time: '10:30 AM - 11:00 AM',
    type: 'Follow-up',
    faded: true,
  },
  {
    patient: 'Emily Rodriguez',
    time: '01:15 PM - 02:00 PM',
    type: 'Physical Exam',
  },
];
