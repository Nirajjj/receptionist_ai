import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 🔹 CORS middleware
// function handleCORS(req: NextRequest, res: NextResponse) {
//   res.headers.set('Access-Control-Allow-Origin', '*');
//   res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
//   res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

//   if (req.method === 'OPTIONS') {
//     return new NextResponse(null, { status: 200, headers: res.headers });
//   }
// }

// 🔹 Vapi Auth
function handleVapiAuth(req: NextRequest) {
  const token = req.headers.get('authorization');

  if (token !== `Bearer ${process.env.VAPI_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
}

// 🔹 Admin Auth
function handleAdminAuth(req: NextRequest) {
  const token = req.headers.get('authorization');

  if (!token) {
    return new NextResponse('Admin Unauthorized', { status: 401 });
  }
}

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const path = req.nextUrl.pathname;

  // ✅ Global CORS
  // const corsResponse = handleCORS(req, res);
  // if (corsResponse) return corsResponse;

  // ✅ Vapi API
  if (path.startsWith('/api/vapi')) {
    const authResponse = handleVapiAuth(req);
    if (authResponse) return authResponse;
  }

  // ✅ Admin API
  if (path.startsWith('/api/admin')) {
    const authResponse = handleAdminAuth(req);
    if (authResponse) return authResponse;
  }

  return res;
}

export const config = {
  matcher: ['/api/:path*'],
};
