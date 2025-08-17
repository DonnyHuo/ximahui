import { request } from "graphql-request";

export const fetchData = async (data) => {
  const endpoint =
    "https://gateway.thegraph.com/api/subgraphs/id/ACEihynMMPkfPH9NG14o9vpmvNjK3kTC7Ce7ozEGmTA1";
  return request(endpoint, data, undefined, {
    Authorization: "Bearer 15e21550a1f515dd302fe54bf5635a40"
  });
};
