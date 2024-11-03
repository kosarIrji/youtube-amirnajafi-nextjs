import type {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from '@prisma/client';
import {NextResponse} from 'next/server';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

interface IRegisterBody {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data: IRegisterBody = req.body;
    if (!data.email || !data.password || !data.name) {
      return new Response('please fill all the fields', {status: 400});
    }
    const user = await prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });
    if (user) return new Response('user already exists', {status: 400});
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        phone: data.phone || '',
      },
    });
    return new Response('user created successfully', {status: 201});
  } catch (error) {
    return new Response('Internal server error', {status: 500});
  }
}
