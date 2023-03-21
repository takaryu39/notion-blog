export const getPageLink = (tag: string, page: number) => {
  return tag ? `/post/tag/${tag}/page/${page}` : `/post/page/${page}`;
};
