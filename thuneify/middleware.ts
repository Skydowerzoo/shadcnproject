import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Récupérer le token depuis localStorage n'est pas possible dans middleware
  // Il faut utiliser un cookie sécurisé à la place
  const token = request.cookies.get('auth-token')?.value;
  const path = request.nextUrl.pathname;
  
  // Pages protégées qui nécessitent une authentification
  const protectedRoutes = ['/expenses', '/grocery', '/manga', '/account'];
  // Pages publiques accessibles uniquement quand NON authentifié
  const authRoutes = ['/login', '/register'];
  
  // Si route protégée mais pas de token → redirection login
  if (!token && protectedRoutes.some(route => path.startsWith(route))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Si déjà authentifié et on essaie d'accéder à login/register → redirection accueil
  if (token && authRoutes.some(route => path === route)) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

// Configurer sur quels chemins le middleware doit s'exécuter
export const config = {
  matcher: [
    // Appliquer à toutes les routes sauf _next, api, static, etc.
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};