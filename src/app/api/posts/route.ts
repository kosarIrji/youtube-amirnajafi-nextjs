import type {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from '@prisma/client';
import {getUserID} from '@/helper/authentication';
import {NextRequest} from 'next/server';
import {cookies} from 'next/headers';
const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const locale = searchParams.get('locale');
  console.log('GET request come to /posts', locale);
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

export async function POST(req: NextRequest) {
  const {title, content, published} = await req.json();
  const token = (cookies().get('token') as unknown as string) || '';
  const userId = await getUserID(token);
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

export async function DELETE(req: NextRequest) {
  let data = await prisma.post.delete({
    where: {
      id: (await req.json()).id,
    },
  });
  return Response.json(data);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  let data = await prisma.post.update({
    where: {
      id: body.id,
    },
    data: {
      title: body.title,
      content: body.content,
      published: body.published,
    },
  });
  return Response.json(data);
}
