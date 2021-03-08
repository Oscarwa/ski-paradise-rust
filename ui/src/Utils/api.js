const baseUrl = "http://localhost:8080/api";

const apiCall = async (url, options) => {
  const result = await fetch(`${baseUrl}${url}`, options);
  const data = await result.json();
  return data;
};

export { apiCall };
