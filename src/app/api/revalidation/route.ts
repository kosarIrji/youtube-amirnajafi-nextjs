import {revalidatePath, revalidateTag} from 'next/cache';
import {headers} from 'next/headers';
import {NextRequest} from 'next/server';

export async function GET(req: NextRequest) {
  // if (headers().get('secret') !== process.env.MY_SECRET_TOKEN) {
  //   return new Response('Invalid token', {
  //     status: 401,
  //   });
  // }
  try {
    const searchParams = req.nextUrl.searchParams;
    const path = searchParams.get('path') as string;
    const tag = searchParams.get('tag') as string;
    // res.revalidate(path);
    if (path) {
      revalidatePath(path);
      console.log('revalidate path', path);
    }
    if (tag) {
      revalidateTag(tag);
      console.log('revalidate tag ', tag);
    }
    return Response.json({revalidated: true});
  } catch (err) {
    return new Response('Error revalidating', {status: 500});
  }
}
