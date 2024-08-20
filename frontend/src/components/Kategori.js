import React, { useState, useEffect, useRef } from "react";
// import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import axios from "axios";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "datatables.net-bs5/js/dataTables.bootstrap5.min.js";
import { Modal, Button } from "react-bootstrap";
import $ from "jquery";
import Swal from "sweetalert2";

const Kategori = () => {
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newKategori, setNewKategori] = useState("");
  const [editKategoriId, setEditKategoriId] = useState(null);
  const [editKategoriName, setEditKategoriName] = useState("");
  const tableRef = useRef(null);
  const dataTableRef = useRef(null);

    useEffect(() => {
        const table = $(tableRef.current).DataTable({
        destroy: true,
        processing: true,
        serverSide: true,
        ajax: {
            url: "http://localhost:8080/api/kategori/datatables",
            type: "GET",
            data: function (d) {
                d.length = 10; // Mengatur jumlah data per halaman menjadi 50
            }
        },
        columns: [
            {
            data: null,
            render: function (data, type, row, meta) {
                return meta.row + 1;
            },
            },
            { data: "category_name" },
            {
            data: null,
            render: function (data, type, row) {
                return `
                    <div>
                        <button type="button" class="btn btn-sm btn-primary me-2" data-id="${row._id.$oid}" data-name="${row.category_name}" data-action="edit">Edit</button>
                        <button type="button" class="btn btn-sm btn-danger" data-id="${row._id.$oid}" data-action="delete">Hapus</button>
                    </div>
                `;
            },
            },
        ],
        pageLength: 10,
        initComplete: function () {
            initSearchFilter(this);
            }
        });

        dataTableRef.current = table;

        $(tableRef.current).on("click", "button", function () {
        const action = $(this).data("action");
        const id = $(this).data("id");
        const name = $(this).data("name");

        if (action === "edit") {
            handleEdit(id, name);
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
        table.api().columns().every(function () {
            const column = this;
            const input = $(`<input type="text" placeholder="Filter ${column.header().textContent}" />`)
                .appendTo($(column.footer()).empty())
                .on('keyup change clear', function () {
                    if (column.search() !== this.value) {
                        column.search(this.value).draw();
                    }
                });
        });
    }

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
        await axios.delete(`http://localhost:8080/api/kategori/${id}`);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { category_name: newKategori };
      await axios.post("http://localhost:8080/api/kategori", data);

      setNewKategori("");
      setShowAddModal(false);
      dataTableRef.current.ajax.reload();
    } catch (error) {
      console.error("Error adding kategori:", error);
    }
  };

  const handleEdit = (id, kategoriName) => {
    setEditKategoriId(id);
    setEditKategoriName(kategoriName);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { category_name: editKategoriName };
      await axios.put(
        `http://localhost:8080/api/kategori/${editKategoriId}`,
        data
      );

      setShowEditModal(false);
      setEditKategoriId(null);
      setEditKategoriName("");

      dataTableRef.current.ajax.reload();
    } catch (error) {
      console.error("Error editing kategori:", error);
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
                      <th scope="col">Nama Kategori</th>
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
      >
        <Modal.Header closeButton>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label htmlFor="kategoriInput" className="form-label">
              Nama Kategori
            </label>
            <input
              type="text"
              className="form-control"
              id="kategoriInput"
              value={newKategori}
              onChange={(e) => setNewKategori(e.target.value)}
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
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Kategori</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label htmlFor="editKategoriInput" className="form-label">
              Nama Kategori
            </label>
            <input
              type="text"
              className="form-control"
              id="editKategoriInput"
              value={editKategoriName}
              onChange={(e) => setEditKategoriName(e.target.value)}
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
export default Kategori;
