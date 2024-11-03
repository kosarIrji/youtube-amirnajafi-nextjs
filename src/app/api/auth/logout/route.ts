import type {NextApiRequest, NextApiResponse} from 'next';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    // clear the cookie "token"
    res.setHeader('Set-Cookie', `token=; HttpOnly; Path=/; Max-Age=0`);
    return new Response('user logged out successfully', {status: 200});
  } catch (error) {
    return new Response('Internal server error', {status: 500});
  }
}
