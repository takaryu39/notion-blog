import { NUMBER_POSTS_PER_PAGE } from "@/constants/constants";
import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});
const n2m = new NotionToMarkdown({ notionClient: notion });

/* すべての記事データを取得して、入力した情報(result)を取得 */
export const getAllPosts = async () => {
  const posts = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    page_size: 100,
  });
  const allPosts = posts.results;

  return allPosts.map((post) => {
    // return post;
    return getPageMetaData(post);
  });
};
/* シングルページの情報取得、マークダウン要素も取得 */
export const getSinglePost = async (slug) => {
  const singlePost = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    filter: {
      property: "Slug",
      formula: {
        string: {
          equals: slug,
        },
      },
    },
  });
  const page = singlePost.results[0];
  const metaData = getPageMetaData(page);

  const mdblocks = await n2m.pageToMarkdown(page.id);
  const mdString = n2m.toMarkdownString(mdblocks);

  return {
    metaData,
    markDown: mdString,
  };
};
/* 
取得した情報を整理して返却
*/
const getPageMetaData = (post) => {
  const getTags = (tags) => {
    const allTags = tags.map((tag) => {
      return tag.name;
    });
    return allTags;
  };

  return {
    title: post.properties.Name.title[0].plain_text,
    description: post.properties.Description.rich_text[0].plain_text,
    date: post.properties.Date.date.start,
    slug: post.properties.Slug.rich_text[0].plain_text,
    tags: getTags(post.properties.Tags.multi_select),
  };
};

/* 
ページ番号に応じた記事取得
*/
export const getPostByPage = async (page: number) => {
  const allPosts = await getAllPosts();

  const startIndex = (page - 1) * NUMBER_POSTS_PER_PAGE;
  const endIndex = startIndex + NUMBER_POSTS_PER_PAGE;

  return allPosts.slice(startIndex, endIndex);
};

/* 
ページ数を動的に取得
*/
export const getNumberOfPage = async () => {
  const allPosts = await getAllPosts();

  const numberOfPage =
    Math.floor(allPosts.length / NUMBER_POSTS_PER_PAGE) +
    (allPosts.length % NUMBER_POSTS_PER_PAGE > 0 ? 1 : 0);

  return numberOfPage;
};

/* 
タグページ一覧を取得
*/
export const getPostsByTagAndPage = async (tagName: string, page: number) => {
  const allPosts = await getAllPosts();

  const posts = allPosts.filter((post) =>
    post.tags.find((tag: string) => tag === tagName)
  );

  const startIndex = (page - 1) * NUMBER_POSTS_PER_PAGE;
  const endIndex = startIndex + NUMBER_POSTS_PER_PAGE;

  return posts.slice(startIndex, endIndex);
};

/* 
タグページの動的なパスを取得
*/
export const getNumberOfPagesByTag = async (tagName: string) => {
  const allPosts = await getAllPosts();
  const posts = allPosts.filter((post) =>
    post.tags.find((tag: string) => tag === tagName)
  );

  const numberOfPage =
    Math.floor(posts.length / NUMBER_POSTS_PER_PAGE) +
    (posts.length % NUMBER_POSTS_PER_PAGE > 0 ? 1 : 0);

  return numberOfPage;
};

/* 
すべてのタグを取得
 */
export const getAllTags = async () => {
  const allPosts = await getAllPosts();
  const allTagsDuplicationList = allPosts.flatMap((post) => post.tags);
  const set = new Set(allTagsDuplicationList);
  const allTagList = Array.from(set);
  return allTagList;
};
/* 
タグページのページ数を取得
*/
export const getNumberOfPageByTag = async (tagName: string) => {
  const allPosts = await getAllPosts();
  const posts = allPosts.filter((post) =>
    post.tags.find((tag: string) => tag === tagName)
  );

  const numberOfPageByTag =
    Math.floor(posts.length / NUMBER_POSTS_PER_PAGE) +
    (posts.length % NUMBER_POSTS_PER_PAGE > 0 ? 1 : 0);

  return numberOfPageByTag;
};
