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
  formData.append("category", data.category);
  formData.append("brand", data.brand);

  const res = await fetch(`${API_BASE_URL}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  let responseBody;
  try {
    responseBody = await res.text(); // solo una vez
  } catch (e) {
    console.error("No se pudo leer la respuesta del servidor");
    throw new Error("Error desconocido al crear la subasta");
  }

  if (!res.ok) {
    console.error("Error al crear la subasta, respuesta bruta:", responseBody);
    let errObj;
    try {
      errObj = JSON.parse(responseBody);
    } catch {}

    const msg = errObj && typeof errObj === "object"
      ? Object.entries(errObj).map(([k, v]) => `${k}: ${v}`).join("; ")
      : responseBody || "Error al crear la subasta";

    throw new Error(msg);
  }

  // Si todo fue bien, parseamos el JSON desde el texto ya leído
  try {
    return JSON.parse(responseBody);
  } catch {
    throw new Error("La respuesta del servidor no es un JSON válido");
  }
};



export const updateAuction = async (id, data) => {
  const token = localStorage.getItem("accessToken")
  if (!token) throw new Error("No estás logueado")

  const res = await fetch(`${API_BASE_URL}${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => null)
    const msg = err?.detail || JSON.stringify(err) || "Falló la actualización"
    throw new Error(msg)
  }

  return await res.json()
}

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

export const createRating = async (auctionId, points, token) => {
  const res = await fetch(`${API_BASE_URL}${auctionId}/ratings/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ points }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    const msg = err && typeof err === "object"
      ? Object.entries(err).map(([k,v])=>`${k}: ${v}`).join("; ")
      : "Error al crear la valoración";
    throw new Error(msg);
  }
  return await res.json();
};

export const updateRating = async (auctionId, ratingId, points, token) => {
  const res = await fetch(`${API_BASE_URL}${auctionId}/ratings/${ratingId}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ points }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    const msg = err && typeof err === "object"
      ? Object.entries(err).map(([k,v])=>`${k}: ${v}`).join("; ")
      : "Error al actualizar la valoración";
    throw new Error(msg);
  }
  return await res.json();
};

export const deleteRating = async (auctionId, ratingId, token) => {
  const res = await fetch(
    `${API_BASE_URL}${auctionId}/ratings/${ratingId}/`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail || "Error al eliminar la valoración");
  }
};

export const getUserRatingByAuction = async (auctionId) => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  const res = await fetch(
    `${API_BASE_URL}${auctionId}/my-rating/`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error("Error al obtener tu valoración");
  }

  return await res.json();
};

// Obtener todos los comentarios de una subasta
export const getCommentsByAuction = async (auctionId) => {
  const res = await fetch(`${API_BASE_URL}${auctionId}/comments/`);
  if (!res.ok) throw new Error("Error al obtener comentarios");
  const data = await res.json();
  return Array.isArray(data) ? data : data.results;
};

// Crear un comentario
export const createComment = async (auctionId, { title, content }, token) => {
  const res = await fetch(`${API_BASE_URL}${auctionId}/comments/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ title, content })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail || "Error al crear comentario");
  }
  return await res.json();
};

// Editar un comentario
export const updateComment = async (auctionId, commentId, { title, content }, token) => {
  const res = await fetch(
    `${API_BASE_URL}${auctionId}/comments/${commentId}/`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title, content })
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail || "Error al actualizar comentario");
  }
  return await res.json();
};

// Eliminar un comentario
export const deleteComment = async (auctionId, commentId, token) => {
  const res = await fetch(
    `${API_BASE_URL}${auctionId}/comments/${commentId}/`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail || "Error al eliminar comentario");
  }
};