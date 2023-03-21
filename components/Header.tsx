import Link from "next/link";

function Header() {
  return (
    <header>
      <div className="container w-full m-auto">
        <nav className="flex justify-between items-center py-5 ">
          <div>
            <Link href="/" className="">
              Logo
            </Link>
          </div>
          <ul className="flex items-start">
            <li>
              <Link
                href="/test"
                className="font-bold text-sm transition-all px-3 hover:opacity-70 "
              >
                test
              </Link>
            </li>
            <li>
              <Link
                href="/test2"
                className="font-bold text-sm transition-all px-3 hover:opacity-70 "
              >
                test
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
