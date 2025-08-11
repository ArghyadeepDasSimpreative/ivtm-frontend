export const isAuth = () => {
  const token = localStorage.getItem("userToken");
  return Boolean(token);
};
