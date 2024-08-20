<?php

namespace App\Models;

use CodeIgniter\Model;

class CategoryModel extends Model
{
    protected $table      = 'tb_kategori';
    protected $primaryKey = 'category_id';

    protected $allowedFields = ['category_name'];

    protected $returnType     = 'array';
    protected $useSoftDeletes = false;

    protected $validationRules    = [];
    protected $validationMessages = [];
    protected $skipValidation     = false;
}
