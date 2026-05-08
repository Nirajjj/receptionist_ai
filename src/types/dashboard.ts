export type Metric = {
  label: string;
  value: string;
  icon: string;
  tone: 'primary' | 'error';
};

export type TimelineAppointment = {
  name: string;
  slot: string;
  type: string;
  aiBooked: boolean;
  dimmed?: boolean;
};

export type Appointment = {
  name: string;
  slot: string;
  type: string;
  status: 'Scheduled' | 'Cancelled';
};
