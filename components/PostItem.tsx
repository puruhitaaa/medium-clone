import { useRouter } from 'next/router';
import React from 'react';
import PortableText from 'react-portable-text';
import { urlFor } from '../lib/sanity';
import { Post } from '../typings';

interface Props {
  post: Post;
}

const PostItem = ({ post }: Props) => {
  const router = useRouter();

  return (
    <article className="post-item">
      <h1 className="post-item-title">{post.title}</h1>
      <h2 className="post-item-description">{post.description}</h2>

      <div className="post-item-info">
        <img
          className="post-item-avatar"
          src={urlFor(post.author.image).url()!}
          alt={`author-${post.author.name}`}
        />
        <p className="font-extralight text-sm">
          Blog post by{' '}
          <span
            className="text-green-600 font-semibold cursor-pointer"
            onClick={() => router.push(`/user/${post.author.slug.current}`)}
          >
            {post.author.name}
          </span>{' '}
          - Published at {new Date(post._createdAt).toLocaleString()}
        </p>
      </div>

      <div className="mt-10">
        <PortableText
          className=""
          content={post.body}
          serializers={{
            h1: (props: any) => (
              <h1 className="text-2xl font-bold my-5" {...props} />
            ),
            h2: (props: any) => (
              <h2 className="text-xl font-bold my-5" {...props} />
            ),
            li: ({ children }: any) => (
              <li className="ml-4 list-disc">{children}</li>
            ),
            link: ({ href, children }: any) => (
              <a href={href} className="text-blue-500 hover:underline">
                {children}
              </a>
            ),
          }}
          dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
          projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
        />
      </div>
    </article>
  );
};

export default PostItem;
