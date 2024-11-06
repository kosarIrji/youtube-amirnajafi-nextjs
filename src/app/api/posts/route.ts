import type {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from '@prisma/client';
import {getUserID} from '@/helper/authentication';
import {NextRequest} from 'next/server';
const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const locale = searchParams.get('locale');
  searchParams;
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
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
    if ((locale as String) === 'fa') {
      posts.forEach((post) => {
        post.content = post.content_fa;
        post.title = post.title_fa;
      });
    }
    return Response.json(posts);
  } catch (e) {
    console.log(e);
  }
  return Response.json({});
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const {title, content, published} = req.body;
  const userId = await getUserID(req.cookies.token);
  const post = await prisma.post.create({
    data: {
      title,
      content,
      authorId: userId as number,
      published,
    },
  });
  // res.revalidate('/');
  return Response.json(post);
}

export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  let data = await prisma.post.delete({
    where: {
      id: req.body.id,
    },
  });
  return Response.json(data);
}

export async function PUT(req: NextApiRequest, res: NextApiResponse) {
  let data = await prisma.post.update({
    where: {
      id: req.body.id,
    },
    data: {
      title: req.body.title,
      content: req.body.content,
      published: req.body.published,
    },
  });
  return Response.json(data);
}
