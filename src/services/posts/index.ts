import {api} from '../api';
const getPosts = async (locale: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}posts?locale=${locale}`,
    {
      next: {
        tags: ['posts'],
      },
    }
  );
  return await response.json();
};
const getPost = async (id: number, locale: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}posts/${id}?locale=${locale}`,
    {
      next: {
        tags: ['posts'],
      },
    }
  );
  return await response.json();
};
const addPost = (data: any) => api.post('/posts', data);
export {getPosts, getPost, addPost};
