import { FlagIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

export function NotFound({ baseRoute }: { baseRoute: string }) {
  return (
    <div className="h-screen mx-auto grid place-items-center text-center px-8">
      <div>
        <FlagIcon className="w-20 h-20 mx-auto" />
        <div className="mt-10 text-3xl font-bold leading-snug text-blue-gray-900 md:text-4xl">
          Error 404 <br /> It looks like something went wrong.
        </div>

        <p className="mt-8 mb-14 text-[18px] font-normal text-gray-500 mx-auto md:max-w-sm">
          Don&apos;t worry, our team is already on it. Please try refreshing
          the page or come back later.
        </p>
        <Link to={baseRoute}><button className="w-full bg-black py-2 px-4 md:w-[8rem] text-white rounded">
          Back Home
        </button></Link>
      </div>
    </div>
  );
}

export default NotFound


