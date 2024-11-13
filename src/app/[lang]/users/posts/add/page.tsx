'use client';

import {AddPostServer} from '@/app/actions/addPostServerAction';
import {addPost} from '@/services/posts';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {useFormState, useFormStatus} from 'react-dom';
import {toast} from 'react-toastify';

interface IParams {
  params: {
    lang: string;
  };
}

const initialResponse = {
  data: {},
  errors: {},
  message: '',
};

const AddPosts = (params: IParams) => {
  const [state, formAction] = useFormState(AddPostServer, initialResponse);
  console.log('server response', state);
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    content: '',
    published: false,
  });

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {name, value} = e.target;
    setForm({...form, [name]: value});
  };

  const handleSubmit = () => {
    addPost(form)
      .then((res) => {
        toast.success('new post successfully added');
      })
      .catch((e) => {
        toast.error(e.response.data.message);
      });
  };

  return (
    <>
      <div className="flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg space-y-10">
          <div>
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Add Your first Post
            </h2>
          </div>
          <form className="space-y-6" action={formAction} method="POST">
            <div className="relative -space-y-px rounded-md shadow-sm">
              <div className="pointer-events-none  absolute inset-0 z-10 rounded-md ring-1 ring-inset ring-gray-300" />
              <div>
                <label htmlFor="title" className="sr-only">
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="title"
                  required
                  className="relative block w-full rounded-t-md border-0 py-4 px-3 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Your post Title"
                  onChange={handleFormChange}
                />
                {state.errors.title && (
                  <div className="text-red-500 text-sm">
                    {state.errors.title}
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="content" className="sr-only">
                  Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  required
                  className="relative min-h-[150px] block w-full rounded-t-md border-0 py-3 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Your Post Content"
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <div className="flex items-center py-2 px-3">
                  <input
                    id="published"
                    name="published"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    onChange={(e) => {
                      setForm({...form, published: e.target.checked});
                    }}
                  />
                  <label
                    htmlFor="published"
                    className="ml-3 block text-sm leading-6 text-gray-900"
                  >
                    Publish?
                  </label>
                </div>
              </div>
            </div>

            <div>
              <SubmitButton />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
const SubmitButton = () => {
  const {pending} = useFormStatus();
  return (
    <button
      type="submit"
      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      {pending ? 'loading ... ' : 'Add Post'}
    </button>
  );
};
export default AddPosts;
