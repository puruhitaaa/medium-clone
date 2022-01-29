import { GetStaticProps } from 'next';
import Header from '../../components/Header';
import { sanityClient, urlFor } from '../../lib/sanity';
import { Post } from '../../typings';
import { useRouter } from 'next/router';
import { useForm, SubmitHandler } from 'react-hook-form';
import Head from 'next/head';
import { useState } from 'react';
import PostItem from '../../components/PostItem';

interface IFormInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

interface Props {
  post: Post;
}

const Post = ({ post }: Props) => {
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(() => {
        setSubmitted(true);
      })
      .catch((err) => {
        console.log(err);
        setSubmitted(false);
      });
  };

  return (
    <main>
      <Head>
        <title>{`Post by ${post.author.name} - ${post.description}`}</title>
      </Head>

      <Header />

      <img
        className="w-full h-40 object-cover"
        src={urlFor(post.mainImage).url()!}
        alt="mainImage"
      />

      <PostItem post={post} />

      <hr className="max-w-lg my-5 mx-auto border border-yellow-500" />

      {submitted ? (
        <div className="flex flex-col p-10 my-10 bg-yellow-500 text-white max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold">
            Thank you for submitting your comment!
          </h1>
          <p>Once it has been approved, it will appear below!</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col p-5 max-w-2xl mx-auto mb-10"
        >
          <h3 className="text-sm text-yellow-500">Enjoyed this article?</h3>
          <h4 className="text-3xl font-bold">Leave a comment below!</h4>
          <hr className="py-3 mt-2" />

          <input
            {...register('_id')}
            type="hidden"
            name="_id"
            value={post._id}
          />

          <label className="block mb-5">
            <span className="text-gray-700">Name</span>
            <input
              {...register('name', { required: true })}
              className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring"
              placeholder="John Appleseed"
              type="text"
            />
          </label>
          <label className="block mb-5">
            <span className="text-gray-700">Email</span>
            <input
              {...register('email', { required: true })}
              className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring"
              placeholder="John Appleseed"
              type="text"
            />
          </label>
          <label className="block mb-5">
            <span className="text-gray-700">Comment</span>
            <textarea
              {...register('comment', { required: true })}
              className="shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 outline-none focus:ring min-h-[50px]"
              placeholder="John Appleseed"
              rows={8}
            />
          </label>

          <div className="flex flex-col p-5">
            {errors.name && (
              <span className="text-red-500">
                - The <span className="font-bold">Name</span> field is required
              </span>
            )}
            {errors.email && (
              <span className="text-red-500">
                - The <span className="font-bold">Email</span> field is required
              </span>
            )}
            {errors.comment && (
              <span className="text-red-500">
                - The <span className="font-bold">Comment</span> field is
                required
              </span>
            )}
          </div>

          <input
            type="submit"
            className="shadow bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer"
          />
        </form>
      )}

      {/* Comments */}
      <div className="flex flex-col p-10 my-10 max-w-2xl mx-auto shadow shadow-yellow-500 space-y-2">
        <h3 className="text-4xl">Comments</h3>
        <hr className="pb-2" />

        {post.comments.map((comment) => (
          <div key={comment._id}>
            <p>
              <span className="text-yellow-500">{comment.name}: </span>
              {comment.comment}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Post;

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{
    _id,
    slug {
      current
    }
  }`;

  const posts = await sanityClient.fetch(query);

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
    _id,
    _createdAt,
    title,
    author -> {
    name,
    slug,
    image
  },
  'comments': *[
    _type == 'comment' &&
    post._ref == ^._id &&
    approved == true
  ],
  description,
  mainImage,
  slug,
  body
  }`;

  const post = await sanityClient.fetch(query, { slug: params?.slug });

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
    revalidate: 60, // after 60 seconds, updates the old app cache.
  };
};
