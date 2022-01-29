import Link from 'next/link';
import { urlFor } from '../lib/sanity';
import { Post } from '../typings';

interface Props {
  data: [Post];
}

const Feed = ({ data }: Props) => {
  return (
    <div className="posts">
      {data.map((post) => (
        <Link key={post._id} href={`/post/${post.slug.current}`}>
          <div className="posts-wrapper group">
            <img
              className="post-mainImage"
              src={urlFor(post.mainImage).url()!}
              alt={`mainImage-${post.slug.current}`}
            />
            <div className="post-content">
              <section>
                <p className="post-content-title">{post.title}</p>
                <p className="post-content-description">
                  {post.description} by {post.author.name}
                </p>
              </section>

              <img
                className="post-content-avatar"
                src={urlFor(post.author.image).url()!}
                alt={`postContent-${post.author.name}`}
              />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Feed;
