import Link from "next/link";

type Props = {
  title: String;
  description: String;
  date: String;
  slug: String;
  tags: String[];
};

function SinglePost(props: Props) {
  const { title, description, date, slug, tags } = props;
  return (
    <Link href={`post/${slug}`}>
      <div className="p-7">
        <div className=""></div>
        <div className="text-xs">{date}</div>
        <ul className="flex gap-2 mt-3">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 bg-slate-100 rounded-lg "
            >
              {tag}
            </span>
          ))}
        </ul>
        <h2 className="font-bold mt-4">{title}</h2>
      </div>
      <p>{description}</p>
    </Link>
  );
}

export default SinglePost;
