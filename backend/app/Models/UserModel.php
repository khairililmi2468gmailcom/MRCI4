<?php

namespace App\Models;

use CodeIgniter\Model;

class UserModel extends Model
{
    protected $table = 'tb_user';

    protected $primaryKey = '_id';

    protected $useTimestamps = true;

    protected $allowedFields = ['nama', 'email', 'hp', 'username', 'password', 'level', 'access_key', 'status', 'created_at'];

    protected $validationRules    = [
        'nama'     => 'required',
        'email'    => 'required|valid_email',
        'hp'       => 'required',
        'username' => 'required',
        'password' => 'required',
        'level'    => 'required|in_list[Admin,User]',
        'status'   => 'required|in_list[On,Off]',
    ];

    protected $validationMessages = [
        'nama' => [
            'required' => 'Nama harus diisi'
        ],
        'email' => [
            'required'    => 'Email harus diisi',
            'valid_email' => 'Email tidak valid'
        ],
        'hp' => [
            'required' => 'Nomor HP harus diisi'
        ],
        'username' => [
            'required' => 'Username harus diisi'
        ],
        'password' => [
            'required' => 'Password harus diisi'
        ],
        'level' => [
            'required' => 'Level harus diisi',
            'in_list'  => 'Level harus Admin atau User'
        ],
        'status' => [
            'required' => 'Status harus diisi',
            'in_list'  => 'Status harus On atau Off'
        ],
    ];

    protected $returnType     = 'object';

    protected $useSoftDeletes = false;

    protected $skipValidation = false;

    // Mengubah query menjadi MongoDB
    protected $useMongoDB = true;

    protected $dateFormat = 'datetime';
}
