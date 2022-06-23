const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:8000"
    : "https://jobtweets.xyz";

export const api = {
  jobs:`${baseURL}/twitter/api/v1/get_jobs`
};
