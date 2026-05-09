import 'dotenv/config';
import { prisma } from '@/lib/prisma';
import { PrismaClient } from '../generated/prisma/client';
// const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // ----------------------------
  // 1. CLEAN existing data (optional - good for re-running)
  // ----------------------------
  await prisma.notification.deleteMany();
  await prisma.callLog.deleteMany();
  await prisma.blockedSlot.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.clinicMembership.deleteMany();
  await prisma.user.deleteMany();
  await prisma.clinic.deleteMany();

  console.log('🗑️  Cleared old data');

  // ----------------------------
  // 2. CREATE CLINICS
  // ----------------------------
  const clinic1 = await prisma.clinic.create({
    data: {
      name: 'HealthFirst Clinic',
      address: '123 Main Street, Mumbai',
      phone: '+919999999991',
    },
  });

  const clinic2 = await prisma.clinic.create({
    data: {
      name: 'CityCare Medical Center',
      address: '456 Park Avenue, Delhi',
      phone: '+919999999992',
    },
  });

  console.log('🏥 Created clinics');

  // ----------------------------
  // 3. CREATE DOCTORS
  // ----------------------------
  const drAhmed = await prisma.user.create({
    data: {
      name: 'Dr. Ahmed Khan',
      email: 'ahmed@healthfirst.com',
      phone: '+919876543210',
      role: 'DOCTOR',
    },
  });

  const drSara = await prisma.user.create({
    data: {
      name: 'Dr. Sara Sharma',
      email: 'sara@healthfirst.com',
      phone: '+919876543211',
      role: 'DOCTOR',
    },
  });

  const drRavi = await prisma.user.create({
    data: {
      name: 'Dr. Ravi Patel',
      email: 'ravi@citycare.com',
      phone: '+919876543212',
      role: 'DOCTOR',
    },
  });

  console.log('👨‍⚕️ Created doctors');

  // ----------------------------
  // 4. CREATE ADMINS
  // ----------------------------
  const admin1 = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@healthfirst.com',
      phone: '+919876543200',
      role: 'ADMIN',
    },
  });

  console.log('👔 Created admin');

  // ----------------------------
  // 5. CREATE CLINIC MEMBERSHIPS
  // Dr. Ahmed works at BOTH clinics (shows multi-clinic support)
  // Dr. Sara works only at clinic1
  // Dr. Ravi works only at clinic2
  // ----------------------------
  await prisma.clinicMembership.createMany({
    data: [
      // Ahmed in clinic 1 as doctor
      { userId: drAhmed.id, clinicId: clinic1.id, role: 'DOCTOR' },
      // Ahmed in clinic 2 as admin (he owns clinic 2)
      { userId: drAhmed.id, clinicId: clinic2.id, role: 'ADMIN' },
      // Sara only in clinic 1
      { userId: drSara.id, clinicId: clinic1.id, role: 'DOCTOR' },
      // Ravi only in clinic 2
      { userId: drRavi.id, clinicId: clinic2.id, role: 'DOCTOR' },
      // Admin in clinic 1
      { userId: admin1.id, clinicId: clinic1.id, role: 'ADMIN' },
    ],
  });

  console.log('🔗 Created clinic memberships');

  // ----------------------------
  // 6. CREATE PATIENTS
  // ----------------------------
  const patient1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      phone: '+919999999001',
      role: 'PATIENT',
    },
  });

  const patient2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      phone: '+919999999002',
      role: 'PATIENT',
    },
  });

  const patient3 = await prisma.user.create({
    data: {
      name: 'Test Patient',
      phone: '9999999999', // for testing without country code
      role: 'PATIENT',
    },
  });

  console.log('🧑 Created patients');

  // ----------------------------
  // 7. CREATE AVAILABILITY
  // Each doctor works Mon-Fri (1-5)
  // 9 AM (540 min) to 5 PM (1020 min)
  // 30 min slots
  // ----------------------------

  const doctorClinicPairs = [
    { doctorId: drAhmed.id, clinicId: clinic1.id },
    { doctorId: drAhmed.id, clinicId: clinic2.id },
    { doctorId: drSara.id, clinicId: clinic1.id },
    { doctorId: drRavi.id, clinicId: clinic2.id },
  ];

  for (const pair of doctorClinicPairs) {
    // Mon-Fri (1, 2, 3, 4, 5)
    for (let day = 1; day <= 5; day++) {
      await prisma.availability.create({
        data: {
          doctorId: pair.doctorId,
          clinicId: pair.clinicId,
          dayOfWeek: day,
          startMinutes: 540, // 9:00 AM
          endMinutes: 1020, // 5:00 PM
          slotDuration: 30,
          isActive: true,
        },
      });
    }

    // Saturday (half day - 9 AM to 1 PM)
    await prisma.availability.create({
      data: {
        doctorId: pair.doctorId,
        clinicId: pair.clinicId,
        dayOfWeek: 6,
        startMinutes: 540, // 9:00 AM
        endMinutes: 780, // 1:00 PM
        slotDuration: 30,
        isActive: true,
      },
    });
  }

  console.log('📅 Created availability schedules');

  // ----------------------------
  // 8. CREATE APPOINTMENTS
  // Past, today, and future
  // ----------------------------
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  const nextWeek = new Date(now);
  nextWeek.setDate(now.getDate() + 7);
  nextWeek.setHours(14, 30, 0, 0);

  const lastWeek = new Date(now);
  lastWeek.setDate(now.getDate() - 7);
  lastWeek.setHours(11, 0, 0, 0);

  await prisma.appointment.createMany({
    data: [
      // Future appointment - John with Dr. Ahmed at Clinic 1
      {
        patientId: patient1.id,
        doctorId: drAhmed.id,
        clinicId: clinic1.id,
        date: tomorrow,
        durationMins: 30,
        status: 'SCHEDULED',
        notes: 'Routine checkup',
      },
      // Future appointment - Jane with Dr. Sara
      {
        patientId: patient2.id,
        doctorId: drSara.id,
        clinicId: clinic1.id,
        date: nextWeek,
        durationMins: 30,
        status: 'SCHEDULED',
        notes: 'Follow up visit',
      },
      // Past appointment - completed
      {
        patientId: patient1.id,
        doctorId: drAhmed.id,
        clinicId: clinic1.id,
        date: lastWeek,
        durationMins: 30,
        status: 'COMPLETED',
        notes: 'Fever consultation',
      },
      // Test patient appointment
      {
        patientId: patient3.id,
        doctorId: drAhmed.id,
        clinicId: clinic1.id,
        date: tomorrow,
        durationMins: 30,
        status: 'SCHEDULED',
        notes: 'Test booking',
      },
    ],
  });

  console.log('📋 Created appointments');

  // ----------------------------
  // 9. CREATE BLOCKED SLOTS
  // Example: Dr. Ahmed on vacation next Friday
  // ----------------------------
  const nextFriday = new Date(now);
  const daysUntilFriday = (5 - now.getDay() + 7) % 7 || 7;
  nextFriday.setDate(now.getDate() + daysUntilFriday);
  nextFriday.setHours(0, 0, 0, 0);

  const nextFridayEnd = new Date(nextFriday);
  nextFridayEnd.setHours(23, 59, 59, 999);

  await prisma.blockedSlot.create({
    data: {
      doctorId: drAhmed.id,
      clinicId: clinic1.id,
      start: nextFriday,
      end: nextFridayEnd,
      reason: 'Personal leave',
    },
  });

  console.log('🚫 Created blocked slots');

  // ----------------------------
  // 10. CREATE NOTIFICATIONS
  // ----------------------------
  await prisma.notification.createMany({
    data: [
      {
        userId: patient1.id,
        type: 'APPOINTMENT_REMINDER',
        message: 'You have an appointment tomorrow at 10:00 AM with Dr. Ahmed',
        isRead: false,
      },
      {
        userId: patient2.id,
        type: 'APPOINTMENT_CONFIRMED',
        message: 'Your appointment with Dr. Sara has been confirmed',
        isRead: true,
      },
    ],
  });

  console.log('🔔 Created notifications');

  // ----------------------------
  // 11. CREATE CALL LOGS
  // ----------------------------
  await prisma.callLog.createMany({
    data: [
      {
        phone: '+919999999001',
        transcript: 'Hi, I want to book an appointment for tomorrow',
        intent: 'BOOK_APPOINTMENT',
        clinicId: clinic1.id,
      },
      {
        phone: '+919999999002',
        transcript: 'I want to cancel my appointment',
        intent: 'CANCEL_APPOINTMENT',
        clinicId: clinic1.id,
      },
    ],
  });

  console.log('📞 Created call logs');

  // ----------------------------
  // SUMMARY
  // ----------------------------
  console.log('\n✅ Seed completed successfully!\n');
  console.log('📊 Summary:');
  console.log(`   Clinics:       ${await prisma.clinic.count()}`);
  console.log(`   Users:         ${await prisma.user.count()}`);
  console.log(`   Memberships:   ${await prisma.clinicMembership.count()}`);
  console.log(`   Availability:  ${await prisma.availability.count()}`);
  console.log(`   Appointments:  ${await prisma.appointment.count()}`);
  console.log(`   Blocked Slots: ${await prisma.blockedSlot.count()}`);
  console.log(`   Notifications: ${await prisma.notification.count()}`);
  console.log(`   Call Logs:     ${await prisma.callLog.count()}`);

  console.log('\n🔑 Test data:');
  console.log(`   Clinic 1 ID:  ${clinic1.id}`);
  console.log(`   Clinic 2 ID:  ${clinic2.id}`);
  console.log(`   Dr. Ahmed ID: ${drAhmed.id}`);
  console.log(`   Dr. Sara ID:  ${drSara.id}`);
  console.log(`   Dr. Ravi ID:  ${drRavi.id}`);
  console.log(`   Test phone:   9999999999`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
