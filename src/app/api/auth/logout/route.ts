import {NextRequest} from 'next/server';

export async function GET(req: NextRequest) {
  try {
    return new Response('user logged out successfully', {
      status: 200,
      headers: {
        'Set-Cookie': `token=; HttpOnly; Path=/; Max-Age=0`,
      },
    });
  } catch (error) {
    return new Response('Internal server error', {status: 500});
  }
}
