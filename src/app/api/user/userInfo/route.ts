import {PrismaClient} from '@prisma/client';
import type {NextApiRequest, NextApiResponse} from 'next';
import jwt from 'jsonwebtoken';
import {decodeToken} from '@/helper/authentication';
import {cookies} from 'next/headers';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // get token from cookie
    let token = cookies().get('token');
    if (!token && !token.value)
      return new Response('Authorization required', {status: 401});
    token = token.value;

    const decodedToken = await decodeToken(token);
    if (!decodedToken)
      return new Response('Authorization required', {status: 401});

    const user = await prisma.user.findFirst({
      where: {
        id: decodedToken.id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
      },
    });
    return Response.json({data: user});
  } catch (error) {
    console.log(error);
    return new Response('Internal server error', {status: 500});
  }
}
