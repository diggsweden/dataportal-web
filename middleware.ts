import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/((?!_next|__ENV|api|fonts|images|static|favicon.ico).*)', '/'],
};

/**
 * Handles authentication for all routes if credentials are set in ENV
 *
 * @param {NextRequest} req
 * @returns {NextResponse}
 */
export function middleware(req: NextRequest) {
  const rootUser = process.env.BASIC_ROOT_USER;
  const rootPwd = process.env.BASIC_ROOT_PWD;
  const aiUser = process.env.BASIC_AI_USER;
  const aiPwd = process.env.BASIC_AI_PWD;

  if (!rootUser && !rootPwd) return NextResponse.next();

  const basicAuth = req.headers.get('authorization');
  const url = req.nextUrl;

  if (basicAuth) {
    const aiScopePath = '/ai/fortroendemodellen';
    const aiScope = url.pathname.startsWith(aiScopePath);
    const authValue = basicAuth.split(' ')[1];
    const [user, pwd] = atob(authValue).split(':');
    const hasRootAccess = user === rootUser && pwd === rootPwd;
    const hasAIAccess = user === aiUser && pwd === aiPwd;

    // ? prevent annoying auth prompts when hovering over links if user has scoped access
    if (hasAIAccess && !aiScope) {
      url.pathname = aiScopePath;
      url.search = '';
      return NextResponse.redirect(url);
    }

    // ? only for user with restricted ai-scope
    if (aiScope) {
      if (hasRootAccess || hasAIAccess) {
        return NextResponse.next();
      }
    }

    // ? user can access all pages
    else if (hasRootAccess) {
      return NextResponse.next();
    }
  }
  url.pathname = '/api/auth';
  return NextResponse.rewrite(url);
}
