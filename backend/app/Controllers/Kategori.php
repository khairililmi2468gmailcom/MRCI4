<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use MongoDB\Client;
use MongoDB\BSON\ObjectId;

class Kategori extends ResourceController
{
    protected $format = 'json';
    protected $mongoDB;
    protected $collection;

    public function __construct()
    {
        $this->mongoDB = (new Client)->todo;
        $this->collection = $this->mongoDB->tb_kategori;
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

    public function create()
    {
        try {
            $data = $this->request->getJSON();

            // Pastikan category_name ada dalam data yang diterima
            if (!isset($data->category_name)) {
                return $this->fail('Nama kategori tidak boleh kosong', 400);
            }

            // Ambil nilai category_name dari data yang diterima
            $category_name = $data->category_name;

            // Masukkan data ke dalam database
            $insertResult = $this->collection->insertOne(['category_name' => $category_name]);

            // Periksa apakah data berhasil dimasukkan
            if ($insertResult->getInsertedCount() > 0) {
                $newCategory = $this->collection->findOne(['_id' => $insertResult->getInsertedId()]);
                return $this->respondCreated(['message' => 'Kategori berhasil ditambahkan', 'data' => $newCategory]);
            } else {
                return $this->fail('Gagal menambahkan kategori', 500);
            }
        } catch (\Exception $e) {
            return $this->fail('Gagal terhubung ke database MongoDB: ' . $e->getMessage(), 500);
        }
    }

    public function update($id = null)
    {
        try {
            if (!$id) {
                return $this->fail('ID kategori tidak valid', 400);
            }

            $data = $this->request->getJSON();

            // Pastikan category_name ada dalam data yang diterima
            if (!isset($data->category_name)) {
                return $this->fail('Nama kategori tidak boleh kosong', 400);
            }

            $result = $this->collection->updateOne(
                ['_id' => new  \MongoDB\BSON\ObjectId($id)],
                ['$set' => ['category_name' => $data->category_name]]
            );

            if ($result->getModifiedCount() === 1) {
                return $this->respond(['message' => 'Kategori berhasil diupdate']);
            } else {
                return $this->failNotFound('Kategori tidak ditemukan');
            }
        } catch (\Exception $e) {
            return $this->fail('Gagal mengupdate kategori: ' . $e->getMessage(), 500);
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
