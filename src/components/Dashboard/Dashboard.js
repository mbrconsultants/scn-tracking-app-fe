import React, { useState, useEffect, useContext } from "react";
import CountUp from "react-countup";
import ReactApexChart from "react-apexcharts";
import { Breadcrumb, Col, Row, Card, Table, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Context } from "../../context/Context";
import endpoint from "../../context/endpoint";


export default function Dashboard() {

  const { user } = useContext(Context);
  // const userRole = user.user.role_id;

  // State for chart data and file tracking data
  const [chartData, setChartData] = useState({
    series: [{
      name: 'Files Processed',
      data: [30, 40, 35, 50, 49, 60, 70, 91, 125, 100, 110, 120]
    }],
    options: {
      chart: {
        height: 350,
        type: 'area',
        toolbar: {
          show: false
        }
      },
      colors: ['#4e73df'],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm'
        },
      },
    }
  });

  const [recentFiles, setRecentFiles] = useState([
    { id: 1, name: 'Project_Proposal.pdf', status: 'Processed', date: '2023-10-15' },
    { id: 2, name: 'Financial_Report.xlsx', status: 'In Review', date: '2023-10-14' },
    { id: 3, name: 'Client_Contract.docx', status: 'Pending', date: '2023-10-13' },
    { id: 4, name: 'Technical_Specs.pdf', status: 'Processed', date: '2023-10-12' },
    { id: 5, name: 'Meeting_Minutes.docx', status: 'Rejected', date: '2023-10-11' }
  ]);

  const [systemStats, setSystemStats] = useState({
    totalFiles: 1248,
    processedFiles: 892,
    pendingFiles: 213,
    users: 48
  });

  // Simulate loading data
  useEffect(() => {
    // In a real app, you would fetch this data from an API
    const timer = setTimeout(() => {
      setSystemStats({
        totalFiles: 1562,
        processedFiles: 1204,
        pendingFiles: 231,
        users: 52
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Function to get badge variant based on status
  const getStatusVariant = (status) => {
    switch (status) {
      case 'Processed': return 'success';
      case 'In Review': return 'primary';
      case 'Pending': return 'warning';
      case 'Rejected': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '5px' }}>
        <div>
          <h1 className="page-title text-center" style={{ fontSize: '1.8rem', marginBottom: '5px' }}>SCN FILE TRACKING SYSTEM</h1>
          <Breadcrumb className="justify-content-center">
            <Breadcrumb.Item href="#">
              Home /
            </Breadcrumb.Item>
            <Breadcrumb.Item active>
              {/* Dashboard  */}
               {`${user.user.first_name} ${user.user.middle_name} ${user.user.surname}`}
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      
          {/* First Row - Two Stats Cards */}
      <Row className="mb-1">
        <Col lg={6} md={6} sm={12} className="mb-1">
          <Card className="overflow-hidden" style={{ backgroundColor: '#4e8de6', border: 'none', borderRadius: '6px' }}> {/* Even darker blue */}
            <Card.Body className="card-body">
              <Row>
                <div className="col">
                  <h6 className="" style={{ color: 'white' }}>Total Files</h6>
                  <h3 className="mb-2 number-font" style={{ color: 'white' }}>
                    <CountUp
                      end={systemStats.totalFiles}
                      separator=","
                      start={0}
                      duration={2.5}
                    />
                  </h3>
                </div>
                <div className="col col-auto">
                  <div className="counter-icon bg-primary box-shadow-primary brround ms-auto" style={{ backgroundColor: '#3a67c9', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fa fa-file text-white"></i>
                  </div>
                </div>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={6} md={6} sm={12} className="mb-1">
          <Card className="overflow-hidden" style={{ backgroundColor: '#3cb878', border: 'none', borderRadius: '6px' }}> {/* Even darker green */}
            <Card.Body className="card-body">
              <Row>
                <div className="col">
                  <h6 className="" style={{ color: 'white' }}>Processed Files</h6>
                  <h3 className="mb-2 number-font" style={{ color: 'white' }}>
                    <CountUp
                      end={systemStats.processedFiles}
                      separator=","
                      start={0}
                      duration={2.5}
                    />
                  </h3>
                </div>
                <div className="col col-auto">
                  <div className="counter-icon bg-success box-shadow-success brround ms-auto" style={{ backgroundColor: '#2a9d5f', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fa fa-check-circle text-white"></i>
                  </div>
                </div>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Second Row - Two Stats Cards */}
      <Row className="mb-1">
        <Col lg={6} md={6} sm={12} className="mb-1">
          <Card className="overflow-hidden" style={{ backgroundColor: '#e6a532', border: 'none', borderRadius: '6px' }}> {/* Even darker yellow/orange */}
            <Card.Body className="card-body">
              <Row>
                <div className="col">
                  <h6 className="" style={{ color: 'white' }}>Pending Files</h6>
                  <h3 className="mb-2 number-font" style={{ color: 'white' }}>
                    <CountUp
                      end={systemStats.pendingFiles}
                      separator=","
                      start={0}
                      duration={2.5}
                    />
                  </h3>
                </div>
                <div className="col col-auto">
                  <div className="counter-icon bg-warning box-shadow-warning brround ms-auto" style={{ backgroundColor: '#cc8c1d', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fa fa-bar-chart text-white"></i>
                  </div>
                </div>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={6} md={6} sm={12} className="mb-1">
          <Card className="overflow-hidden" style={{ backgroundColor: '#3a9dd9', border: 'none', borderRadius: '6px' }}> {/* Even darker light blue */}
            <Card.Body className="card-body">
              <Row>
                <div className="col">
                  <h6 className="" style={{ color: 'white' }}>Active Users</h6>
                  <h3 className="mb-2 number-font" style={{ color: 'white' }}>
                    <CountUp
                      end={systemStats.users}
                      separator=","
                      start={0}
                      duration={2.5}
                    />
                  </h3>
                </div>
                <div className="col col-auto">
                  <div className="counter-icon bg-info box-shadow-info brround ms-auto" style={{ backgroundColor: '#2980b9', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fa fa-users text-white"></i>
                  </div>
                </div>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Third Row - Chart and Recent Files */}
      <Row className="mb-3">
        <Col lg={12} md={12} sm={12} className="mb-3">
          <Card style={{ backgroundColor: '#ffffff', border: 'none', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <Card.Header className="card-header" style={{ backgroundColor: 'transparent', borderBottom: '1px solid #e3e6f0' }}>
              <h3 className="card-title" style={{ color: '#5a5c69' }}>Files Processed Overview</h3>
            </Card.Header>
            <Card.Body className="card-body pb-0">
              <div id="chartArea" className="chart-donut">
                <ReactApexChart
                  options={chartData.options}
                  series={chartData.series}
                  type="area"
                  height={300}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        {/* <Col lg={4} md={12} sm={12} className="mb-3">
          <Card style={{ backgroundColor: '#e9ecef', border: 'none', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <Card.Header className="card-header" style={{ backgroundColor: 'transparent', borderBottom: '1px solid #ced4da' }}>
              <h3 className="card-title" style={{ color: '#5a5c69' }}>Recent Files</h3>
            </Card.Header>
            <Card.Body className="card-body">
              <div className="recent-files">
                {recentFiles.map(file => (
                  <div key={file.id} className="file-item mb-3 p-2 border rounded" style={{ backgroundColor: '#ffffff', borderColor: '#ced4da' }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-0" style={{ color: '#5a5c69' }}>{file.name}</h6>
                        <small className="text-muted">{file.date}</small>
                      </div>
                      <Badge bg={getStatusVariant(file.status)}>
                        {file.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-3">
                <Link to="/files" className="btn btn-primary btn-sm" style={{ backgroundColor: '#4e73df', borderColor: '#4e73df' }}>
                  View All Files
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col> */}
      </Row>
      
      
    </div>
  );
}