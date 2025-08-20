export const isAuth = () => {
  const token = localStorage.getItem("userToken");
  return Boolean(token);
};

export function getUserRole() {
  try {
    const userDetailsString = localStorage.getItem("userDetails");
    if (!userDetailsString) return null;

    const userDetails = JSON.parse(userDetailsString);
    return userDetails?.role || null;
  } catch (error) {
    console.error("Failed to parse userDetails from localStorage", error);
    return null;
  }
}
