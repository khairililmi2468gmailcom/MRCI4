<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use MongoDB\Client;
use MongoDB\BSON\ObjectId;

class Moduls extends ResourceController
{
    protected $format = 'json';
    protected $mongoDB;
    protected $collection;

    public function __construct()
    {
        $this->mongoDB = (new Client)->todo;
        $this->collection = $this->mongoDB->tb_modul;
    }

    public function index()
    {
        try {
            $moduls = $this->collection->find()->toArray();
            return $this->respond($moduls);
        } catch (\Exception $e) {
            return $this->fail('Gagal terhubung ke database MongoDB: ' . $e->getMessage(), 500);
        }
    }

    public function show($otoritas_id = null)
    {
        try {
            $filter = [];
            $filter['otoritas_id'] = $otoritas_id;

            $moduls = $this->collection->find($filter)->toArray();
            return $this->respond($moduls);
        } catch (\Exception $e) {
            return $this->fail('Gagal terhubung ke database MongoDB: ' . $e->getMessage(), 500);
        }
    }

    public function getID($otoritas_id = null)
    {
        try {
            // Pastikan $otoritas_id diubah menjadi ObjectId
            $objectId = new \MongoDB\BSON\ObjectId($otoritas_id);

            $filter = ['_id' => $objectId];

            $moduls = $this->mongoDB->tb_otoritas->find($filter)->toArray();
            if (!empty($moduls)) {
                // Misalkan kita hanya mengambil dokumen pertama
                $modul = $moduls[0];
                return $this->respond($modul);  // Pastikan ini mengembalikan objek yang sesuai
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

            // Pastikan otoritas_id, nama_modul, dan has_sub_modul ada dalam data yang diterima
            if (!isset($data->otoritas_id) || !isset($data->nama_modul)) {
                return $this->fail('Data tidak lengkap', 400);
            }

            // Ambil nilai otoritas_id, nama_modul, dan has_sub_modul dari data yang diterima
            $otoritas_id = $data->otoritas_id;
            $nama_modul = $data->nama_modul;
            $has_sub_modul = $data->has_sub_modul;

            // Masukkan data ke dalam database
            $insertResult = $this->collection->insertOne([
                'otoritas_id' => $otoritas_id,
                'nama_modul' => $nama_modul,
                'has_sub_modul' => $has_sub_modul,
                'created_at' => date('Y-m-d H:i:s')
            ]);

            // Periksa apakah data berhasil dimasukkan
            if ($insertResult->getInsertedCount() > 0) {
                $newModul = $this->collection->findOne(['_id' => $insertResult->getInsertedId()]);
                return $this->respondCreated(['message' => 'Data modul berhasil ditambahkan', 'data' => $newModul]);
            } else {
                return $this->fail('Gagal menambahkan data modul', 500);
            }
        } catch (\Exception $e) {
            return $this->fail('Gagal terhubung ke database MongoDB: ' . $e->getMessage(), 500);
        }
    }

    public function update($id = null)
    {
        try {
            if (!$id) {
                return $this->fail('ID modul tidak valid', 400);
            }

            $data = $this->request->getJSON();

            // Pastikan otoritas_id, nama_modul, dan has_sub_modul ada dalam data yang diterima
            if (!isset($data->otoritas_id) || !isset($data->nama_modul) || !isset($data->has_sub_modul)) {
                return $this->fail('Data tidak lengkap', 400);
            }

            $result = $this->collection->updateOne(
                ['_id' => new \MongoDB\BSON\ObjectId($id)],
                [
                    '$set' => [
                        'otoritas_id' => $data->otoritas_id,
                        'nama_modul' => $data->nama_modul,
                        'has_sub_modul' => $data->has_sub_modul
                    ]
                ]
            );

            if ($result->getModifiedCount() === 1) {
                return $this->respond(['message' => 'Data modul berhasil diupdate']);
            } else {
                return $this->failNotFound('Data modul tidak ditemukan');
            }
        } catch (\Exception $e) {
            return $this->fail('Gagal mengupdate data modul: ' . $e->getMessage(), 500);
        }
    }

    public function delete($id = null)
    {
        try {
            if (!$id) {
                return $this->fail('ID modul tidak valid', 400);
            }

            $deleted = $this->collection->deleteOne(['_id' => new \MongoDB\BSON\ObjectId($id)]);

            if ($deleted->getDeletedCount() === 1) {
                return $this->respondDeleted(['message' => 'Data modul berhasil dihapus']);
            } else {
                return $this->failNotFound('Data modul tidak ditemukan');
            }
        } catch (\Exception $e) {
            return $this->fail('Gagal menghapus data modul: ' . $e->getMessage(), 500);
        }
    }
}
