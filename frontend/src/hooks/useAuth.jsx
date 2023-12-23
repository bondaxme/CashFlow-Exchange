import { useSelector } from "react-redux";

export function useAuth() {
  const { firstName, lastName, email, uid } = useSelector((state) => state.user);

  return {
    isAuth: !!uid,
    firstName,
    lastName,
    email,
    uid
  };
}
