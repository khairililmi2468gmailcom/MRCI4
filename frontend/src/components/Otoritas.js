import React, { useEffect, useRef, useState } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import axios from "axios";
import Swal from 'sweetalert2';

function Otoritas() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [otoritas, setOtoritas] = useState([]);
  const [newOtoritas, setNewOtoritas] = useState({
    project_id: id,
    nama_otoritas: "",
  });
  const [editingOtoritas, setEditingOtoritas] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    const storedPosition = localStorage.getItem("scroll_position");
    setScrollPosition(storedPosition ? parseInt(storedPosition) : 0);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = storedPosition ? parseInt(storedPosition) : 0;
    }
    fetchData(id);
  }, [id, location.pathname]);

  const fetchData = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/otoritas/${id}`
      );
      setOtoritas(response.data);
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    }
  };

  const handleChange = (e) => {
    setNewOtoritas({ ...newOtoritas, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingOtoritas) {
        // Update existing data
        await axios.put(
          `http://localhost:8080/api/otoritas/${editingOtoritas._id.$oid}`,
          newOtoritas
        );
        setEditingOtoritas(null);
        setNewOtoritas({ project_id: id, nama_otoritas: "" });
      } else {
        // Create new data
        await axios.post("http://localhost:8080/api/otoritas", newOtoritas);
        setNewOtoritas({ project_id: id, nama_otoritas: "" });
      }
      fetchData(id); // Fetch data after submit
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    }
  };

  const handleEdit = (item) => {
    setEditingOtoritas(item);
    setNewOtoritas(item);
  };

  const handleDetail = (id) => {
    localStorage.setItem("scroll_position", scrollRef.current.scrollTop);
    navigate(`/todo/otoritas/modul/${id}`);
  };

  const handleDelete = async (id_project) => {
    try {
      const result = await Swal.fire({
        title: 'Konfirmasi',
        text: 'Apakah Anda yakin ingin menghapus data ini?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:8080/api/otoritas/${id_project}`);
        Swal.fire(
          'Terhapus!',
          'Data berhasil dihapus.',
          'success'
        );
        fetchData(id);
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      Swal.fire(
        'Gagal!',
        'Terjadi kesalahan saat menghapus data.',
        'error'
      );
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      setScrollPosition(scrollRef.current.scrollTop);
    }
  };

  return (
    <MainLayout>
      <div
        className="container-lg px-4"
        ref={scrollRef}
        onScroll={handleScroll}
      >
        <Link to="/todo" className="btn btn-secondary">
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
                    id="project_id"
                    name="project_id"
                    value={newOtoritas.project_id}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="nama_otoritas" className="form-label">
                    Nama Otoritas
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nama_otoritas"
                    name="nama_otoritas"
                    value={newOtoritas.nama_otoritas}
                    onChange={handleChange}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  {editingOtoritas ? "Update" : "Submit"}
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="card mt-4">
            <div className="card-header">
              <strong>Data Otoritas</strong>
              <span className="small ms-1">Basic example</span>
            </div>
            <div className="card-body">
              <table className="table">
               <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama Otoritas</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {otoritas.length > 0 ? (
                      otoritas.map((item, index) => (
                        <tr key={item.id}>
                          <td>{index + 1}</td>
                          <td>{item.nama_otoritas}</td>
                          <td>
                            <button
                              className="btn btn-info btn-sm me-2"
                              onClick={() => handleDetail(item._id.$oid)}
                            >
                              Detail
                            </button>
                            <button
                              className="btn btn-primary btn-sm me-2"
                              onClick={() => handleEdit(item)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
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

export default Otoritas;
