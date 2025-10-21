import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLaoyout";
import DataTable from "../components/DataTable";
import axios from "axios";
import { API_ROUTE } from "../config/api";
import FormModal, { FormField } from "../components/FormModal";

const initialFormState = {
  title: "",
  content: "",
  category: "",
  status: "published",
};

const Trash = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [editingItem, setEditingItem] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const getData = async () => {
    setLoading(true);
    setError(null);
    try {
      const offset = (currentPage - 1) * itemsPerPage;

      const res = await axios.get(`${API_ROUTE}/${itemsPerPage}/${offset}`);

      const allData = res.data.data.posts;
      const withTrash = allData.filter((item) => item.Status === "trash");

      setData(withTrash);
      setTotalPages(res.data.data.total_pages);
      setTotalItems(res.data.data.total_items);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        console.warn("Page not found (404), setting data to empty.");
        setData([]);
        setTotalPages(1);
        setTotalItems(0);
      } else {
        console.error("Error found ", err.message);
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const columns = [
    { key: "Id", label: "ID" },
    { key: "Title", label: "Title" },
    { key: "Category", label: "Category" },
    { key: "Status", label: "Status" },
    {
      key: "Created_date",
      label: "Created",
      render: (dateString) => new Date(dateString).toLocaleDateString("id-ID"),
    },
  ];

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.Title,
      content: item.Content,
      category: item.Category,
      status: item.Status,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData(initialFormState);
    setFormErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});

    const postData = new FormData();

    for (const key in formData) {
      postData.append(key, formData[key]);
    }

    try {
      if (editingItem) {
        await axios.put(`${API_ROUTE}/${editingItem.Id}`, postData);
      } else {
        await axios.post(`${API_ROUTE}`, postData);
      }

      handleCloseModal();
      getData();
    } catch (err) {
      if (
        err.response &&
        (err.response.status === 400 || err.response.status === 422)
      ) {
        console.log("Validation Errors:", err.response.data);

        let errorData = err.response.data;
        if (errorData.errors) errorData = errorData.errors;
        if (errorData.messages) errorData = errorData.messages;
        const formattedErrors = {};
        for (const key in errorData) {
          if (Array.isArray(errorData[key])) {
            formattedErrors[key] = errorData[key][0];
          } else {
            formattedErrors[key] = errorData[key];
          }
        }

        setFormErrors(formattedErrors);
      } else {
        console.error("An unexpected error occurred:", err);
        setFormErrors({
          _generic: "An unexpected error occurred. Please try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && data.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data users...</p>
        </div>
      </div>
    );
  }

  if (error) return <div>Error: {error}</div>;

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Articles Trash</h1>
            <p className="text-gray-600 mt-1">Manage all Article on Trash</p>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={data}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onEdit={handleOpenEditModal}
          onDelete={false}
          onDetail={false}
          onAdd={false}
          onTrash={false}
        />

        <FormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          title={editingItem ? "Edit Article" : "Add New Article"}
          submitText={editingItem ? "Update" : "Create"}
          isLoading={isSubmitting}
        >
          {formErrors._generic && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {formErrors._generic}
            </div>
          )}

          <FormField
            label="Status"
            name="status"
            type="select"
            value={formData.status}
            onChange={handleFormChange}
            required
            options={[
              { value: "published", label: "Publish" },
              { value: "draft", label: "Draft" },
            ]}
            error={formErrors.status}
          />
        </FormModal>
      </div>
    </DashboardLayout>
  );
};

export default Trash;
