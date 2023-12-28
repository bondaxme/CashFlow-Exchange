import { useSelector } from "react-redux";

export function useAuth() {
  const { firstName, lastName, email, currencyDiff, isAdmin, uid } = useSelector((state) => state.user);

  return {
    isAuth: !!uid,
    firstName,
    lastName,
    email,
    currencyDiff,
    isAdmin,
    uid
  };
}
