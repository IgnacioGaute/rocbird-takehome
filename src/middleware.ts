import { NextRequest, NextResponse } from 'next/server';
import { auth } from './auth';
import {
  DEFAULT_LOGIN_REDIRECT,
  authRoutes,
  publicRoutes,
} from './routes';

export default async function middleware(req: NextRequest) {
  const session = await auth();
  const { nextUrl } = req;
  const isLoggedIn = !!session;

  const isPublicRoute = publicRoutes.includes(nextUrl.pathname as never);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname as never);

  // Ignorar APIs
  if (nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Manejo de la raíz "/"
  if (nextUrl.pathname === '/') {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/talents', nextUrl));
    }
    return NextResponse.redirect(new URL('/auth/login', nextUrl));
  }

  // Si ya está logueado y entra a rutas de login/register → redirigir a talentos
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  // Si NO está logueado y la ruta no es pública → redirigir a login
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL('/auth/login', nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next|api).*)', // Excluir /api, _next y assets estáticos
    '/',
  ],
};

