import { getNumberOfPage } from "@/lib/notionAPI";
import { getPageLink } from "@/lib/post-helper";
import Link from "next/link";

interface Props {
  numberOfPage: number;
  tag: string;
}

function Pagination(props: Props) {
  let pages = [];
  for (let i = 1; i <= props.numberOfPage; i++) {
    pages.push(i);
  }
  return (
    <div>
      <ul className="flex justify-center gap-3 mt-6">
        {pages.map((paginationCount) => (
          <li key={paginationCount}>
            <Link
              href={getPageLink(props.tag, paginationCount)}
              className="rounded-md flex justify-center items-center text-sm bg-gray-300 font-bold p-3"
            >
              {paginationCount}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Pagination;
