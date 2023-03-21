import { getAllPosts, getSinglePost } from "@/lib/notionAPI";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vsDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

export const getStaticPaths = async () => {
  const allPosts = await getAllPosts();

  const paths = allPosts.map(({ slug }) => ({ params: { slug } }));
  //☆全ての投稿を取得。map関数でスラッグをすべて取得。{ params: slug }の形で返す。
  //{ params: { slug } }は{ params: {slug:slug } }の省略系

  return {
    paths,
    fallback: false, // can also be true or 'blocking'
  };
};

export const getStaticProps = async ({ params }) => {
  const singlePost = await getSinglePost(params.slug);
  return {
    props: {
      singlePost,
    },
    revalidate: 60,
  };
};

function Post({ singlePost }) {
  const { title, description, date, slug, tags } = singlePost.metaData;

  return (
    <div className="container w-full m-auto">
      <h2 className="font-bold text-lg">{title}</h2>
      <div className="">{date}</div>
      <ul className="flex gap-3">
        {tags.map((tag, index) => (
          <li
            key={index}
            className="text-xs bg-slate-300 rounded-md py-1 px-3 "
          >
            {tag}
          </li>
        ))}
      </ul>
      <div className="mt-10">
        <ReactMarkdown
          className="blog-content"
          children={singlePost.markDown}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  children={String(children).replace(/\n$/, "")}
                  style={vsDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                />
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        ></ReactMarkdown>
      </div>
    </div>
  );
}

export default Post;
