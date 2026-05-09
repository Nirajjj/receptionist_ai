// prisma/seed.ts
import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { prisma } from '@/lib/prisma';

// const prisma = new PrismaClient();

// ----------------------------
// Helper functions
// ----------------------------

function randomFromArray<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Get a date X days from now at specific time
function dateFromNow(daysOffset: number, hour: number, minute: number = 0): Date {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  date.setHours(hour, minute, 0, 0);
  return date;
}

// ----------------------------
// Main Seed Function
// ----------------------------

async function main() {
  console.log('🌱 Starting seed...\n');

  // ----------------------------
  // 1. CLEAN existing data
  // ----------------------------
  await prisma.notification.deleteMany();
  await prisma.callLog.deleteMany();
  await prisma.blockedSlot.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.clinicMembership.deleteMany();
  await prisma.user.deleteMany();
  await prisma.clinic.deleteMany();

  console.log('🗑️  Cleared old data\n');

  // ----------------------------
  // 2. CREATE ONE CLINIC
  // ----------------------------
  const clinic = await prisma.clinic.create({
    data: {
      name: 'HealthFirst Family Clinic',
      address: '123 MG Road, Bangalore, Karnataka',
      phone: '+918012345678',
    },
  });

  console.log(`🏥 Created clinic: ${clinic.name}`);

  // ----------------------------
  // 3. CREATE ONE DOCTOR
  // ----------------------------
  const doctor = await prisma.user.create({
    data: {
      name: 'Dr. Rajesh Kumar',
      email: 'rajesh@healthfirst.com',
      phone: '+919876543210',
      role: 'DOCTOR',
    },
  });

  console.log(`👨‍⚕️ Created doctor: ${doctor.name}`);

  // ----------------------------
  // 4. CREATE ADMIN
  // ----------------------------
  const admin = await prisma.user.create({
    data: {
      name: 'Priya Admin',
      email: 'admin@healthfirst.com',
      phone: '+919876543211',
      role: 'ADMIN',
    },
  });

  console.log(`👔 Created admin: ${admin.name}`);

  // ----------------------------
  // 5. CREATE CLINIC MEMBERSHIPS
  // ----------------------------
  await prisma.clinicMembership.createMany({
    data: [
      { userId: doctor.id, clinicId: clinic.id, role: 'DOCTOR' },
      { userId: admin.id, clinicId: clinic.id, role: 'ADMIN' },
    ],
  });

  console.log(`🔗 Created clinic memberships\n`);

  // ----------------------------
  // 6. CREATE 30 PATIENTS
  // ----------------------------
  const patientNames = [
    'Aarav Sharma',
    'Vivaan Patel',
    'Aditya Singh',
    'Vihaan Gupta',
    'Arjun Mehta',
    'Sai Reddy',
    'Reyansh Verma',
    'Krishna Nair',
    'Ishaan Joshi',
    'Shaurya Iyer',
    'Ananya Kapoor',
    'Diya Rao',
    'Saanvi Khan',
    'Aadhya Shah',
    'Pari Desai',
    'Anika Mishra',
    'Navya Bose',
    'Kiara Pillai',
    'Myra Banerjee',
    'Sara Chopra',
    'Rohan Malhotra',
    'Karan Agarwal',
    'Vikram Bhatt',
    'Yash Saxena',
    'Aryan Trivedi',
    'Riya Menon',
    'Tara Pandey',
    'Zara Sinha',
    'Naina Dutta',
    'Esha Krishnan',
  ];

  const patients = [];
  for (let i = 0; i < 30; i++) {
    const patient = await prisma.user.create({
      data: {
        name: patientNames[i],
        phone: `+9199${String(10000000 + i).padStart(8, '0')}`,
        email: `${patientNames[i].toLowerCase().replace(' ', '.')}@example.com`,
        role: 'PATIENT',
      },
    });
    patients.push(patient);
  }

  console.log(`🧑 Created ${patients.length} patients`);

  // ----------------------------
  // 7. CREATE AVAILABILITY (Mon-Sat)
  // ----------------------------

  // Monday - Friday: 9 AM to 5 PM (with 30 min slots)
  for (let day = 1; day <= 5; day++) {
    await prisma.availability.create({
      data: {
        doctorId: doctor.id,
        clinicId: clinic.id,
        dayOfWeek: day,
        startMinutes: 540, // 9:00 AM
        endMinutes: 1020, // 5:00 PM
        slotDuration: 30,
        isActive: true,
      },
    });
  }

  // Saturday: 9 AM to 1 PM (half day)
  await prisma.availability.create({
    data: {
      doctorId: doctor.id,
      clinicId: clinic.id,
      dayOfWeek: 6,
      startMinutes: 540, // 9:00 AM
      endMinutes: 780, // 1:00 PM
      slotDuration: 30,
      isActive: true,
    },
  });

  console.log(`📅 Created availability schedules (Mon-Sat)\n`);

  // ----------------------------
  // 8. CREATE 30 APPOINTMENTS
  // Mix of past, today, and future
  // ----------------------------

  const appointmentNotes = [
    'Routine checkup',
    'Fever and cold consultation',
    'Follow-up visit',
    'Blood pressure monitoring',
    'Diabetes management',
    'Skin allergy consultation',
    'Back pain assessment',
    'Annual health checkup',
    'Vaccination',
    'Headache and migraine',
    'Stomach pain consultation',
    'Joint pain checkup',
    'Cough and throat infection',
    'General consultation',
    'Pre-surgery consultation',
  ];

  const slotHours = [9, 10, 11, 12, 14, 15, 16];
  const slotMinutes = [0, 30];

  // 10 PAST appointments (completed/cancelled/no-show)
  for (let i = 0; i < 10; i++) {
    const daysAgo = -randomInt(1, 30);
    const date = dateFromNow(daysAgo, randomFromArray(slotHours), randomFromArray(slotMinutes));

    // Skip Sundays
    if (date.getDay() === 0) continue;

    const statuses = ['COMPLETED', 'COMPLETED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'] as const;

    await prisma.appointment.create({
      data: {
        patientId: patients[i].id,
        doctorId: doctor.id,
        clinicId: clinic.id,
        handledById: admin.id,
        date,
        durationMins: 30,
        status: randomFromArray(statuses),
        notes: randomFromArray(appointmentNotes),
      },
    });
  }

  // 15 FUTURE scheduled appointments
  const usedSlots = new Set<string>();

  for (let i = 10; i < 25; i++) {
    let date: Date;
    let slotKey: string;
    let attempts = 0;

    // Find a unique slot
    do {
      const daysAhead = randomInt(1, 14);
      date = dateFromNow(daysAhead, randomFromArray(slotHours), randomFromArray(slotMinutes));
      slotKey = date.toISOString();
      attempts++;
    } while ((usedSlots.has(slotKey) || date.getDay() === 0) && attempts < 20);

    usedSlots.add(slotKey);

    await prisma.appointment.create({
      data: {
        patientId: patients[i].id,
        doctorId: doctor.id,
        clinicId: clinic.id,
        handledById: admin.id,
        date,
        durationMins: 30,
        status: 'SCHEDULED',
        notes: randomFromArray(appointmentNotes),
      },
    });
  }

  // 5 TODAY appointments (mix of past hours and future hours today)
  const todayHours = [9, 11, 14, 15, 16];
  for (let i = 25; i < 30; i++) {
    const hour = todayHours[i - 25];
    const date = dateFromNow(0, hour, 0);

    // Skip if today is Sunday
    if (date.getDay() === 0) continue;

    const status = date < new Date() ? 'COMPLETED' : 'SCHEDULED';

    await prisma.appointment.create({
      data: {
        patientId: patients[i].id,
        doctorId: doctor.id,
        clinicId: clinic.id,
        handledById: admin.id,
        date,
        durationMins: 30,
        status,
        notes: randomFromArray(appointmentNotes),
      },
    });
  }

  const totalAppts = await prisma.appointment.count();
  console.log(`📋 Created ${totalAppts} appointments`);

  // ----------------------------
  // 9. CREATE BLOCKED SLOTS (15 entries)
  // ----------------------------

  const blockReasons = [
    'Doctor on leave',
    'Personal appointment',
    'Medical conference',
    'Lunch break',
    'Emergency surgery',
    'Equipment maintenance',
    'Hospital rounds',
    'Training session',
    'Family event',
    'Sick leave',
  ];

  // Create different types of blocked slots
  const blockedSlotData = [
    // Tomorrow lunch break
    { dayOffset: 1, startHour: 13, endHour: 14, reason: 'Lunch break' },
    // Day after lunch break
    { dayOffset: 2, startHour: 13, endHour: 14, reason: 'Lunch break' },
    // Next Friday afternoon off
    { dayOffset: 7, startHour: 14, endHour: 17, reason: 'Personal appointment' },
    // Full day vacation next week
    { dayOffset: 10, startHour: 0, endHour: 23, reason: 'Doctor on leave' },
    { dayOffset: 11, startHour: 0, endHour: 23, reason: 'Doctor on leave' },
    // Conference week
    { dayOffset: 15, startHour: 9, endHour: 17, reason: 'Medical conference' },
    { dayOffset: 16, startHour: 9, endHour: 17, reason: 'Medical conference' },
    // Random afternoon off
    { dayOffset: 5, startHour: 15, endHour: 17, reason: 'Hospital rounds' },
    // Morning training
    { dayOffset: 8, startHour: 9, endHour: 11, reason: 'Training session' },
    // Past blocked slots (history)
    { dayOffset: -3, startHour: 13, endHour: 14, reason: 'Lunch break' },
    { dayOffset: -5, startHour: 14, endHour: 17, reason: 'Sick leave' },
    { dayOffset: -7, startHour: 9, endHour: 17, reason: 'Doctor on leave' },
    { dayOffset: -10, startHour: 13, endHour: 14, reason: 'Lunch break' },
    { dayOffset: -14, startHour: 9, endHour: 11, reason: 'Family event' },
    { dayOffset: -20, startHour: 15, endHour: 17, reason: 'Emergency surgery' },
  ];

  for (const block of blockedSlotData) {
    await prisma.blockedSlot.create({
      data: {
        doctorId: doctor.id,
        clinicId: clinic.id,
        start: dateFromNow(block.dayOffset, block.startHour, 0),
        end: dateFromNow(block.dayOffset, block.endHour, 0),
        reason: block.reason,
      },
    });
  }

  console.log(`🚫 Created ${blockedSlotData.length} blocked slots`);

  // ----------------------------
  // 10. CREATE 30 NOTIFICATIONS
  // ----------------------------

  const notificationTypes = [
    {
      type: 'APPOINTMENT_CONFIRMED',
      messageTemplate: (name: string) =>
        `Hi ${name}, your appointment with Dr. Rajesh Kumar has been confirmed.`,
    },
    {
      type: 'APPOINTMENT_REMINDER',
      messageTemplate: (name: string) =>
        `Reminder: ${name}, you have an appointment tomorrow with Dr. Rajesh Kumar.`,
    },
    {
      type: 'APPOINTMENT_CANCELLED',
      messageTemplate: (name: string) =>
        `${name}, your appointment has been cancelled. Please reschedule.`,
    },
    {
      type: 'APPOINTMENT_RESCHEDULED',
      messageTemplate: (name: string) =>
        `${name}, your appointment has been successfully rescheduled.`,
    },
    {
      type: 'PRESCRIPTION_READY',
      messageTemplate: (name: string) =>
        `Hi ${name}, your prescription is ready for pickup at HealthFirst Clinic.`,
    },
    {
      type: 'TEST_RESULTS',
      messageTemplate: (name: string) =>
        `${name}, your test results are now available. Please check with the clinic.`,
    },
    {
      type: 'FOLLOW_UP',
      messageTemplate: (name: string) =>
        `${name}, Dr. Rajesh recommends a follow-up appointment in 2 weeks.`,
    },
  ];

  for (let i = 0; i < 30; i++) {
    const patient = patients[i];
    const notif = randomFromArray(notificationTypes);

    await prisma.notification.create({
      data: {
        userId: patient.id,
        type: notif.type,
        message: notif.messageTemplate(patient.name ?? 'Patient'),
        isRead: Math.random() > 0.5,
      },
    });
  }

  console.log(`🔔 Created 30 notifications`);

  // ----------------------------
  // 11. CREATE 15 CALL LOGS
  // ----------------------------

  const callLogData = [
    {
      transcript: 'Hi, I want to book an appointment for tomorrow at 10 AM.',
      intent: 'BOOK_APPOINTMENT',
    },
    {
      transcript: 'I need to cancel my appointment scheduled for next Monday.',
      intent: 'CANCEL_APPOINTMENT',
    },
    {
      transcript: 'Can I reschedule my appointment to next Friday at 2 PM?',
      intent: 'RESCHEDULE_APPOINTMENT',
    },
    {
      transcript: 'What are your clinic hours on Saturday?',
      intent: 'CLINIC_INFO',
    },
    {
      transcript: 'I want to check my upcoming appointment status.',
      intent: 'CHECK_STATUS',
    },
    {
      transcript: 'Hello, I would like to book a consultation for my child.',
      intent: 'BOOK_APPOINTMENT',
    },
    {
      transcript: 'Is Dr. Rajesh available this weekend?',
      intent: 'CHECK_AVAILABILITY',
    },
    {
      transcript: 'Can you tell me where the clinic is located?',
      intent: 'CLINIC_INFO',
    },
    {
      transcript: 'I want to book an appointment for a fever checkup.',
      intent: 'BOOK_APPOINTMENT',
    },
    {
      transcript: 'How much does a general consultation cost?',
      intent: 'PRICING_INQUIRY',
    },
    {
      transcript: 'I forgot when my appointment is scheduled.',
      intent: 'CHECK_STATUS',
    },
    {
      transcript: 'My child has a rash, can I bring her in tomorrow?',
      intent: 'BOOK_APPOINTMENT',
    },
    {
      transcript: 'Please cancel all my future appointments.',
      intent: 'CANCEL_APPOINTMENT',
    },
    {
      transcript: 'Do you accept walk-in patients?',
      intent: 'CLINIC_INFO',
    },
    {
      transcript: 'I need to move my Wednesday appointment to Thursday.',
      intent: 'RESCHEDULE_APPOINTMENT',
    },
  ];

  for (const call of callLogData) {
    const randomPatient = randomFromArray(patients);
    await prisma.callLog.create({
      data: {
        phone: randomPatient.phone,
        transcript: call.transcript,
        intent: call.intent,
        clinicId: clinic.id,
      },
    });
  }

  console.log(`📞 Created ${callLogData.length} call logs\n`);

  // ----------------------------
  // SUMMARY
  // ----------------------------
  console.log('✅ Seed completed successfully!\n');
  console.log('📊 Database Summary:');
  console.log(`   Clinics:        ${await prisma.clinic.count()}`);
  console.log(`   Users (total):  ${await prisma.user.count()}`);
  console.log(`     - Doctors:    1`);
  console.log(`     - Admins:     1`);
  console.log(`     - Patients:   30`);
  console.log(`   Memberships:    ${await prisma.clinicMembership.count()}`);
  console.log(`   Availability:   ${await prisma.availability.count()}`);
  console.log(`   Appointments:   ${await prisma.appointment.count()}`);
  console.log(`   Blocked Slots:  ${await prisma.blockedSlot.count()}`);
  console.log(`   Notifications:  ${await prisma.notification.count()}`);
  console.log(`   Call Logs:      ${await prisma.callLog.count()}`);

  console.log('\n🔑 Important IDs (save these for testing):');
  console.log(`   Clinic ID:    ${clinic.id}`);
  console.log(`   Doctor ID:    ${doctor.id}`);
  console.log(`   Admin ID:     ${admin.id}`);
  console.log(`\n📞 Test patient phones:`);
  console.log(`   ${patients[0].name}: ${patients[0].phone}`);
  console.log(`   ${patients[1].name}: ${patients[1].phone}`);
  console.log(`   ${patients[2].name}: ${patients[2].phone}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
