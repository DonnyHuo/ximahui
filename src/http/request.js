import { request } from "graphql-request";

export const fetchData = async (data) => {
  const endpoint =
    "https://api.studio.thegraph.com/query/84515/xmhstaking/version/latest";
  return request(endpoint, data, undefined, {
    Authorization: "Bearer e83a48c59752df0e195cec37aec2f506"
  });
};
