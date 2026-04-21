import type { ApiResponse } from "../types/apiResponse";
import type { Item, ItemCard, ItemQuery, ItemRequest } from "../types/item";
import { api } from "./api";

export const itemApi = {
  getAll: (params: ItemQuery) =>
    api.get<ApiResponse<Item[]>>(`/items`, { params }).then((r) => r.data),

  getCard: () =>
    api.get<ApiResponse<ItemCard>>("/items/card").then((r) => r.data.data),

  create: async (data: ItemRequest) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("categoryId", String(data.categoryId));
    formData.append("quantity", String(data.quantity));
    if (data.image) formData.append("image", data.image);

    const r = await api.post<ApiResponse<Item>>("/items", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return r.data;
  },

  update: async (id: number, data: ItemRequest) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("categoryId", String(data.categoryId));
    formData.append("quantity", String(data.quantity));
    if (data.image) formData.append("image", data.image);

    const r = await api.put<ApiResponse<Item>>(`items/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return r.data;
  },

  delete: (id: number) =>
    api.delete<ApiResponse<null>>(`/items/${id}`).then((r) => r.data),
};
