"use server"

import { client, dislikeItemsDislikePut, Item, likeItemsLikePut, loginTokenPost } from "@client"

client.setConfig({"baseUrl": process.env.API_BASE_URL})

const token = await loginTokenPost({
  "body": {
    "username": process.env.API_USERNAME!,
    "password": process.env.API_PASSWORD!,
  },
});

if (!token.data) {
  throw token.error;
}

client.interceptors.request.use((request, options) => {
  request.headers.set("Authorization", `Bearer ${token.data.access_token}`);
  return request;
});

export async function doLikeItemsLikePut(item: Item) {
  await likeItemsLikePut({
    "query": {
      "item_id": item.id,
    },
  });
}

export async function doDislikeItemsDislikePut(item: Item) {
  await dislikeItemsDislikePut({
    "query": {
      "item_id": item.id,
    },
  });
}
