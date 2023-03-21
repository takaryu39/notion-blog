import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import {
  getAllTags,
  getNumberOfPageByTag,
  getNumberOfPagesByTag,
  getPostsByTagAndPage,
} from "@/lib/notionAPI";
import SinglePost from "@/components/SinglePost";
import Pagination from "@/components/Pagination";

export const getStaticPaths = async () => {
  const allTags = await getAllTags();
  //   console.log(numberOfPageByTag);
  let params = [];

  await Promise.all(
    allTags.map((tag) => {
      return getNumberOfPagesByTag(tag).then((numberOfPageByTag: number) => {
        for (let index = 1; index < numberOfPageByTag; index++) {
          params.push({ params: { tag: tag, page: index.toString() } });
        }
      });
    })
  );
  return {
    paths: params,
    fallback: "blocking", // can also be true or 'blocking'
  };
};
export const getStaticProps = async (context) => {
  const currentPage = context.params?.page;
  const currentTag = context.params?.tag;

  const posts = await getPostsByTagAndPage(currentTag, currentPage);
  const numberOfPageByTag = await getNumberOfPageByTag(currentTag);
  //   console.log(numberOfPageByTag);

  return {
    props: {
      posts,
      numberOfPageByTag,
      currentTag,
    },
    revalidate: 60,
  };
};

export default function post(props) {
  //   console.log(props);

  return (
    <>
      <Head>
        <title>Notion-Blog</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container w-full mt-16 m-auto">
        <h2 className="text-lg text-center mb-16">Notion Blog</h2>
        <ul className="flex flex-wrap gap-7">
          {props.posts.map((post, index) => (
            <li key={index} className="bg-white flex-1 w-1/3  shadow-md">
              <SinglePost
                title={post.title}
                description={post.description}
                date={post.date}
                slug={post.slug}
                tags={post.tags}
              />
            </li>
          ))}
        </ul>
        <Pagination
          numberOfPage={props.numberOfPageByTag}
          tag={props.currentTag}
        />
      </main>
    </>
  );
}
