const handleDelete = async () => {
    const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar esta subasta?");
    if (!confirmDelete) return;
  
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/auction/${id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });
  
      if (response.ok) {
        alert("Subasta eliminada correctamente.");
        window.location.href = "/subastas";
      } else {
        alert("Error al eliminar la subasta.");
      }
    } catch (error) {
      console.error("Error eliminando:", error);
      alert("Error al intentar eliminar.");
    }
  };
  