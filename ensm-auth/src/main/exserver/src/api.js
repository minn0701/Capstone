// api.js
export const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status === 401 || response.status === 403) {
    alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
    localStorage.removeItem("token");
    window.location.href = "/";
    return;
  }

  return response;
};