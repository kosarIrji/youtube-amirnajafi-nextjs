import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

import {i18n} from '../i18n';
import {match as matchLocale} from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import {isAuthenticated} from './helper/authentication';

function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const locales: string[] = i18n.locales;
  let languages = new Negotiator({headers: negotiatorHeaders}).languages(
    locales
  );
  const locale = matchLocale(languages, locales, i18n.defaultLocale);
  return locale;
}

const bypassAuth = ['/api/auth/login', '/api/auth/register'];

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api')) {
    if (
      request.method !== 'GET' &&
      !bypassAuth.includes(request.nextUrl.pathname)
    ) {
      const authStatus = await isAuthenticated(request);
      if (!authStatus.status)
        return NextResponse.json(authStatus, {status: 401});
    }
  } else {
    const pathname = request.nextUrl.pathname;
    // Check if the pathname already contains a locale
    const hasLocale = i18n.locales.some(
      (locale) =>
        pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (!hasLocale) {
      const locale = getLocale(request) || i18n.defaultLocale;
      // Rewrite to avoid redirect loop
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}${pathname}`;
      return NextResponse.rewrite(url);
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|favicon.png|robots.txt|sitemap.xml).*)',
  ],
};
