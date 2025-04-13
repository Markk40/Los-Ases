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
  const token = localStorage.getItem("accessToken");

  const res = await fetch(`${API_BASE_URL}${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Error al actualizar la subasta");
  return res.json();
};


export const deleteAuction = async (id) => {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(`${API_BASE_URL}${id}/`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Error al eliminar la subasta");
};

export const getAllCategories = async () => {
  const res = await fetch(`${API_BASE_URL}categories/`);
  if (!res.ok) throw new Error("Error al obtener categorías");
  return res.json();
};

export const createBid = async (auctionId, bidData, token) => {
  // Incluir el campo 'auction' en el bidData
  const bidPayload = {
    ...bidData,      // Precio y el postor
    auction: auctionId  // Añadimos el id de la subasta
  };

  const res = await fetch(`${API_BASE_URL}${auctionId}/bid/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bidPayload), // Enviamos el bid con el auction
  });

  if (!res.ok) {
    let errorMessage = "Error al crear la puja";
    try {
      const errorData = await res.json();
      console.error("Detalles del error:", errorData);
      errorMessage = errorData.detail || JSON.stringify(errorData);
    } catch (e) {
      console.error("No se pudo parsear el error:", e);
    }
    throw new Error(errorMessage);
  }

  return res.json();
};

export const deleteBid = async (auctionId, bidId) => {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(
    `http://localhost:8000/api/auctions/${auctionId}/bid/${bidId}/`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) throw new Error("Error al eliminar la puja");
};

export const getBidsByAuction = async (auctionId) => {
  const res = await fetch(`${API_BASE_URL}${auctionId}/bid/`);
  if (!res.ok) throw new Error("Error al obtener las pujas de la subasta");
  return res.json();
};

