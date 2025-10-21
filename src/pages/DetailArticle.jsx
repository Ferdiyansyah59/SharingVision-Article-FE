import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLaoyout";
import axios from "axios";
import { API_ROUTE } from "../config/api";
import { useParams, Link } from "react-router-dom";

const DetailArticle = () => {
  const { id } = useParams();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_ROUTE}/${id}`);

        setArticle(res.data.data);
      } catch (err) {
        console.error("Gagal mengambil artikel:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);
  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading article...</p>
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  if (!article) {
    return <div className="p-8 text-center">Article not found.</div>;
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
          <Link to="/" className="text-blue-500 hover:underline mb-4 block">
            &larr; Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
          <div className="flex gap-4 text-sm text-gray-500 mb-6">
            <span>
              Category:{" "}
              <strong className="text-gray-700">{article.category}</strong>
            </span>
            <span>
              Status:{" "}
              <strong className="text-gray-700">{article.status}</strong>
            </span>
          </div>
          <div className="prose max-w-none">
            {/* Gunakan 'whitespace-pre-wrap' agar format paragraf (enter) tetap ada */}
            <p className="whitespace-pre-wrap">{article.content}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DetailArticle;
