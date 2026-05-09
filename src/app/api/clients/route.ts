// app/api/clients/route.ts
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { GetClientsParamsSchema } from '@/lib/validators/schemas/patient.schema';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // Validate query params with Zod
  const parsed = GetClientsParamsSchema.safeParse({
    page: searchParams.get('page'),
    limit: searchParams.get('limit'),
    search: searchParams.get('search'),
  });

  if (!parsed.success) {
    return Response.json(
      {
        message: 'Invalid query parameters',
        errors: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const { page, limit, search } = parsed.data;
  const skip = (page - 1) * limit;

  try {
    const where = {
      role: 'PATIENT' as const,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { phone: { contains: search } },
        ],
      }),
    };

    const [patients, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          createdAt: true,
          patientAppointments: {
            orderBy: { date: 'desc' },
            select: {
              id: true,
              date: true,
              status: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    const now = new Date();
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const data = patients.map((p) => {
      const lastVisit = p.patientAppointments.find((a) => a.date < now && a.status === 'COMPLETED');

      const nextAppointment = p.patientAppointments
        .filter((a) => a.date >= now && a.status === 'SCHEDULED')
        .sort((a, b) => a.date.getTime() - b.date.getTime())[0];

      const recentVisit = p.patientAppointments.some(
        (a) => a.date >= sixtyDaysAgo && a.status === 'COMPLETED',
      );

      const status: 'Active' | 'Inactive' = nextAppointment || recentVisit ? 'Active' : 'Inactive';

      return {
        id: p.id,
        name: p.name ?? 'Unknown',
        phone: p.phone,
        email: p.email,
        lastVisit: lastVisit?.date.toISOString() ?? null,
        nextAppointment: nextAppointment?.date.toISOString() ?? null,
        status,
      };
    });

    return Response.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return Response.json({ message: 'Failed to fetch clients' }, { status: 500 });
  }
}
