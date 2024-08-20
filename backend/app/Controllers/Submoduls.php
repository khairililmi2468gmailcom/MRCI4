<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use MongoDB\Client;
use MongoDB\BSON\ObjectId;

class Submoduls extends ResourceController
{
    protected $format = 'json';
    protected $mongoDB;
    protected $collection;

    public function __construct()
    {
        $this->mongoDB = (new Client)->todo;
        $this->collection = $this->mongoDB->tb_submodul;
    }

    public function index()
    {
        try {
            $submoduls = $this->collection->find()->toArray();
            return $this->respond($submoduls);
        } catch (\Exception $e) {
            return $this->fail('Gagal terhubung ke database MongoDB: ' . $e->getMessage(), 500);
        }
    }

    public function show($modul_id = null)
    {
        try {
            $filter = [];
            $filter['modul_id'] = $modul_id;

            $submoduls = $this->collection->find($filter)->toArray();
            return $this->respond($submoduls);
        } catch (\Exception $e) {
            return $this->fail('Gagal terhubung ke database MongoDB: ' . $e->getMessage(), 500);
        }
    }

    public function getID($modul_id = null)
    {
        try {
            // Pastikan $modul_id diubah menjadi ObjectId
            $objectId = new \MongoDB\BSON\ObjectId($modul_id);

            $filter = ['_id' => $objectId];

            $submoduls = $this->mongoDB->tb_modul->find($filter)->toArray();
            if (!empty($submoduls)) {
                // Misalkan kita hanya mengambil dokumen pertama
                $submodul = $submoduls[0];
                return $this->respond($submodul);  // Pastikan ini mengembalikan objek yang sesuai
            } else {
                return $this->fail('Data tidak ditemukan', 404);
            }
        } catch (\Exception $e) {
            return $this->fail('Gagal terhubung ke database MongoDB: ' . $e->getMessage(), 500);
        }
    }


    public function create()
    {
        try {
            $data = $this->request->getJSON();

            // Pastikan modul_id dan nama_submodul ada dalam data yang diterima
            if (!isset($data->modul_id) || !isset($data->nama_submodul)) {
                return $this->fail('Data tidak lengkap', 400);
            }

            // Ambil nilai modul_id dan nama_submodul dari data yang diterima
            $modul_id = $data->modul_id;
            $nama_submodul = $data->nama_submodul;

            // Masukkan data ke dalam database
            $insertResult = $this->collection->insertOne([
                'modul_id' => $modul_id,
                'nama_submodul' => $nama_submodul,
                'created_at' => date('Y-m-d H:i:s')
            ]);

            // Periksa apakah data berhasil dimasukkan
            if ($insertResult->getInsertedCount() > 0) {
                $newSubmodul = $this->collection->findOne(['_id' => $insertResult->getInsertedId()]);
                return $this->respondCreated(['message' => 'Data submodul berhasil ditambahkan', 'data' => $newSubmodul]);
            } else {
                return $this->fail('Gagal menambahkan data submodul', 500);
            }
        } catch (\Exception $e) {
            return $this->fail('Gagal terhubung ke database MongoDB: ' . $e->getMessage(), 500);
        }
    }

    public function update($id = null)
    {
        try {
            if (!$id) {
                return $this->fail('ID submodul tidak valid', 400);
            }

            $data = $this->request->getJSON();

            // Pastikan modul_id dan nama_submodul ada dalam data yang diterima
            if (!isset($data->modul_id) || !isset($data->nama_submodul)) {
                return $this->fail('Data tidak lengkap', 400);
            }

            $result = $this->collection->updateOne(
                ['_id' => new \MongoDB\BSON\ObjectId($id)],
                [
                    '$set' => [
                        'modul_id' => $data->modul_id,
                        'nama_submodul' => $data->nama_submodul
                    ]
                ]
            );

            if ($result->getModifiedCount() === 1) {
                return $this->respond(['message' => 'Data submodul berhasil diupdate']);
            } else {
                return $this->failNotFound('Data submodul tidak ditemukan');
            }
        } catch (\Exception $e) {
            return $this->fail('Gagal mengupdate data submodul: ' . $e->getMessage(), 500);
        }
    }

    public function delete($id = null)
    {
        try {
            if (!$id) {
                return $this->fail('ID submodul tidak valid', 400);
            }

            $deleted = $this->collection->deleteOne(['_id' => new \MongoDB\BSON\ObjectId($id)]);

            if ($deleted->getDeletedCount() === 1) {
                return $this->respondDeleted(['message' => 'Data submodul berhasil dihapus']);
            } else {
                return $this->failNotFound('Data submodul tidak ditemukan');
            }
        } catch (\Exception $e) {
            return $this->fail('Gagal menghapus data submodul: ' . $e->getMessage(), 500);
        }
    }
}
