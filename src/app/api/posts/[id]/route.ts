import type {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from '@prisma/client';
import {getUserID} from '@/helper/authentication';
import {NextRequest} from 'next/server';
const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  {params}: {params: Promise<{id: string}>}
) {
  const searchParams = req.nextUrl.searchParams;
  const locale = searchParams.get('locale');
  const id = (await params).id;
  console.log('GET request come to /posts/id', locale, id);
  // const {id} = req.query;
  if (id) {
    const post = await prisma.post.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        author: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });
    if (!post) {
      return Response.json({error: 'Not found'});
    }
    if ((locale as String) === 'fa') {
      post.content = post.content_fa;
      post.title = post.title_fa;
    }
    return Response.json(post);
  }
}
