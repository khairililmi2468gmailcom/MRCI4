<?php

namespace App\Models;

use CodeIgniter\Model;

class SubmodulModel extends Model
{
    protected $table      = 'tb_submodul';
    protected $primaryKey = 'submodul_id';

    protected $allowedFields = ['modul_id', 'nama_submodul'];

    protected $returnType     = 'array';
    protected $useSoftDeletes = false;

    protected $validationRules    = [];
    protected $validationMessages = [];
    protected $skipValidation     = false;
}
