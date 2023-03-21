import Link from "next/link";

type Props = {
  allTags: string[];
};
function Tag(props: Props) {
  const allTags = props.allTags;

  return (
    <div className="mt-5">
      <ul className="flex justify-center gap-3">
        {allTags.map((tag: string, index: number) => (
          <li key={index} className="rounded-md bg-gray-100 py-1 px-3">
            <Link href={`/post/tag/${tag}/page/1`} className="font-bold">
              {tag}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Tag;
