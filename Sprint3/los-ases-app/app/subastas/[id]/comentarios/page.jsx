"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import {
  getCommentsByAuction,
  createComment,
  updateComment,
  deleteComment
} from "../../../utils/api";
import styles from "./styles.module.css";

export default function CommentsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [comments, setComments] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const token = localStorage.getItem("accessToken");
  const [myId, setMyId] = useState(null);

  const load = async () => {
    const data = await getCommentsByAuction(id);
    setComments(data);
  };

    useEffect(() => {
        async function fetchCommentsAndUser() {
            // 1) carga los comentarios
            await load();

            // 2) extrae el ID del usuario autenticado
            const token = localStorage.getItem("accessToken");
            if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
            setMyId(payload.user_id ?? payload.id);
            }
        }

        fetchCommentsAndUser();
    }, [id]);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editing) {
        await updateComment(id, editing.id, form, token);
      } else {
        await createComment(id, form, token);
      }
      setForm({ title: "", content: "" });
      setEditing(null);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (c) => {
    setEditing(c);
    setForm({ title: c.title, content: c.content });
  };

  const handleDelete = async (commentId) => {
    if (!confirm("Eliminar este comentario?")) return;
    await deleteComment(id, commentId, token);
    await load();
  };

  return (
    <>
      <Header />
      <div className={styles.commentsPage}>
        <h2>Comentarios</h2>

        {token && (
            <div className={styles.newCommentContainer}>
                <form onSubmit={handleSubmit}>
                    <input
                    name="title"
                    placeholder="Título"
                    value={form.title}
                    onChange={handleChange}
                    />
                    <textarea
                    name="content"
                    placeholder="Contenido"
                    value={form.content}
                    onChange={handleChange}
                    />
                    <button type="submit">
                    {editing ? "Guardar cambios" : "Añadir comentario"}
                    </button>
                    {editing && (
                    <button type="button" onClick={() => {
                        setEditing(null);
                        setForm({ title: "", content: "" });
                    }}>
                        Cancelar
                    </button>
                    )}
                    {error && <p className={styles.error}>{error}</p>}
                </form>
            </div>
        )}  

        <ul className={styles.commentsContainer}>
            {comments.map(c => (
                <li key={c.id} className={styles.commentCard}>
                <h4>{c.title}</h4>
                <p>{c.content}</p>

                <div className={styles.commentMeta}>
                    <span className={styles.username}>Por: {c.reviewer_username}</span>
                    <span className={styles.date}>
                    Creado: {new Date(c.created_at).toLocaleString()}
                    </span>
                    <span className={styles.date}>
                    Últ. mod.: {new Date(c.updated_at ?? c.created_at).toLocaleString()}
                    </span>
                </div>

                {c.reviewer === myId && (
                    <div className={styles.actions}>
                    <button onClick={() => startEdit(c)}>Editar</button>
                    <button onClick={() => handleDelete(c.id)}>Eliminar</button>
                    </div>
                )}
                </li>
            ))}
        </ul>

        <button onClick={() => router.back()}>Volver</button>
      </div>
      <Footer />
    </>
  );
}