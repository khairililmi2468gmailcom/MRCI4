import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

function Todo() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/project/show');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Gagal mengambil data project: ', error);
    }
  };

  return (
    <MainLayout>
      <div className='container-lg px-4'>
        <div className="row">
          {projects.map((project) => (
            <div key={project._id.$oid} className="col-md-4 mb-3">
              <Link to={`/todo/otoritas/${project._id.$oid}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card" style={{ cursor: 'pointer' }}>
                  <div className="card-body">
                    <h5 className="card-title">{project.nama_project}</h5>
                    <p className="card-text mb-0">Deskripsi: {project.keterangan}</p>
                    <p className="card-text mb-0">Tanggal Mulai: {new Date(project.tanggal_mulai).toLocaleDateString('id-ID')}</p>
                    <p className="card-text mb-0">Estimasi Tanggal Selesai: {new Date(project.estimasi_tanggal_selesai).toLocaleDateString('id-ID')}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

export default Todo;
