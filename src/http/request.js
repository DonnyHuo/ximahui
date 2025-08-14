import { request } from "graphql-request";

export const fetchData = async (data) => {
  const endpoint =
    "https://api.studio.thegraph.com/query/84515/xmhstaking/version/latest";
  return request(endpoint, data, undefined, {
    Authorization: "Bearer 15e21550a1f515dd302fe54bf5635a40"
  });
};
