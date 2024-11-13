'use server';

import {getUserID} from '@/helper/authentication';
import {cookies} from 'next/headers';
import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();

export async function AddPostServer(prevState: any, formData: FormData) {
  let errors = {};
  const title = formData.get('title') as string;
  if (title.length < 5) {
    errors = {...errors, title: 'title should be more than 5 characters'};
  }
  const content = formData.get('content') as string;
  const published = formData.get('published') as string;
  const token = cookies().get('token') as any;
  const userId = await getUserID(token.value);
  let post = {};
  if (Object.keys(errors).length === 0) {
    post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: userId as number,
        published: published === 'on' ? true : false,
      },
    });
  }
  return {
    data: post || {},
    errors: errors,
    message:
      Object.keys(errors).length > 0
        ? 'there is error with last requests'
        : 'new post successfully added',
  };
}
// const token = (cookies().get('token') as unknown as string) || '';
// const userId = await getUserID(token);
// const post = await prisma.post.create({
//   data: {
//     title,
//     content,
//     authorId: userId as number,
//     published,
//   },
// });
// // res.revalidate('/');
// return Response.json(post);
