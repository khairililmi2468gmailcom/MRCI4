<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use MongoDB\Client;
use MongoDB\BSON\ObjectId;

class Tasks extends ResourceController
{
    protected $format = 'json';
    protected $mongoDB;
    protected $collection;

    public function __construct()
    {
        $this->mongoDB = (new Client)->todo;
        $this->collection = $this->mongoDB->tb_task;
    }

    public function index()
    {
        try {
            $tasks = $this->collection->find()->toArray();
            return $this->respond($tasks);
        } catch (\Exception $e) {
            return $this->fail('Gagal terhubung ke database MongoDB: ' . $e->getMessage(), 500);
        }
    }

    public function show($modul_id = null)
    {
        try {
            $filter = [];
            $filter['modul_id'] = $modul_id;

            $tasks = $this->collection->find($filter)->toArray();
            return $this->respond($tasks);
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

            $tasks = $this->mongoDB->tb_modul->find($filter)->toArray();
            if (!empty($tasks)) {
                // Misalkan kita hanya mengambil dokumen pertama
                $task = $tasks[0];
                return $this->respond($task);  // Pastikan ini mengembalikan objek yang sesuai
            } else {
                return $this->fail('Data tidak ditemukan', 404);
            }
        } catch (\Exception $e) {
            return $this->fail('Gagal terhubung ke database MongoDB: ' . $e->getMessage(), 500);
        }
    }

    public function getIDV2($modul_id = null)
    {
        try {
            // Pastikan $modul_id diubah menjadi ObjectId
            $objectId = new \MongoDB\BSON\ObjectId($modul_id);

            $filter = ['_id' => $objectId];

            $tasks = $this->mongoDB->tb_submodul->find($filter)->toArray();
            if (!empty($tasks)) {
                // Misalkan kita hanya mengambil dokumen pertama
                $task = $tasks[0];
                return $this->respond($task);  // Pastikan ini mengembalikan objek yang sesuai
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

            // Pastikan modul_id, submodul_id, joblist, percentage, keterangan, dan prioritas ada dalam data yang diterima
            if (!isset($data->modul_id) || !isset($data->submodul_id) || !isset($data->joblist) || !isset($data->percentage) || !isset($data->keterangan) || !isset($data->prioritas)) {
                return $this->fail('Data tidak lengkap', 400);
            }

            // Ambil nilai modul_id, submodul_id, joblist, percentage, keterangan, dan prioritas dari data yang diterima
            $modul_id = $data->modul_id;
            $submodul_id = $data->submodul_id;
            $joblist = $data->joblist;
            $percentage = $data->percentage;
            $keterangan = $data->keterangan;
            $prioritas = $data->prioritas;

            // Masukkan data ke dalam database
            $insertResult = $this->collection->insertOne([
                'modul_id' => $modul_id,
                'submodul_id' => $submodul_id,
                'joblist' => $joblist,
                'percentage' => $percentage,
                'keterangan' => $keterangan,
                'prioritas' => $prioritas,
                'created_at' => date('Y-m-d H:i:s')
            ]);

            // Periksa apakah data berhasil dimasukkan
            if ($insertResult->getInsertedCount() > 0) {
                $newTask = $this->collection->findOne(['_id' => $insertResult->getInsertedId()]);
                return $this->respondCreated(['message' => 'Data task berhasil ditambahkan', 'data' => $newTask]);
            } else {
                return $this->fail('Gagal menambahkan data task', 500);
            }
        } catch (\Exception $e) {
            return $this->fail('Gagal terhubung ke database MongoDB: ' . $e->getMessage(), 500);
        }
    }

    public function update($id = null)
    {
        try {
            if (!$id) {
                return $this->fail('ID task tidak valid', 400);
            }

            $data = $this->request->getJSON();

            // Pastikan modul_id, submodul_id, joblist, percentage, keterangan, dan prioritas ada dalam data yang diterima
            if (!isset($data->modul_id) || !isset($data->submodul_id) || !isset($data->joblist) || !isset($data->percentage) || !isset($data->keterangan) || !isset($data->prioritas)) {
                return $this->fail('Data tidak lengkap', 400);
            }

            $result = $this->collection->updateOne(
                ['_id' => new \MongoDB\BSON\ObjectId($id)],
                [
                    '$set' => [
                        'modul_id' => $data->modul_id,
                        'submodul_id' => $data->submodul_id,
                        'joblist' => $data->joblist,
                        'percentage' => $data->percentage,
                        'keterangan' => $data->keterangan,
                        'prioritas' => $data->prioritas
                    ]
                ]
            );

            if ($result->getModifiedCount() === 1) {
                return $this->respond(['message' => 'Data task berhasil diupdate']);
            } else {
                return $this->failNotFound('Data task tidak ditemukan');
            }
        } catch (\Exception $e) {
            return $this->fail('Gagal mengupdate data task: ' . $e->getMessage(), 500);
        }
    }

    public function delete($id = null)
    {
        try {
            if (!$id) {
                return $this->fail('ID task tidak valid', 400);
            }

            $deleted = $this->collection->deleteOne(['_id' => new \MongoDB\BSON\ObjectId($id)]);

            if ($deleted->getDeletedCount() === 1) {
                return $this->respondDeleted(['message' => 'Data task berhasil dihapus']);
            } else {
                return $this->failNotFound('Data task tidak ditemukan');
            }
        } catch (\Exception $e) {
            return $this->fail('Gagal menghapus data task: ' . $e->getMessage(), 500);
        }
    }
}
