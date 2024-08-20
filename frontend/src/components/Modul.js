import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import axios from "axios";
import Swal from "sweetalert2";

function Modul() {
  const { id } = useParams();
  const [moduls, setModuls] = useState([]);
  const [otoritasIdDefault, setOtoritasIdDefault] = useState(null);
  const [newModul, setNewModul] = useState({
    otoritas_id: id,
    nama_modul: "",
    has_sub_modul: false,
  });
  const [editingModul, setEditingModul] = useState(null);

  useEffect(() => {
    fetchData(id);
    showID(id);
  }, [id]);

  const showID = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/moduls/getID/${id}`
      );
      setOtoritasIdDefault(response.data.project_id);
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    }
  };

  const fetchData = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/moduls/${id}`
      );
      setModuls(response.data);
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    }
  };

  const handleChange = (e) => {
    setNewModul({ ...newModul, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setNewModul({ ...newModul, has_sub_modul: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const createdAt = new Date().toISOString();
      const updatedModul = { ...newModul, created_at: createdAt };

      if (editingModul) {
        await axios.put(
          `http://localhost:8080/api/moduls/${editingModul._id.$oid}`,
          updatedModul
        );
        setEditingModul(null);
        setNewModul({ otoritas_id: id, nama_modul: "", has_sub_modul: false });
      } else {
        await axios.post("http://localhost:8080/api/moduls", updatedModul);
        setNewModul({ otoritas_id: id, nama_modul: "", has_sub_modul: false });
      }

      fetchData(id); // Fetch data after submit
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    }
  };

  const handleEdit = async (item) => {
    setEditingModul(item);
    setNewModul(item);
    fetchData(id); // Fetch data after edit
  };

  const handleDelete = async (id_modul) => {
    try {
      const result = await Swal.fire({
        title: "Konfirmasi",
        text: "Apakah Anda yakin ingin menghapus data ini?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:8080/api/moduls/${id_modul}`);
        Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
        fetchData(id);
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus data.", "error");
    }
  };

  return (
    <MainLayout>
      <div className="container-lg px-4">
        <Link
          to={`/todo/otoritas/${otoritasIdDefault}`}
          className="btn btn-secondary"
        >
          <i className="fas fa-arrow-left nav-icon"></i> Kembali
        </Link>
        <div className="col-6">
          <div className="card mt-4">
            <div className="card-header">
              <strong>Tambah Data</strong>
              <span className="small ms-1">Basic example</span>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-1">
                  <input
                    type="hidden"
                    className="form-control"
                    id="otoritas_id"
                    name="otoritas_id"
                    value={newModul.otoritas_id}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="nama_modul" className="form-label">
                    Nama Modul
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nama_modul"
                    name="nama_modul"
                    value={newModul.nama_modul}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="has_sub_modul"
                    name="has_sub_modul"
                    checked={newModul.has_sub_modul}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="has_sub_modul" className="form-check-label">
                    Has Sub Modul
                  </label>
                </div>
                <button type="submit" className="btn btn-primary">
                  {editingModul ? "Update" : "Submit"}
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="card mt-4">
            <div className="card-header">
              <strong>Data Modul</strong>
              <span className="small ms-1">Basic example</span>
            </div>
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama Modul</th>
                    <th>Has Sub Modul</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                {moduls.length > 0 ? (
                moduls.map((item, index) => (
                    <tr key={item._id.$oid}>
                    <td>{index + 1}</td>
                    <td>{item.nama_modul}</td>
                    <td>{item.has_sub_modul ? "Ya" : "Tidak"}</td>
                    <td>
                         <Link
                        to={
                            item.has_sub_modul
                            ? `/todo/otoritas/modul/sub/${item._id.$oid}`
                            : `/todo/otoritas/modul/task/${item._id.$oid}`
                        }
                        className="btn btn-info btn-sm me-2"
                        >
                        Detail
                        </Link>
                        <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => handleEdit(item)}
                        >
                        Edit
                        </button>
                        <button
                        className="btn btn-danger btn-sm me-2"
                        onClick={() => handleDelete(item._id.$oid)}
                        >
                        Delete
                        </button>
                    </td>
                    </tr>
                ))
                ) : (
                <tr className="text-center">
                    <td colSpan="4">Data Tidak Tersedia</td>
                </tr>
                )}
            </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Modul;
