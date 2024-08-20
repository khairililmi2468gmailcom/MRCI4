<?php

namespace App\Models;

use CodeIgniter\Model;

class ProjectModel extends Model
{
    protected $table      = 'tb_project';
    protected $primaryKey = 'project_id';

    protected $allowedFields = ['user_id', 'category_id', 'project_name', 'project_type', 'keterangan', 'lama_pengerjaan', 'tanggal_mulai', 'estimasi_tanggal_selesai', 'project_status', 'created_at'];

    protected $returnType     = 'array';
    protected $useSoftDeletes = false;

    protected $validationRules    = [];
    protected $validationMessages = [];
    protected $skipValidation     = false;
}
