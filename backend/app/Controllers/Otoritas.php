<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use MongoDB\Client;
use MongoDB\BSON\ObjectId;

class Otoritas extends ResourceController
{
    protected $format = 'json';
    protected $mongoDB;
    protected $collection;

    public function __construct()
    {
        $this->mongoDB = (new Client)->todo;
        $this->collection = $this->mongoDB->tb_otoritas;
    }

    public function index()
    {
        try {
            $otoritas = $this->collection->find()->toArray();
            return $this->respond($otoritas);
        } catch (\Exception $e) {
            return $this->fail('Gagal terhubung ke database MongoDB: ' . $e->getMessage(), 500);
        }
    }

    public function show($id = null)
    {
        try {
            $filter = [];
            $filter['project_id'] = $id;

            $projects = $this->collection->find($filter)->toArray();
            return $this->respond($projects);
        } catch (\Exception $e) {
            return $this->fail('Gagal terhubung ke database MongoDB: ' . $e->getMessage(), 500);
        }
    }

    public function create()
    {
        try {
            $data = $this->request->getJSON();

            // Pastikan project_id, nama_otoritas, dan created_at ada dalam data yang diterima
            if (!isset($data->project_id) || !isset($data->nama_otoritas)) {
                return $this->fail('Data tidak lengkap', 400);
            }

            // Ambil nilai project_id, nama_otoritas, dan created_at dari data yang diterima
            $project_id = $data->project_id;
            $nama_otoritas = $data->nama_otoritas;

            // Masukkan data ke dalam database
            $insertResult = $this->collection->insertOne([
                'project_id' => $project_id,
                'nama_otoritas' => $nama_otoritas,
                'created_at' => date('Y-m-d H:i:s')
            ]);

            // Periksa apakah data berhasil dimasukkan
            if ($insertResult->getInsertedCount() > 0) {
                $newOtoritas = $this->collection->findOne(['_id' => $insertResult->getInsertedId()]);
                return $this->respondCreated(['message' => 'Data otoritas berhasil ditambahkan', 'data' => $newOtoritas]);
            } else {
                return $this->fail('Gagal menambahkan data otoritas', 500);
            }
        } catch (\Exception $e) {
            return $this->fail('Gagal terhubung ke database MongoDB: ' . $e->getMessage(), 500);
        }
    }

    public function update($id = null)
    {
        try {
            if (!$id) {
                return $this->fail('ID otoritas tidak valid', 400);
            }

            $data = $this->request->getJSON();

            // Pastikan project_id, nama_otoritas, dan created_at ada dalam data yang diterima
            if (!isset($data->project_id) || !isset($data->nama_otoritas)) {
                return $this->fail('Data tidak lengkap', 400);
            }

            $result = $this->collection->updateOne(
                ['_id' => new  \MongoDB\BSON\ObjectId($id)],
                [
                    '$set' => [
                        'project_id' => $data->project_id,
                        'nama_otoritas' => $data->nama_otoritas
                    ]
                ]
            );

            if ($result->getModifiedCount() === 1) {
                return $this->respond(['message' => 'Data otoritas berhasil diupdate']);
            } else {
                return $this->failNotFound('Data otoritas tidak ditemukan');
            }
        } catch (\Exception $e) {
            return $this->fail('Gagal mengupdate data otoritas: ' . $e->getMessage(), 500);
        }
    }

    public function delete($id = null)
    {
        try {
            if (!$id) {
                return $this->fail('ID otoritas tidak valid', 400);
            }

            $deleted = $this->collection->deleteOne(['_id' => new \MongoDB\BSON\ObjectId($id)]);

            if ($deleted->getDeletedCount() === 1) {
                return $this->respondDeleted(['message' => 'Data otoritas berhasil dihapus']);
            } else {
                return $this->failNotFound('Data otoritas tidak ditemukan');
            }
        } catch (\Exception $e) {
            return $this->fail('Gagal menghapus data otoritas: ' . $e->getMessage(), 500);
        }
    }
}
