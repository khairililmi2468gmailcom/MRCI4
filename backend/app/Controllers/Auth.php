<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;
use \Firebase\JWT\JWT;
use CodeIgniter\API\ResponseTrait;
use MongoDB\Client;
use MongoDB\Driver\Exception\Exception as MongoDBException;

class Auth extends BaseController
{
    use ResponseTrait;

    private $mongoDB;
    private $collection;

    public function __construct()
    {
        $this->mongoDB = (new Client)->todo;
        $this->collection = $this->mongoDB->tb_user;
    }

    public function register()
    {
        // Validasi inputan
        $rules = [
            'username' => 'required|min_length[4]',
            'password' => 'required|min_length[4]|max_length[255]'
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        try {
            // Hash password sebelum disimpan
            $hashedPassword = password_hash($this->request->getVar('password'), PASSWORD_DEFAULT);

            $result = $this->collection->insertOne([
                'username' => $this->request->getVar('username'),
                'password' => $hashedPassword
            ]);

            if (!$result) {
                return $this->fail('Gagal menyimpan data pengguna', 500);
            }

            // Buat token JWT
            $token = $this->generateJWT($this->request->getVar('username'));

            return $this->respond(['token' => $token]);
        } catch (\Exception $e) {
            return $this->fail('Gagal terhubung ke database MongoDB: ' . $e->getMessage(), 500);
        }
    }

    public function login()
    {
        // Validasi inputan
        $rules = [
            'username'  => 'required',
            'password' => 'required|min_length[4]|max_length[255]'
        ];

        if (!$this->validate($rules)) {
            return $this->respond(['error' => $this->validator->getErrors()], 400);
        }

        try {
            // Cari pengguna berdasarkan username
            $user = $this->collection->findOne(['username' => $this->request->getVar('username')]);

            // Periksa apakah pengguna ditemukan dan password cocok
            if (!$user || !password_verify($this->request->getVar('password'), $user->password)) {
                return $this->fail('Username atau password salah', 401);
            }

            // Buat token JWT
            $token = $this->generateJWT($this->request->getVar('username'));

            // Kirim data pengguna dalam format JSON
            return $this->respond(['token' => $token, 'user' => $user]);
        } catch (\Exception $e) {
            return $this->fail('Gagal terhubung ke database MongoDB: ' . $e->getMessage(), 500);
        }
    }

    private function generateJWT($username)
    {
        $jwt = new \Config\Jwt();
        $issuedAt = time();
        $expirationTime = $issuedAt + $jwt->validFor;
        $payload = [
            'username' => $username,
            'iat' => $issuedAt,
            'exp' => $expirationTime
        ];
        return JWT::encode($payload, $jwt->key, $jwt->algorithm);
    }

    public function index()
    {
        //
    }
}
