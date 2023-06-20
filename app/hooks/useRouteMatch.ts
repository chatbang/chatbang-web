import { useLocation } from "react-router-dom";
import { useResolvedPath } from "react-router-dom";

/**
 * 判断路由是否匹配，传入的link可以是相对路径，也可以是绝对路径
 * @returns boolean
 */
export default function useRouteMatch(link: string | undefined) {
  let location = useLocation();
  let path = useResolvedPath(link || "");

  let locationPathname = location.pathname;
  let toPathname = path.pathname;
  locationPathname = locationPathname.toLowerCase();
  toPathname = toPathname.toLowerCase();

  return (
    locationPathname === toPathname ||
    (locationPathname.startsWith(toPathname) &&
      locationPathname.charAt(toPathname.length) === "/")
  );
}
