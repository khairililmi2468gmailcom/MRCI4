import React, { useState, useEffect, useRef } from 'react';
// import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import axios from "axios";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "datatables.net-bs5/js/dataTables.bootstrap5.min.js";
import { Modal, Button } from "react-bootstrap";
import $ from "jquery";
import Swal from "sweetalert2";
import { format } from 'date-fns';
import id from 'date-fns/locale/id';

const Project = () => {
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editProjectId, setEditProjectId] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [editProjectName, setEditProjectName] = useState('');
    const [editProjectType, setEditProjectType] = useState('');
    const [editKeterangan, setEditKeterangan] = useState('');
    const [editTanggalMulai, setEditTanggalMulai] = useState('');
    const [editEstimasiTanggalSelesai, setEditEstimasiTanggalSelesai] = useState('');

    const [newKategori, setNewKategori] = useState("");
    const [newEditKategori, setNewEditKategori] = useState("");
    const tableRef = useRef();
    const dataTableRef = useRef(null);
    const [kategoriOptions, setKategoriOptions] = useState([]);
    const [newProject, setNewProjects] = useState('');
    const [newProjectType, setNewProjectType] = useState('');
    const [newKeterangan, setNewKeterangan] = useState('');
    const [newTanggalMulai, setNewTanggalMulai] = useState('');
    const [newEstimasiTanggalSelesai, setNewEstimasiTanggalSelesai] = useState('');

    useEffect(() => {
        const table = $(tableRef.current).DataTable({
            destroy: true,
            processing: true,
            serverSide: true,
            ajax: {
                url: "http://localhost:8080/api/project/datatables",
                type: "GET",
                data: function (d) {
                    d.length = 10; // Mengatur jumlah data per halaman menjadi 50
                }
            },
            pageLength: 10,
            columns: [
                { 
                    data: null,
                    orderable: false,
                    searchable: false,
                    render: function (data, type, row, meta) {
                        return meta.row + meta.settings._iDisplayStart + 1;
                    }
                },
                { data: "nama_project" },
                { 
                    data: "nama_kategori",
                },
                { data: "keterangan" },
                { 
                    data: "tanggal_mulai",
                    render: function(data, type, row) {
                        // Memformat tanggal mulai
                        var tanggalMulai = new Date(data);
                        var formattedTanggalMulai = format(tanggalMulai, 'dd MMMM yyyy', { locale: id });

                        // Mengembalikan tanggal mulai yang diformat
                        return formattedTanggalMulai;
                    }
                },
                { 
                    data: "estimasi_tanggal_selesai",
                    render: function(data, type, row) {
                        // Memformat estimasi tanggal selesai
                        var estimasiSelesai = new Date(data);
                        var formattedEstimasiSelesai = format(estimasiSelesai, 'dd MMMM yyyy', { locale: id });

                        // Mengembalikan estimasi tanggal selesai yang diformat
                        return formattedEstimasiSelesai;
                    }
                },
                { 
                    data: "estimasi_tanggal_selesai",
                    className: 'text-center',
                    render: function(data, type, row) {
                        // Menghitung sisa hari
                        var estimasi = new Date(data);
                        var today = new Date();
                        var sisaHari = Math.ceil((estimasi - today) / (1000 * 60 * 60 * 24));

                        // Mengembalikan sisa hari
                        return sisaHari;
                    }
                },
                { 
                    data: "action",
                    render: function (data, type, row) {
                        return `
                            <div>
                                <button type="button" class="btn btn-sm btn-primary me-2" data-id="${row._id.$oid}" data-kategori=${row.nama_kategori} data-name="${row.nama_project}" data-action="edit" data-type="${row.tipe_projek}" data-keterangan="${row.keterangan}" data-mulai="${row.tanggal_mulai}" data-selesai="${row.estimasi_tanggal_selesai}">Edit</button>
                                <button type="button" class="btn btn-sm btn-danger" data-id="${row._id.$oid}" data-action="delete">Hapus</button>
                            </div>
                        `;
                    }
                },
            ]
        });

        dataTableRef.current = table;

        $(tableRef.current).on("click", "button", function () {
            const action = $(this).data("action");
            const kategori = $(this).data("kategori");
            const id = $(this).data("id");
            const projectName = $(this).data("name");
            const projectType = $(this).data("type");
            const keterangan = $(this).data("keterangan");
            const tanggalMulai = $(this).data("mulai");
            const estimasiTanggalSelesai = $(this).data("selesai");

            if (action === "edit") {
                handleEdit(id, kategori, projectName, projectType, keterangan, tanggalMulai, estimasiTanggalSelesai);
            } else if (action === "delete") {
                handleDelete(id);
            }
        });

        setLoading(false);

        return () => {
            table.destroy();
        };
    }, []);

    useEffect(() => {
        axios.get('http://localhost:8080/api/kategori')
            .then(response => {
                setKategoriOptions(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const handleDelete = async (id) => {
        try {
        const result = await Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Anda tidak akan dapat mengembalikan ini!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, hapus saja!",
            cancelButtonText: "Batal",
        });

        if (result.isConfirmed) {
            await axios.delete(`http://localhost:8080/api/project/${id}`);
            dataTableRef.current.ajax.reload();
            Swal.fire("Terhapus!", "Kategori berhasil dihapus.", "success");
        }
        } catch (error) {
        console.error("Error deleting kategori:", error);
        Swal.fire(
            "Gagal!",
            "Terjadi kesalahan saat menghapus kategori.",
            "error"
        );
        }
    };

    const handleSubmit = () => {
        axios.post('http://localhost:8080/api/project', {
            category_id: newKategori,
            nama_project: newProject,
            project_type: newProjectType,
            keterangan: newKeterangan,
            tanggal_mulai: newTanggalMulai,
            estimasi_tanggal_selesai: newEstimasiTanggalSelesai
        })
        .then(response => {
            setShowAddModal(false);
            dataTableRef.current.ajax.reload();
            // Tambahkan logika lain yang diperlukan setelah berhasil menambahkan data
        })
        .catch(error => {
            console.error('Error adding project:', error);
            // Tambahkan logika lain untuk menangani error
        });
    };

    const handleEdit = (id, kategori, projectName, projectType, keterangan, tanggalMulai, estimasiTanggalSelesai) => {
        setNewEditKategori(kategori);
        setEditProjectId(id);
        setEditProjectName(projectName);
        setEditProjectType(projectType);
        setEditKeterangan(keterangan);
        setEditTanggalMulai(tanggalMulai);
        setEditEstimasiTanggalSelesai(estimasiTanggalSelesai);
        setShowEditModal(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
            nama_kategori: newEditKategori,
            nama_project: editProjectName,
            tipe_project: editProjectType,
            keterangan: editKeterangan,
            tanggal_mulai: editTanggalMulai,
            estimasi_tanggal_selesai: editEstimasiTanggalSelesai
            };
            await axios.put(
            `http://localhost:8080/api/project/${editProjectId}`,
            data
            );

            setShowEditModal(false);
            setEditProjectId(null);
            setEditProjectName("");
            setEditProjectType("");
            setEditKeterangan("");
            setEditTanggalMulai("");
            setEditEstimasiTanggalSelesai("");

            dataTableRef.current.ajax.reload();
        } catch (error) {
            console.error("Error editing project:", error);
        }
    };

    return (
        <MainLayout>
        <div className="container-lg px-4">
            <div className="">
                <button
                    className="btn btn-primary mb-3"
                    onClick={() => setShowAddModal(true)}
                >
                    <i className="me-2 fas fa-plus"></i>
                    Tambah Data
                </button>
                <div className="card mb-4">
                    <div className="card-header">
                        <strong>Tables</strong>
                        <span className="small ms-1">Basic example</span>
                    </div>
                    <div className="card-body">
                        <p className="text-body-secondary small">
                            Using the most basic table markup, here's how{" "}
                            <code>.table</code>-based tables look in Bootstrap.
                        </p>
                        <div className="example">
                            <table
                                className="table table-striped"
                                ref={tableRef}
                                style={{ width: "100%" }}
                            >
                                <thead>
                                    <tr>
                                        <th style={{ width: "10px" }} scope="col">
                                            #
                                        </th>
                                        <th scope="col">Nama Project</th>
                                        <th scope="col">Kategori Project</th>
                                        <th scope="col">Keterangan</th>
                                        <th scope="col">Tanggal Mulai</th>
                                        <th scope="col">Estimasi Tanggal Selesai</th>
                                        <th scope="col">Sisa Hari</th>
                                        <th scope="col">Aksi</th>
                                    </tr>
                                </thead>
                                {/* Data tabel akan ditampilkan di sini */}
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Modal
            show={showAddModal}
            onHide={() => setShowAddModal(false)}
            backdrop="static"
            keyboard={false}
            size="md" // Mengatur ukuran modal menjadi large
            scrollable // Membuat body modal dapat di-scroll
        >
            <Modal.Header closeButton>
                <Modal.Title>Modal title</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <label htmlFor="categoryInput" className="form-label">Nama Kategori</label>
                    <select
                        className="form-select"
                        id="categoryInput"
                        value={newKategori}
                        onChange={(e) => setNewKategori(e.target.value)}
                    >
                        <option value="">Pilih Kategori</option>
                        {kategoriOptions.map((option, index) => (
                            <option key={index} value={option.category_id}>
                                {option.category_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="projectInput" className="form-label">Nama Project</label>
                    <input
                        type="text"
                        className="form-control"
                        id="projectInput"
                        value={newProject}
                        onChange={(e) => setNewProjects(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="projectTypeInput" className="form-label">Tipe Project</label>
                    <select
                        className="form-select"
                        id="projectTypeInput"
                        value={newProjectType}
                        onChange={(e) => setNewProjectType(e.target.value)}
                    >
                        <option value="">Pilih Tipe Project</option>
                        <option value="zero">Zero</option>
                        <option value="perbaikan">Perbaikan</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="keteranganInput" className="form-label">Keterangan</label>
                    <textarea
                        className="form-control"
                        id="keteranganInput"
                        value={newKeterangan}
                        onChange={(e) => setNewKeterangan(e.target.value)}
                    ></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="tanggalMulaiInput" className="form-label">Tanggal Mulai</label>
                    <input
                        type="date"
                        className="form-control"
                        id="tanggalMulaiInput"
                        value={newTanggalMulai}
                        onChange={(e) => setNewTanggalMulai(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="estimasiTanggalSelesaiInput" className="form-label">Estimasi Tanggal Selesai</label>
                    <input
                        type="date"
                        className="form-control"
                        id="estimasiTanggalSelesaiInput"
                        value={newEstimasiTanggalSelesai}
                        onChange={(e) => setNewEstimasiTanggalSelesai(e.target.value)}
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Save changes
                </Button>
            </Modal.Footer>
        </Modal>

        <Modal
            show={showEditModal}
            onHide={() => setShowEditModal(false)}
            backdrop="static"
            keyboard={false}
            scrollable
        >
            <Modal.Header closeButton>
                <Modal.Title>Edit Project</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <label htmlFor="categoryInput" className="form-label">Nama Kategori</label>
                    <select
                        className="form-select"
                        id="categoryInput"
                        value={newEditKategori}
                        onChange={(e) => setNewEditKategori(e.target.value)}
                    >
                        <option value="">Pilih Kategori</option>
                        {kategoriOptions.map((option, index) => (
                            <option key={index} value={option.category_id}>
                                {option.category_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="editProjectInput" className="form-label">
                        Nama Project
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="editProjectInput"
                        value={editProjectName}
                        onChange={(e) => setEditProjectName(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="editProjectTypeInput" className="form-label">
                        Tipe Project
                    </label>
                    <select
                        className="form-select"
                        id="editProjectTypeInput"
                        value={editProjectType}
                        onChange={(e) => setEditProjectType(e.target.value)}
                    >
                        <option value="">Pilih Tipe Project</option>
                        <option value="zero">Zero</option>
                        <option value="perbaikan">Perbaikan</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="editKeteranganInput" className="form-label">
                        Keterangan
                    </label>
                    <textarea
                        className="form-control"
                        id="editKeteranganInput"
                        value={editKeterangan}
                        onChange={(e) => setEditKeterangan(e.target.value)}
                    ></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="editTanggalMulaiInput" className="form-label">
                        Tanggal Mulai
                    </label>
                    <input
                        type="date"
                        className="form-control"
                        id="editTanggalMulaiInput"
                        value={editTanggalMulai}
                        onChange={(e) => setEditTanggalMulai(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="editEstimasiTanggalSelesaiInput" className="form-label">
                        Estimasi Tanggal Selesai
                    </label>
                    <input
                        type="date"
                        className="form-control"
                        id="editEstimasiTanggalSelesaiInput"
                        value={editEstimasiTanggalSelesai}
                        onChange={(e) => setEditEstimasiTanggalSelesai(e.target.value)}
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                    Batal
                </Button>
                <Button variant="primary" onClick={handleEditSubmit}>
                    Update Perubahan
                </Button>
            </Modal.Footer>
        </Modal>

        </MainLayout>
    );
};
export default Project;
