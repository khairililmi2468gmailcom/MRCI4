<?php

namespace App\Models;

use CodeIgniter\Model;

class ModulModel extends Model
{
    protected $table      = 'tb_modul';
    protected $primaryKey = 'modul_id';

    protected $allowedFields = ['otoritas_id', 'nama_modul', 'has_sub_modul'];

    protected $returnType     = 'array';
    protected $useSoftDeletes = false;

    protected $validationRules    = [];
    protected $validationMessages = [];
    protected $skipValidation     = false;
}
