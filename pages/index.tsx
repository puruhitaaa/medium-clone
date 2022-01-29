import Head from 'next/head';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Feed from '../components/Feed';
import { sanityClient } from '../lib/sanity.js';
import { Post } from '../typings';

interface Props {
  posts: [Post];
}

export default function Home({ posts }: Props) {
  return (
    <main className="home-main">
      <Head>
        <title>Medium Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      <Hero />

      <Feed data={posts} />
    </main>
  );
}

export const getServerSideProps = async () => {
  const query = `*[_type == 'post']{
    _id,
    title,
    slug,
    author -> {
    name,
    image
  },
    description,
    mainImage,
    slug
  }`;

  const posts = await sanityClient.fetch(query);

  return {
    props: {
      posts,
    },
  };
};
