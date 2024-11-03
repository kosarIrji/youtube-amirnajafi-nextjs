// pages/api/auth/login
import type {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {NextResponse} from 'next/server';
import {encodeToken} from '@/helper/authentication';
import {cookies} from 'next/headers';

const prisma = new PrismaClient();

interface ILoginBody {
  email: string;
  password: string;
}
export async function POST(req: Request) {
  try {
    const data: ILoginBody = await req.json();
    console.log(data);
    if (!data.email || !data.password)
      // return res.status(400).json({message: 'please fill all the fields'});
      return new Response('please fill all the fields', {status: 400});

    const user = await prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });
    if (!user) return new Response('user not found', {status: 404});
    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) return new Response('password not valid', {status: 400});

    const token = await encodeToken(user.id);
    // res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/`);
    cookies().set('token', token);
    return new Response('user logged in successfully', {
      status: 200,
      headers: {
        'Set-Cookie': `token=${token}; HttpOnly; Path=/`,
      },
    });
  } catch (error) {
    console.log(error);
    return new Response('Internal server error', {status: 500});
  }
}
