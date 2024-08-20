<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use MongoDB\Client;
use MongoDB\BSON\ObjectId;

class User extends ResourceController
{
    protected $format = 'json';
    protected $mongoDB;
    protected $collection;

    public function __construct()
    {
        $this->mongoDB = (new Client)->todo;
        $this->collection = $this->mongoDB->tb_user;
    }

    public function index()
    {
        try {
            $user = $this->collection->find()->toArray();
            return $this->respond($user);
        } catch (\Exception $e) {
            return $this->fail('Gagal terhubung ke database MongoDB: ' . $e->getMessage(), 500);
        }
    }

    public function show($id = null)
    {
        try {
            if ($id) {
                $user = $this->collection->findOne(['_id' => new \MongoDB\BSON\ObjectId($id)]);
                if ($user) {
                    return $this->respond($user);
                } else {
                    return $this->failNotFound('User not found');
                }
            } else {
                $users = $this->collection->find(['status' => 'active'])->toArray();
                return $this->respond($users);
            }
        } catch (\Exception $e) {
            return $this->fail('Gagal terhubung ke database MongoDB: ' . $e->getMessage(), 500);
        }
    }

    public function datatables()
    {
        try {
            $limit = intval($this->request->getGet('length'));
            $offset = intval($this->request->getGet('start'));
            $user = $this->collection->find([], ['limit' => $limit, 'skip' => $offset])->toArray();
            $totalData = $this->collection->countDocuments();
            $data = [
                'draw' => intval($this->request->getGet('draw')),
                'recordsTotal' => $totalData,
                'recordsFiltered' => $totalData,
                'data' => $user
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

            // Pastikan semua field yang diperlukan ada dalam data yang diterima
            $requiredFields = ['nama', 'email', 'hp', 'username', 'password', 'level', 'access_key', 'status'];
            foreach ($requiredFields as $field) {
                if (!isset($data->$field)) {
                    return $this->fail('Harap lengkapi semua field yang diperlukan', 400);
                }
            }

            // Tambahkan nilai created_at
            $data->created_at = date('Y-m-d H:i:s');

            // Ambil nilai-nilai field dari data yang diterima
            $fields = [];
            foreach ($requiredFields as $field) {
                $fields[$field] = $data->$field;
            }

            // Masukkan data ke dalam database
            $insertResult = $this->collection->insertOne($fields);

            // Periksa apakah data berhasil dimasukkan
            if ($insertResult->getInsertedCount() > 0) {
                $newData = $this->collection->findOne(['_id' => $insertResult->getInsertedId()]);
                return $this->respondCreated(['message' => 'Data berhasil ditambahkan', 'data' => $newData]);
            } else {
                return $this->fail('Gagal menambahkan data', 500);
            }
        } catch (\Exception $e) {
            return $this->fail('Gagal terhubung ke database MongoDB: ' . $e->getMessage(), 500);
        }
    }

    public function update($id = null)
    {
        try {
            if (!$id) {
                return $this->fail('ID User tidak valid', 400);
            }

            $data = $this->request->getJSON();

            // Pastikan semua field yang diperlukan ada dalam data yang diterima
            $requiredFields = ['nama', 'email', 'hp', 'username', 'level', 'access_key', 'status'];
            foreach ($requiredFields as $field) {
                if (!isset($data->$field)) {
                    return $this->fail('Harap lengkapi semua field yang diperlukan', 400);
                }
            }

            $updateFields = [];
            foreach ($requiredFields as $field) {
                // Jika password tidak kosong, enkripsi password baru
                if ($field === 'password' && !empty($data->password)) {
                    $hashedPassword = password_hash($data->password, PASSWORD_DEFAULT);
                    $updateFields[$field] = $hashedPassword;
                } else {
                    $updateFields[$field] = $data->$field;
                }
            }

            $result = $this->collection->updateOne(
                ['_id' => new \MongoDB\BSON\ObjectId($id)],
                ['$set' => $updateFields]
            );

            if ($result->getModifiedCount() === 1) {
                return $this->respond(['message' => 'Data User berhasil diupdate']);
            } else {
                return $this->failNotFound('Tidak ada yang diupdate');
            }
        } catch (\Exception $e) {
            return $this->fail('Gagal mengupdate data user: ' . $e->getMessage(), 500);
        }
    }

    public function delete($id = null)
    {
        try {
            if (!$id) {
                return $this->fail('ID User tidak valid', 400);
            }

            $deleted = $this->collection->deleteOne(['_id' => new \MongoDB\BSON\ObjectId($id)]);

            if ($deleted->getDeletedCount() === 1) {
                return $this->respondDeleted(['message' => 'User berhasil dihapus']);
            } else {
                return $this->failNotFound('User tidak ditemukan');
            }
        } catch (\Exception $e) {
            return $this->fail('Gagal menghapus User: ' . $e->getMessage(), 500);
        }
    }
}
