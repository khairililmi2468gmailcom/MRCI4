import React, { useState, useEffect, useRef } from "react";
import MainLayout from "../layouts/MainLayout";
import axios from "axios";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "datatables.net-bs5/js/dataTables.bootstrap5.min.js";
import { Modal, Button } from "react-bootstrap";
import $ from "jquery";
import Swal from "sweetalert2";

const User = () => {
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newUser, setNewUser] = useState({
        nama: "",
        email: "",
        hp: "",
        username: "",
        password: "",
        level: "",
        access_key: "",
        status: "",
    });
    const [editUserId, setEditUserId] = useState(null);
    const [editUser, setEditUser] = useState({
        nama: "",
        email: "",
        hp: "",
        username: "",
        password: "",
        level: "",
        access_key: "",
        status: "",
    });
    const tableRef = useRef(null);
    const dataTableRef = useRef(null);

    useEffect(() => {
        const table = $(tableRef.current).DataTable({
        destroy: true,
        processing: true,
        serverSide: true,
        ajax: {
            url: "http://localhost:8080/api/user/datatables",
            type: "GET",
            data: function (d) {
            d.length = 10;
            },
        },
        columns: [
            {
            data: null,
            render: function (data, type, row, meta) {
                return meta.row + 1;
            },
            },
            {
            data: "nama",
            defaultContent: "", // Menampilkan string kosong jika kolom tidak tersedia
            },
            {
            data: "email",
            defaultContent: "", // Menampilkan string kosong jika kolom tidak tersedia
            },
            {
            data: "hp",
            defaultContent: "", // Menampilkan string kosong jika kolom tidak tersedia
            },
            {
            data: "username",
            defaultContent: "", // Menampilkan string kosong jika kolom tidak tersedia
            },
            {
            data: "level",
            defaultContent: "", // Menampilkan string kosong jika kolom tidak tersedia
            },
            {
            data: "access_key",
            defaultContent: "", // Menampilkan string kosong jika kolom tidak tersedia
            },
            {
            data: "status",
            defaultContent: "", // Menampilkan string kosong jika kolom tidak tersedia
            },
            {
            data: "created_at",
            defaultContent: "", // Menampilkan string kosong jika kolom tidak tersedia
            },
            {
            data: null,
            render: function (data, type, row) {
                return `
                <div>
                    <button type="button" class="btn btn-sm btn-primary me-2" data-id="${row._id.$oid}" data-action="edit">Edit</button>
                    <button type="button" class="btn btn-sm btn-danger" data-id="${row._id.$oid}" data-action="delete">Hapus</button>
                </div>
            `;
            },
            },
        ],
        pageLength: 10,
        initComplete: function () {
            initSearchFilter(this);
        },
        });

        dataTableRef.current = table;

        $(tableRef.current).on("click", "button", function () {
        const action = $(this).data("action");
        const id = $(this).data("id");

        if (action === "edit") {
            handleEdit(id);
        } else if (action === "delete") {
            handleDelete(id);
        }
        });

        setLoading(false);

        return () => {
        table.destroy();
        };
    }, []);

    const initSearchFilter = (table) => {
        table
        .api()
        .columns()
        .every(function () {
            const column = this;
            const input = $(
            `<input type="text" placeholder="Filter ${
                column.header().textContent
            }" />`
            )
            .appendTo($(column.footer()).empty())
            .on("keyup change clear", function () {
                if (column.search() !== this.value) {
                column.search(this.value).draw();
                }
            });
        });
    };

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
            await axios.delete(`http://localhost:8080/api/user/${id}`);
            dataTableRef.current.ajax.reload();
            Swal.fire("Terhapus!", "User berhasil dihapus.", "success");
        }
        } catch (error) {
        console.error("Error deleting user:", error);
        Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus user.", "error");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const data = newUser;
        await axios.post("http://localhost:8080/api/user", data);

        setNewUser({
            nama: "",
            email: "",
            hp: "",
            username: "",
            password: "",
            level: "",
            access_key: "",
            status: "",
        });
        setShowAddModal(false);
        dataTableRef.current.ajax.reload();
        } catch (error) {
        console.error("Error adding user:", error);
        }
    };

    const handleEdit = async (id) => {
        try {
        const response = await axios.get(`http://localhost:8080/api/user/${id}`);
        const user = response.data;
        setEditUserId(id);
        setEditUser({
            nama: user.nama,
            email: user.email,
            hp: user.hp,
            username: user.username,
            password: user.password,
            level: user.level,
            access_key: user.access_key,
            status: user.status,
        });
        setShowEditModal(true);
        } catch (error) {
        console.error("Error fetching user:", error);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
        const data = editUser;
        await axios.put(`http://localhost:8080/api/user/${editUserId}`, data);

        setShowEditModal(false);
        setEditUserId(null);
        setEditUser({
            nama: "",
            email: "",
            hp: "",
            username: "",
            password: "",
            level: "",
            access_key: "",
            status: "",
        });

        dataTableRef.current.ajax.reload();
        } catch (error) {
        console.error("Error editing user:", error);
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
                <div className="table-responsive">
                    <table
                    className="table table-striped"
                    ref={tableRef}
                    style={{ width: "100%" }}
                    >
                    <thead>
                        <tr>
                        <th style={{ width: "10px" }} scope="col"></th>
                        <th scope="col">Nama</th>
                        <th scope="col">Email</th>
                        <th scope="col">No. HP</th>
                        <th scope="col">Username</th>
                        <th scope="col">Level</th>
                        <th scope="col">Access Key</th>
                        <th scope="col">Status</th>
                        <th scope="col">Created At</th>
                        <th scope="col">Aksi</th>
                        </tr>
                    </thead>
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
            scrollable
        >
            <Modal.Header closeButton>
            <Modal.Title>Tambah User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                <label htmlFor="namaInput" className="form-label">
                    Nama
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="namaInput"
                    value={newUser.nama}
                    onChange={(e) =>
                    setNewUser({ ...newUser, nama: e.target.value })
                    }
                />
                </div>
                <div className="mb-3">
                <label htmlFor="emailInput" className="form-label">
                    Email
                </label>
                <input
                    type="email"
                    className="form-control"
                    id="emailInput"
                    value={newUser.email}
                    onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                    }
                />
                </div>
                <div className="mb-3">
                <label htmlFor="hpInput" className="form-label">
                    No. HP
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="hpInput"
                    value={newUser.hp}
                    onChange={(e) => setNewUser({ ...newUser, hp: e.target.value })}
                />
                </div>
                <div className="mb-3">
                <label htmlFor="usernameInput" className="form-label">
                    Username
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="usernameInput"
                    value={newUser.username}
                    onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
                    }
                />
                </div>
                <div className="mb-3">
                <label htmlFor="passwordInput" className="form-label">
                    Password
                </label>
                <input
                    type="password"
                    className="form-control"
                    id="passwordInput"
                    value={newUser.password}
                    onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                    }
                />
                </div>
                <div className="mb-3">
                    <label htmlFor="levelInput" className="form-label">
                        Level
                    </label>
                    <select
                        className="form-select"
                        id="levelInput"
                        value={newUser.level}
                        onChange={(e) =>
                            setNewUser({ ...newUser, level: e.target.value })
                        }
                    >
                        <option value="Admin">Admin</option>
                        <option value="User">User</option>
                    </select>
                </div>

                <div className="mb-3">
                <label htmlFor="accessKeyInput" className="form-label">
                    Access Key
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="accessKeyInput"
                    value={newUser.access_key}
                    onChange={(e) =>
                    setNewUser({ ...newUser, access_key: e.target.value })
                    }
                />
                </div>
                <div className="mb-3">
                <label htmlFor="statusInput" className="form-label">
                    Status
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="statusInput"
                    value={newUser.status}
                    onChange={(e) =>
                    setNewUser({ ...newUser, status: e.target.value })
                    }
                />
                </div>
            </form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                Batal
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
            <Modal.Title>Edit User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <form onSubmit={handleEditSubmit}>
                <div className="mb-3">
                <label htmlFor="editNamaInput" className="form-label">
                    Nama
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="editNamaInput"
                    value={editUser.nama}
                    onChange={(e) =>
                    setEditUser({ ...editUser, nama: e.target.value })
                    }
                />
                </div>
                <div className="mb-3">
                <label htmlFor="editEmailInput" className="form-label">
                    Email
                </label>
                <input
                    type="email"
                    className="form-control"
                    id="editEmailInput"
                    value={editUser.email}
                    onChange={(e) =>
                    setEditUser({ ...editUser, email: e.target.value })
                    }
                />
                </div>
                <div className="mb-3">
                <label htmlFor="editHpInput" className="form-label">
                    No. HP
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="editHpInput"
                    value={editUser.hp}
                    onChange={(e) =>
                    setEditUser({ ...editUser, hp: e.target.value })
                    }
                />
                </div>
                <div className="mb-3">
                <label htmlFor="editUsernameInput" className="form-label">
                    Username
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="editUsernameInput"
                    value={editUser.username}
                    onChange={(e) =>
                    setEditUser({ ...editUser, username: e.target.value })
                    }
                />
                </div>
                <div className="mb-3">
                    <label htmlFor="editPasswordInput" className="form-label">
                        Password
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="editPasswordInput"
                        onChange={(e) =>
                            setEditUser({ ...editUser, password: e.target.value })
                        }
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="editLevelInput" className="form-label">
                        Level
                    </label>
                    <select
                        className="form-select"
                        id="editLevelInput"
                        value={editUser.level}
                        onChange={(e) =>
                            setEditUser({ ...editUser, level: e.target.value })
                        }
                    >
                        <option value="Admin">Admin</option>
                        <option value="User">User</option>
                    </select>
                </div>

                <div className="mb-3">
                <label htmlFor="editAccessKeyInput" className="form-label">
                    Access Key
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="editAccessKeyInput"
                    value={editUser.access_key}
                    onChange={(e) =>
                    setEditUser({ ...editUser, access_key: e.target.value })
                    }
                />
                </div>
                <div className="mb-3">
                <label htmlFor="editStatusInput" className="form-label">
                    Status
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="editStatusInput"
                    value={editUser.status}
                    onChange={(e) =>
                    setEditUser({ ...editUser, status: e.target.value })
                    }
                />
                </div>
            </form>
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
export default User;
