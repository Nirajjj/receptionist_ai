'use client';

import * as React from 'react';
import { Search, SlidersHorizontal, Phone, CalendarClock, CalendarCheck2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type PatientStatus = 'Active' | 'Inactive';

interface Patient {
  id: string;
  name: string;
  phone: string;
  lastVisit: string;
  nextAppointment: string;
  status: PatientStatus;
}

const patients: Patient[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    phone: '(555) 123-4567',
    lastVisit: 'Oct 12, 2023',
    nextAppointment: 'Nov 15, 2023',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    phone: '(555) 987-6543',
    lastVisit: 'Sep 28, 2023',
    nextAppointment: 'Unscheduled',
    status: 'Inactive',
  },
  {
    id: '3',
    name: 'Emily Chen',
    phone: '(555) 456-7890',
    lastVisit: 'Nov 01, 2023',
    nextAppointment: 'Dec 05, 2023',
    status: 'Active',
  },
  {
    id: '4',
    name: 'David Thompson',
    phone: '(555) 222-3333',
    lastVisit: 'Aug 15, 2023',
    nextAppointment: 'Unscheduled',
    status: 'Inactive',
  },
];

export default function PatientDirectory() {
  const [query, setQuery] = React.useState('');

  const filteredPatients = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter(
      (p) => p.name.toLowerCase().includes(q) || p.phone.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <section className="w-full rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4 lg:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold text-slate-900 sm:text-lg">Patient Directory</h2>

        <div className="flex w-full gap-2 sm:w-auto">
          <div className="relative min-w-0 flex-1 sm:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or phone..."
              className="h-9 pl-8 text-sm"
            />
          </div>
          <Button variant="outline" size="sm" className="h-9 shrink-0">
            <SlidersHorizontal className="mr-1.5 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                Patient Name
              </TableHead>
              <TableHead className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                Phone Number
              </TableHead>
              <TableHead className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                Last Visit
              </TableHead>
              <TableHead className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                Next Appointment
              </TableHead>
              <TableHead className="text-right text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredPatients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-sm text-slate-500">
                  No patients found.
                </TableCell>
              </TableRow>
            ) : (
              filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium text-slate-800">{patient.name}</TableCell>
                  <TableCell className="text-slate-600">{patient.phone}</TableCell>
                  <TableCell className="text-slate-600">{patient.lastVisit}</TableCell>
                  <TableCell className="text-slate-600">{patient.nextAppointment}</TableCell>
                  <TableCell className="text-right">
                    <StatusBadge status={patient.status} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <MobilePatientList patients={filteredPatients} />
    </section>
  );
}

function MobilePatientList({ patients }: { patients: Patient[] }) {
  return (
    <div className="space-y-2 md:hidden">
      {patients.length === 0 ? (
        <div className="rounded-lg border border-slate-200 p-6 text-center text-sm text-slate-500">
          No patients found.
        </div>
      ) : (
        patients.map((patient) => (
          <article key={patient.id} className="rounded-lg border border-slate-200 p-3">
            <div className="mb-2 flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold text-slate-900">{patient.name}</h3>
              <StatusBadge status={patient.status} />
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <p className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                {patient.phone}
              </p>
              <p className="flex items-center gap-1.5">
                <CalendarCheck2 className="h-3.5 w-3.5 text-slate-400" />
                Last visit: {patient.lastVisit}
              </p>
              <p className="flex items-center gap-1.5">
                <CalendarClock className="h-3.5 w-3.5 text-slate-400" />
                Next: {patient.nextAppointment}
              </p>
            </div>
          </article>
        ))
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: PatientStatus }) {
  return (
    <Badge
      variant="secondary"
      className={
        status === 'Active'
          ? 'bg-blue-100 text-blue-700 hover:bg-blue-100'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-100'
      }
    >
      {status}
    </Badge>
  );
}
