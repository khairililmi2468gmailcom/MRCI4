<?php

namespace App\Models;

use CodeIgniter\Model;

class TaskModel extends Model
{
    protected $table      = 'tb_task';
    protected $primaryKey = 'task_id';

    protected $allowedFields = ['modul_id', 'submodul_id', 'joblist', 'percentage', 'keterangan', 'prioritas'];

    protected $returnType     = 'array';
    protected $useSoftDeletes = false;

    protected $validationRules    = [];
    protected $validationMessages = [];
    protected $skipValidation     = false;
}
