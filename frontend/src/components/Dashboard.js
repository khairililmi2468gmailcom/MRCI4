import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import MainLayout from '../layouts/MainLayout';
import Chart from 'react-apexcharts';

function Dashboard() {
  const [projectByCategory, setProjectByCategory] = useState([]);
  const [projectStatus, setProjectStatus] = useState({});
  const [projectCountByMonth, setProjectCountByMonth] = useState({});
  const [userLevel, setUserLevel] = useState({});

  useEffect(() => {
    // Ambil data untuk grafik project per kategori
    $.ajax({
      url: 'http://localhost:8080/api/dashboard/project-by-category',
      method: 'GET',
      success: function (response) {
        setProjectByCategory(response.data);
      }
    });

    // Ambil data untuk grafik persentase status project
    $.ajax({
      url: 'http://localhost:8080/api/dashboard/project-status',
      method: 'GET',
      success: function (response) {
        setProjectStatus(response.data);
      }
    });

    // Ambil data untuk grafik perkembangan jumlah project per bulan
    $.ajax({
      url: 'http://localhost:8080/api/dashboard/project-count-by-month',
      method: 'GET',
      success: function (response) {
        setProjectCountByMonth(response.data);
      }
    });

    // Ambil data untuk grafik persentase level user
    $.ajax({
      url: 'http://localhost:8080/api/dashboard/user-level',
      method: 'GET',
      success: function (response) {
        setUserLevel(response.data);
      }
    });
  }, []);

  return (
    <MainLayout>
      <div className='container-lg px-4'>
        <div className='row mb-4'>
          <div className='col-md-6 d-flex'>
            <div className="card w-100">
              <div className="card-body">
                <h5 className="card-title">Project per Kategori</h5>
                {projectByCategory.length > 0 && (
                  <Chart
                    options={{
                      chart: {
                        type: 'bar',
                        height: 350,
                      },
                      plotOptions: {
                        bar: {
                          horizontal: true,
                        },
                      },
                      dataLabels: {
                        enabled: false,
                      },
                      xaxis: {
                        categories: projectByCategory.map(item => item._id),
                      },
                    }}
                    series={[{
                      name: 'Jumlah Project',
                      data: projectByCategory.map(item => item.project_count),
                    }]}
                    type="bar"
                    height={350}
                  />
                )}
              </div>
            </div>
          </div>
          <div className='col-md-6 d-flex'>
            <div className="card w-100">
              <div className="card-body">
                <h5 className="card-title">Status Project</h5>
                {projectStatus.hasOwnProperty('on_progress') && (
                  <Chart
                    options={{
                      chart: {
                        type: 'donut',
                        height: 350,
                      },
                      labels: ['On Progress', 'Finished'],
                    }}
                    series={[projectStatus.on_progress, projectStatus.finished]}
                    type="donut"
                    height={350}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='row mb-4'>
          <div className='col-md-6 d-flex'>
            <div className="card w-100">
              <div className="card-body">
                <h5 className="card-title">Perkembangan Project per Bulan</h5>
                {Object.keys(projectCountByMonth).length > 0 && (
                  <Chart
                    options={{
                      chart: {
                        type: 'line',
                        height: 350,
                      },
                      xaxis: {
                        categories: Object.keys(projectCountByMonth),
                      },
                    }}
                    series={[{
                      name: 'Jumlah Project',
                      data: Object.values(projectCountByMonth),
                    }]}
                    type="line"
                    height={350}
                  />
                )}
              </div>
            </div>
          </div>
          <div className='col-md-6 d-flex'>
            <div className="card w-100">
              <div className="card-body">
                <h5 className="card-title">Level User</h5>
                {userLevel.hasOwnProperty('admin') && (
                  <Chart
                    options={{
                      chart: {
                        type: 'donut',
                        height: 350,
                      },
                      labels: ['Admin', 'User'],
                    }}
                    series={[userLevel.admin, userLevel.user]}
                    type="donut"
                    height={350}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Dashboard;
