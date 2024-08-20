import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import axios from "axios";
import Swal from "sweetalert2";

function SubModul() {
  const { id } = useParams();
  const [subModuls, setSubModuls] = useState([]);
  const [modulIdDefault, setModulIdDefault] = useState(null);
  const [OtoritasID, setOtoritasID] = useState(null);
  const [newSubModul, setNewSubModul] = useState({
    modul_id: id,
    nama_submodul: "",
  });
  const [editingSubModul, setEditingSubModul] = useState(null);

  useEffect(() => {
    fetchData(id);
    showID(id);
  }, [id]);

  const showID = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/submoduls/getID/${id}`
      );
    //   console.log(response.data);
      setOtoritasID(response.data.otoritas_id);
      setModulIdDefault(response.data.modul_id);
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    }
  };

  const fetchData = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/submoduls/${id}`
      );
      setSubModuls(response.data);
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    }
  };

  const handleChange = (e) => {
    setNewSubModul({ ...newSubModul, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const createdAt = new Date().toISOString();
      const updatedSubModul = { ...newSubModul, created_at: createdAt };

      if (editingSubModul) {
        await axios.put(
          `http://localhost:8080/api/submoduls/${editingSubModul._id.$oid}`,
          updatedSubModul
        );
        setEditingSubModul(null);
        setNewSubModul({ modul_id: id, nama_submodul: "" });
      } else {
        await axios.post("http://localhost:8080/api/submoduls", updatedSubModul);
        setNewSubModul({ modul_id: id, nama_submodul: "" });
      }

      fetchData(id); // Fetch data after submit
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    }
  };

  const handleEdit = async (item) => {
    setEditingSubModul(item);
    setNewSubModul(item);
    fetchData(id); // Fetch data after edit
  };

  const handleDelete = async (id_submodul) => {
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
        await axios.delete(`http://localhost:8080/api/submoduls/${id_submodul}`);
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
          to={`/todo/otoritas/modul/${OtoritasID}`}
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
                    id="modul_id"
                    name="modul_id"
                    value={newSubModul.modul_id}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="nama_submodul" className="form-label">
                    Nama Sub Modul
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nama_submodul"
                    name="nama_submodul"
                    value={newSubModul.nama_submodul}
                    onChange={handleChange}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  {editingSubModul ? "Update" : "Submit"}
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="card mt-4">
            <div className="card-header">
              <strong>Data Sub Modul</strong>
              <span className="small ms-1">Basic example</span>
            </div>
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama Sub Modul</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subModuls.length > 0 ? (
                    subModuls.map((item, index) => (
                      <tr key={item._id.$oid}>
                        <td>{index + 1}</td>
                        <td>{item.nama_submodul}</td>
                        <td>
                          <Link
                            to={`/todo/otoritas/modul/sub/task/${item._id.$oid}`}
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
                      <td colSpan="3">Data Tidak Tersedia</td>
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

export default SubModul;