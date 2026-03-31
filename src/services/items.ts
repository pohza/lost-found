import { api } from "../lib/api";

export const getItems = (type?: string) => {
  const query = type ? `?type=${type}` : "";
  return api(`/items${query}`);
};

export const getItem = (id: number) =>
  api(`/items/${id}`);

export const createItem = (data: any) =>
  api("/items", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateItem = (id: number, data: any) =>
  api(`/items/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteItem = (id: number) =>
  api(`/items/${id}`, {
    method: "DELETE",
  });

export const closeItem = (id: number) =>
  api(`/items/${id}/close`, {
    method: "POST",
  });