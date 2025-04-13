const API_BASE_URL = "http://127.0.0.1:8000/api/auctions/";

export const getAllAuctions = async () => {
  const res = await fetch(API_BASE_URL);
  if (!res.ok) throw new Error("Error al obtener subastas");
  return res.json();
};

export const getAuctionById = async (id) => {
  const res = await fetch(`${API_BASE_URL}${id}/`);
  if (!res.ok) throw new Error("Subasta no encontrada");
  return res.json();
};

export const createAuction = async (data) => {
  const res = await fetch(API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear la subasta");
  return res.json();
};

export const updateAuction = async (id, data) => {
  const res = await fetch(`${API_BASE_URL}${id}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar la subasta");
  return res.json();
};

export const deleteAuction = async (id) => {
  const res = await fetch(`${API_BASE_URL}${id}/`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar la subasta");
};

export const getAllCategories = async () => {
  const res = await fetch(`${API_BASE_URL}categories/`);
  if (!res.ok) throw new Error("Error al obtener categorías");
  return res.json();
};

export const createBid = async (auctionId, bidData, token) => {
  const res = await fetch(`${API_BASE_URL}${auctionId}/bid/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bidData),
  });
  if (!res.ok) throw new Error("Error al crear la puja");
  return res.json();
};