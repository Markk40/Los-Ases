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
  // Obtener el token de autenticación del almacenamiento local
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("No estás logueado. El token de autenticación es necesario.");
  }

  // Extraer el user_id del token
  const payload = JSON.parse(atob(token.split(".")[1]));
  const userId = payload.user_id || payload.id;

  // Añadir el userId como auctioneer al cuerpo de la solicitud
  const auctionData = { ...data, auctioneer: userId };

  // Realizar la petición POST con los datos y el token
  const res = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`, // Enviar el token en los headers
    },
    body: JSON.stringify(auctionData),
  });

  if (!res.ok) {
    throw new Error("Error al crear la subasta");
  }

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
    // console.error("❌ Error en getAllBids:", error.message);
    return []; // devolvemos un array vacío si hay fallo
  }
};