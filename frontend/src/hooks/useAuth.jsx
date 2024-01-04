import { useSelector } from "react-redux";

export function useAuth() {
  const { username, email, currencyDiff, isAdmin, uid } =
    useSelector((state) => state.user);

  return {
    isAuth: !!uid,
    username,
    email,
    currencyDiff,
    isAdmin,
    uid,
  };
}
