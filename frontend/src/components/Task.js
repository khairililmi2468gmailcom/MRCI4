import React, { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import axios from "axios";
import Swal from "sweetalert2";

function Task() {
  const { id } = useParams();
  const location = useLocation();
  const [tasks, setTasks] = useState([]);
  const [modulIdDefault, setModulIdDefault] = useState(null);
  const [subModulIdDefault, setSubModulIdDefault] = useState(null);
  const [idOtoritas, setidOtoritas] = useState(null);
  const [newTask, setNewTask] = useState({
    modul_id: id,
    submodul_id: "",
    joblist: "",
    percentage: 0,
    keterangan: "",
    prioritas: "",
  });
  const [editingTask, setEditingTask] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    fetchData(id);
    showID(id);
  }, [id]);

  useEffect(() => {
    // Restore scroll position when component mounts
    window.scrollTo(0, scrollPosition);
  }, [scrollPosition]);

  const handleScroll = () => {
    // Save the current scroll position
    setScrollPosition(window.pageYOffset);
  };

  useEffect(() => {
    // Add scroll event listener when component mounts
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    fetchData(id);
    showID(id);
  }, [id]);

  const showID = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/tasks/getID/${id}`
      );
      console.log(response.data);
      setidOtoritas(response.data.otoritas_id);
      setModulIdDefault(response.data.modul_id);
      setSubModulIdDefault(response.data.submodul_id);
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    }
  };

  const fetchData = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/tasks/${id}`);
      setTasks(response.data);
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    }
  };

  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const createdAt = new Date().toISOString();
      const updatedTask = { ...newTask, created_at: createdAt };

      if (editingTask) {
        await axios.put(
          `http://localhost:8080/api/tasks/${editingTask._id.$oid}`,
          updatedTask
        );
        setEditingTask(null);
        setNewTask({
          modul_id: id,
          submodul_id: "",
          joblist: "",
          percentage: 0,
          keterangan: "",
          prioritas: "",
        });
      } else {
        await axios.post("http://localhost:8080/api/tasks", updatedTask);
        setNewTask({
          modul_id: id,
          submodul_id: "",
          joblist: "",
          percentage: 0,
          keterangan: "",
          prioritas: "",
        });
      }

      fetchData(id); // Fetch data after submit
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    }
  };

  const handleEdit = async (item) => {
    setEditingTask(item);
    setNewTask(item);
    fetchData(id); // Fetch data after edit
  };

  const handleDelete = async (id_task) => {
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
        await axios.delete(`http://localhost:8080/api/tasks/${id_task}`);
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
        <Link to={`/todo/otoritas/modul/${idOtoritas}`} className="btn btn-secondary">
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
                    value={newTask.modul_id}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="submodul_id" className="form-label">
                    Sub Modul ID
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="submodul_id"
                    name="submodul_id"
                    value={newTask.submodul_id}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="joblist" className="form-label">
                    Joblist
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="joblist"
                    name="joblist"
                    value={newTask.joblist}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="percentage" className="form-label">
                    Percentage
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="percentage"
                    name="percentage"
                    value={newTask.percentage}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="keterangan" className="form-label">
                    Keterangan
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="keterangan"
                    name="keterangan"
                    value={newTask.keterangan}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="prioritas" className="form-label">
                    Prioritas
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="prioritas"
                    name="prioritas"
                    value={newTask.prioritas}
                    onChange={handleChange}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  {editingTask ? "Update" : "Submit"}
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="card mt-4">
            <div className="card-header">
              <strong>Data Task</strong>
              <span className="small ms-1">Basic example</span>
            </div>
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Sub Modul ID</th>
                    <th>Joblist</th>
                    <th>Percentage</th>
                    <th>Keterangan</th>
                    <th>Prioritas</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.length > 0 ? (
                    tasks.map((item, index) => (
                      <tr key={item._id.$oid}>
                        <td>{index + 1}</td>
                        <td>{item.submodul_id}</td>
                        <td>{item.joblist}</td>
                        <td>{item.percentage}</td>
                        <td>{item.keterangan}</td>
                        <td>{item.prioritas}</td>
                        <td>
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
                      <td colSpan="7">Data Tidak Tersedia</td>
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

export default Task;