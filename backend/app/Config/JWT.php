<?php

namespace Config;

class Jwt
{
    public $key = 'R2Y!f*5NwF9%vA@Qp@UeJ^#bDkKpT7h!'; // Ganti dengan kunci rahasia Anda
    public $algorithm = 'HS256';
    public $validFor = 3600; // Waktu kedaluwarsa dalam detik (satu jam)
}
