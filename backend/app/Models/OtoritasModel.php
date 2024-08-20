<?php

namespace App\Models;

use CodeIgniter\Model;

class OtoritasModel extends Model
{
    protected $table      = 'tb_otoritas';
    protected $primaryKey = 'otoritas_id';

    protected $allowedFields = ['project_id', 'nama_otoritas', 'created_at'];

    protected $returnType     = 'array';
    protected $useSoftDeletes = false;

    protected $validationRules    = [];
    protected $validationMessages = [];
    protected $skipValidation     = false;
}
