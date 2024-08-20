<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use MongoDB\Client;
use MongoDB\BSON\ObjectId;

class Project extends ResourceController
{
    protected $format = 'json';
    protected $mongoDB;
    protected $collection;

    public function __construct()
    {
        $this->mongoDB = (new Client)->todo;
        $this->collection = $this->mongoDB->tb_project;
    }

    public function datatables()
    {
        try {
            $limit = intval($this->request->getGet('length'));
            $offset = intval($this->request->getGet('start'));
            $kategori = $this->collection->find([], ['limit' => $limit, 'skip' => $offset])->toArray();
            $totalData = $this->collection->countDocuments();
            $data = [
                'draw' => intval($this->request->getGet('draw')),
                'recordsTotal' => $totalData,
                'recordsFiltered' => $totalData,
                'data' => $kategori
            ];
            return $this->respond($data);
        } catch (\Exception $e) {
            return $this->fail('Gagal terhubung ke database MongoDB: ' . $e->getMessage(), 500);
        }
    }

    public function index()
    {
        try {
            $kategori = $this->collection->find()->toArray();
            return $this->respond($kategori);
        } catch (\Exception $e) {
            return $this->fail('Gagal terhubung ke database MongoDB: ' . $e->getMessage(), 500);
        }
    }

    public function show($id = null)
    {
        try {
            $filter = [];
            if ($id) {
                $filter['_id'] = new \MongoDB\BSON\ObjectId($id);
            } else {
                $filter['project_status'] = 'On Progress';
            }

            $projects = $this->collection->find($filter)->toArray();
            return $this->respond($projects);
        } catch (\Exception $e) {
            return $this->fail('Gagal terhubung ke database MongoDB: ' . $e->getMessage(), 500);
        }
    }

    public function create()
    {
        try {
            // Ambil data dari request
            $data = $this->request->getJSON();

            // Pastikan semua data yang diperlukan ada dalam request
            if (!isset($data->nama_project) || !isset($data->category_id) || !isset($data->project_type) || !isset($data->keterangan) || !isset($data->tanggal_mulai) || !isset($data->estimasi_tanggal_selesai)) {
                return $this->fail('Semua field harus diisi', 400);
            }

            // Masukkan data ke dalam database
            $this->collection->insertOne([
                'nama_project' => $data->nama_project,
                'nama_kategori' => $data->category_id,
                'tipe_projek' => $data->project_type,
                'keterangan' => $data->keterangan,
                'tanggal_mulai' => $data->tanggal_mulai,
                'estimasi_tanggal_selesai' => $data->estimasi_tanggal_selesai,
                'project_status' => 'On Progress'
            ]);

            // Beri respons sukses
            return $this->respondCreated(['message' => 'Data project berhasil ditambahkan']);
        } catch (\Exception $e) {
            // Beri respons jika terjadi error
            return $this->fail('Gagal menambahkan data project: ' . $e->getMessage(), 500);
        }
    }

    public function update($id = null)
    {
        try {
            if (!$id) {
                return $this->fail('ID proyek tidak valid', 400);
            }

            $data = $this->request->getJSON();

            // Pastikan semua field ada dalam data yang diterima
            if (!isset($data->nama_project) || !isset($data->tipe_project) || !isset($data->keterangan) || !isset($data->tanggal_mulai) || !isset($data->estimasi_tanggal_selesai)) {
                return $this->fail('Field proyek tidak boleh kosong', 400);
            }

            $result = $this->collection->updateOne(
                ['_id' => new \MongoDB\BSON\ObjectId($id)],
                ['$set' => [
                    'nama_project' => $data->nama_project,
                    'nama_kategori' => $data->nama_kategori,
                    'tipe_projek' => $data->tipe_project,
                    'keterangan' => $data->keterangan,
                    'tanggal_mulai' => $data->tanggal_mulai,
                    'estimasi_tanggal_selesai' => $data->estimasi_tanggal_selesai
                ]]
            );

            if ($result->getModifiedCount() === 1) {
                return $this->respond(['message' => 'Proyek berhasil diupdate']);
            } else {
                return $this->failNotFound('Proyek tidak ditemukan');
            }
        } catch (\Exception $e) {
            return $this->fail('Gagal mengupdate proyek: ' . $e->getMessage(), 500);
        }
    }

    public function delete($id = null)
    {
        try {
            if (!$id) {
                return $this->fail('ID kategori tidak valid', 400);
            }

            $deleted = $this->collection->deleteOne(['_id' => new \MongoDB\BSON\ObjectId($id)]);

            if ($deleted->getDeletedCount() === 1) {
                return $this->respondDeleted(['message' => 'Kategori berhasil dihapus']);
            } else {
                return $this->failNotFound('Kategori tidak ditemukan');
            }
        } catch (\Exception $e) {
            return $this->fail('Gagal menghapus kategori: ' . $e->getMessage(), 500);
        }
    }
}
