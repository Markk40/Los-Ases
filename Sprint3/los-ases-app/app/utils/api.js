const API_BASE_URL = "https://los-ases-backend.onrender.com/api/auctions/";

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
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("No estás logueado");

  const payload = JSON.parse(atob(token.split(".")[1]));
  const userId = payload.user_id || payload.id;

  const formData = new FormData();
  formData.append("auctioneer", userId);
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("closing_date", data.closing_date);
  formData.append("thumbnail", data.thumbnail);
  formData.append("price", data.price);
  formData.append("stock", data.stock);
  formData.append("rating", data.rating);
  formData.append("category", data.category);
  formData.append("brand", data.brand);

  const res = await fetch(API_BASE_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    // Construimos un mensaje con cada campo
    if (err && typeof err === "object") {
      const msg = Object.entries(err)
        .map(([k, v]) =>
          `${k}: ${Array.isArray(v) ? v.join(" ") : v}`
        )
        .join("; ");
      throw new Error(msg);
    }
    throw new Error("Error al crear la subasta");
  }
  return res.json();
};


export const updateAuction = async (id, data) => {
  const token = localStorage.getItem("accessToken");

  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("closing_date", data.closing_date);
  formData.append("price", data.price);
  formData.append("stock", data.stock);
  formData.append("rating", data.rating);
  formData.append("category", data.category);
  formData.append("brand", data.brand);

  if (data.thumbnail && data.thumbnail instanceof File) {
    formData.append("thumbnail", data.thumbnail);
  } else {
    console.error("No se ha seleccionado una imagen válida.");
  }

  const res = await fetch(`${API_BASE_URL}${id}/`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorDetails = await res.json();
    console.error("Detalles del error:", errorDetails);
    throw new Error(errorDetails.detail || "Falló la actualización");
  }

  return await res.json();
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
    body: JSON.stringify(bidPayload),
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
    `https://los-ases-backend.onrender.com/api/auctions/${auctionId}/bid/${bidId}/`,
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

export const getAllBids = async () => {
  try {
    const res = await fetch("https://los-ases-backend.onrender.com/api/bids/");
    if (!res.ok) {
      throw new Error("Error al obtener pujas");
    }
    return await res.json();
  } catch (error) {
    return []; // devolvemos un array vacío si hay fallo
  }
};

export const createRating = async (auctionId, ratingData, token) => {
  const res = await fetch(`${API_BASE_URL}${auctionId}/ratings/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(ratingData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    const msg = err && typeof err === "object"
      ? Object.entries(err).map(([k, v]) => `${k}: ${v}`).join("; ")
      : "Error al crear la valoración";
    throw new Error(msg);
  }
  return await res.json();
};

export const updateRating = async (auctionId, ratingId, ratingData, token) => {
  const res = await fetch(`${API_BASE_URL}${auctionId}/ratings/${ratingId}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(ratingData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    const msg = err && typeof err === "object"
      ? Object.entries(err).map(([k, v]) => `${k}: ${v}`).join("; ")
      : "Error al actualizar la valoración";
    throw new Error(msg);
  }
  return await res.json();
};
