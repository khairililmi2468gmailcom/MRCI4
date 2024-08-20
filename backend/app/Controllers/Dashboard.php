<?php

namespace App\Controllers;

use CodeIgniter\API\ResponseTrait;

class Dashboard extends BaseController
{
    use ResponseTrait;

    protected $collection;

    public function __construct()
    {
        $this->collection = (new \MongoDB\Client)->todo->tb_project;
    }

    public function projectByCategory()
    {
        try {
            $pipeline = [
                [
                    '$lookup' => [
                        'from' => 'tb_kategori',
                        'localField' => 'nama_kategori',
                        'foreignField' => 'category_name',
                        'as' => 'category'
                    ]
                ],
                [
                    '$unwind' => '$category'
                ],
                [
                    '$group' => [
                        '_id' => '$category.category_name',
                        'project_count' => ['$sum' => 1]
                    ]
                ]
            ];

            $result = $this->collection->aggregate($pipeline)->toArray();

            return $this->respond(['data' => $result]);
        } catch (\Exception $e) {
            return $this->fail('Gagal mengambil data project per kategori: ' . $e->getMessage(), 500);
        }
    }

    public function projectStatus()
    {
        try {
            $pipeline = [
                [
                    '$group' => [
                        '_id' => '$project_status',
                        'count' => ['$sum' => 1]
                    ]
                ]
            ];

            $result = $this->collection->aggregate($pipeline)->toArray();

            $data = [
                'on_progress' => 0,
                'finished' => 0
            ];

            foreach ($result as $item) {
                if ($item->_id == 'On Progress') {
                    $data['on_progress'] = $item->count;
                } elseif ($item->_id == 'Finished') {
                    $data['finished'] = $item->count;
                }
            }

            return $this->respond(['data' => $data]);
        } catch (\Exception $e) {
            return $this->fail('Gagal mengambil data status project: ' . $e->getMessage(), 500);
        }
    }

    public function projectCountByMonth()
    {
        try {
            $pipeline = [
                [
                    '$addFields' => [
                        'tanggal_mulai' => ['$toDate' => '$tanggal_mulai']
                    ]
                ],
                [
                    '$group' => [
                        '_id' => ['$month' => '$tanggal_mulai'],
                        'project_count' => ['$sum' => 1]
                    ]
                ],
                [
                    '$project' => [
                        'bulan' => '$_id',
                        'project_count' => 1
                    ]
                ]
            ];

            $result = $this->collection->aggregate($pipeline)->toArray();
            $data = [];

            foreach ($result as $item) {
                $bulan = '';
                switch ($item->bulan) {
                    case 1:
                        $bulan = 'Januari';
                        break;
                    case 2:
                        $bulan = 'Februari';
                        break;
                    case 3:
                        $bulan = 'Maret';
                        break;
                    case 4:
                        $bulan = 'April';
                        break;
                    case 5:
                        $bulan = 'Mei';
                        break;
                    case 6:
                        $bulan = 'Juni';
                        break;
                    case 7:
                        $bulan = 'Juli';
                        break;
                    case 8:
                        $bulan = 'Agustus';
                        break;
                    case 9:
                        $bulan = 'September';
                        break;
                    case 10:
                        $bulan = 'Oktober';
                        break;
                    case 11:
                        $bulan = 'November';
                        break;
                    case 12:
                        $bulan = 'Desember';
                        break;
                }

                $data[$bulan] = $item->project_count;
            }

            return $this->respond(['data' => $data]);
        } catch (\Exception $e) {
            return $this->fail('Gagal mengambil data jumlah project per bulan: ' . $e->getMessage(), 500);
        }
    }


    public function userLevel()
    {
        $tabel = (new \MongoDB\Client)->todo->tb_user;

        try {
            $pipeline = [
                [
                    '$match' => [
                        'level' => [
                            '$in' => ['User', 'Admin']
                        ]
                    ]
                ],
                [
                    '$group' => [
                        '_id' => '$level',
                        'count' => ['$sum' => 1]
                    ]
                ]
            ];

            $result = $tabel->aggregate($pipeline)->toArray();
            $data = [
                'admin' => 0,
                'user' => 0
            ];
            foreach ($result as $item) {
                if ($item->_id == 'Admin') {
                    $data['admin'] = $item->count;
                } elseif ($item->_id == 'User') {
                    $data['user'] = $item->count;
                }
            }

            return $this->respond(['data' => $data]);
        } catch (\Exception $e) {
            return $this->fail('Gagal mengambil data level user: ' . $e->getMessage(), 500);
        }
    }
}
