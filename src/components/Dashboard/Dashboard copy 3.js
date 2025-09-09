import React, { useState, useEffect } from "react";
import CountUp from "react-countup";
import ReactApexChart from "react-apexcharts";
import { Breadcrumb, Col, Row, Card, Table, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Dashboard() {
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
      <div className="page-header">
        <div>
          <h1 className="page-title text-center">SCN FILE TRACKING SYSTEM</h1>
          <Breadcrumb className="">
            <Breadcrumb.Item className="" href="#">
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className=""
              aria-current="page"
            >
              Dashboard 
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      
      {/* First Row - Two Stats Cards */}
      <Row>
        <Col lg={6} md={6} sm={12}>
          <Card className="overflow-hidden">
            <Card.Body className="card-body">
              <Row>
                <div className="col">
                  <h6 className="">Total Files</h6>
                  <h3 className="mb-2 number-font">
                    <CountUp
                      end={systemStats.totalFiles}
                      separator=","
                      start={0}
                      duration={2.5}
                    />
                  </h3>
                  <p className="text-muted mb-0">
                    <span className="text-primary me-1">
                      <i className="fa fa-chevron-circle-up text-primary me-1"></i>
                      <span>12% </span>
                    </span>
                    this month
                  </p>
                </div>
                <div className="col col-auto">
                  <div className="counter-icon bg-primary-gradient box-shadow-primary brround ms-auto">
                    <i className="fas fa-file text-white"></i>
                  </div>
                </div>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={6} md={6} sm={12}>
          <Card className="overflow-hidden">
            <Card.Body className="card-body">
              <Row>
                <div className="col">
                  <h6 className="">Processed Files</h6>
                  <h3 className="mb-2 number-font">
                    <CountUp
                      end={systemStats.processedFiles}
                      separator=","
                      start={0}
                      duration={2.5}
                    />
                  </h3>
                  <p className="text-muted mb-0">
                    <span className="text-success me-1">
                      <i className="fa fa-chevron-circle-up text-success me-1"></i>
                      <span>8% </span>
                    </span>
                    this month
                  </p>
                </div>
                <div className="col col-auto">
                  <div className="counter-icon bg-success-gradient box-shadow-success brround ms-auto">
                    <i className="fas fa-check-circle text-white"></i>
                  </div>
                </div>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Second Row - Two Stats Cards */}
      <Row>
        <Col lg={6} md={6} sm={12}>
          <Card className="overflow-hidden">
            <Card.Body className="card-body">
              <Row>
                <div className="col">
                  <h6 className="">Pending Files</h6>
                  <h3 className="mb-2 number-font">
                    <CountUp
                      end={systemStats.pendingFiles}
                      separator=","
                      start={0}
                      duration={2.5}
                    />
                  </h3>
                  <p className="text-muted mb-0">
                    <span className="text-warning me-1">
                      <i className="fa fa-chevron-circle-down text-warning me-1"></i>
                      <span>3% </span>
                    </span>
                    this month
                  </p>
                </div>
                <div className="col col-auto">
                  <div className="counter-icon bg-warning-gradient box-shadow-warning brround ms-auto">
                    <i className="fas fa-clock text-white"></i>
                  </div>
                </div>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={6} md={6} sm={12}>
          <Card className="overflow-hidden">
            <Card.Body className="card-body">
              <Row>
                <div className="col">
                  <h6 className="">Active Users</h6>
                  <h3 className="mb-2 number-font">
                    <CountUp
                      end={systemStats.users}
                      separator=","
                      start={0}
                      duration={2.5}
                    />
                  </h3>
                  <p className="text-muted mb-0">
                    <span className="text-info me-1">
                      <i className="fa fa-chevron-circle-up text-info me-1"></i>
                      <span>5% </span>
                    </span>
                    this month
                  </p>
                </div>
                <div className="col col-auto">
                  <div className="counter-icon bg-info-gradient box-shadow-info brround ms-auto">
                    <i className="fas fa-users text-white"></i>
                  </div>
                </div>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Third Row - Chart and Recent Files */}
      <Row>
        <Col lg={8} md={12} sm={12}>
          <Card>
            <Card.Header className="card-header">
              <h3 className="card-title">Files Processed Overview</h3>
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
        
        <Col lg={4} md={12} sm={12}>
          <Card>
            <Card.Header className="card-header">
              <h3 className="card-title">Recent Files</h3>
            </Card.Header>
            <Card.Body className="card-body">
              <div className="recent-files">
                {recentFiles.map(file => (
                  <div key={file.id} className="file-item mb-3 p-2 border rounded">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-0">{file.name}</h6>
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
                <Link to="/files" className="btn btn-primary btn-sm">
                  View All Files
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Fourth Row - File Actions and Quick Stats */}
      <Row>
        <Col lg={6} md={12} sm={12}>
          <Card>
            <Card.Header className="card-header">
              <h3 className="card-title">Quick Actions</h3>
            </Card.Header>
            <Card.Body className="card-body">
              <Row>
                <Col sm={6} className="text-center mb-3">
                  <div className="action-item p-3 border rounded">
                    <div className="action-icon text-primary mb-2">
                      <i className="fas fa-upload fa-2x"></i>
                    </div>
                    <h6>Upload File</h6>
                    <small className="text-muted">Add new files to the system</small>
                  </div>
                </Col>
                <Col sm={6} className="text-center mb-3">
                  <div className="action-item p-3 border rounded">
                    <div className="action-icon text-success mb-2">
                      <i className="fas fa-search fa-2x"></i>
                    </div>
                    <h6>Search Files</h6>
                    <small className="text-muted">Find files by name or content</small>
                  </div>
                </Col>
                <Col sm={6} className="text-center mb-3">
                  <div className="action-item p-3 border rounded">
                    <div className="action-icon text-info mb-2">
                      <i className="fas fa-share-alt fa-2x"></i>
                    </div>
                    <h6>Share Files</h6>
                    <small className="text-muted">Share files with team members</small>
                  </div>
                </Col>
                <Col sm={6} className="text-center mb-3">
                  <div className="action-item p-3 border rounded">
                    <div className="action-icon text-warning mb-2">
                      <i className="fas fa-chart-pie fa-2x"></i>
                    </div>
                    <h6>Reports</h6>
                    <small className="text-muted">Generate system reports</small>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={6} md={12} sm={12}>
          <Card>
            <Card.Header className="card-header">
              <h3 className="card-title">File Statistics</h3>
            </Card.Header>
            <Card.Body className="card-body">
              <div className="stats-container">
                <div className="stat-row d-flex justify-content-between align-items-center py-2 border-bottom">
                  <div className="stat-label">PDF Files</div>
                  <div className="stat-value">642</div>
                  <div className="stat-percent text-success">58%</div>
                </div>
                <div className="stat-row d-flex justify-content-between align-items-center py-2 border-bottom">
                  <div className="stat-label">Word Documents</div>
                  <div className="stat-value">384</div>
                  <div className="stat-percent text-success">32%</div>
                </div>
                <div className="stat-row d-flex justify-content-between align-items-center py-2 border-bottom">
                  <div className="stat-label">Excel Sheets</div>
                  <div className="stat-value">218</div>
                  <div className="stat-percent text-success">18%</div>
                </div>
                <div className="stat-row d-flex justify-content-between align-items-center py-2 border-bottom">
                  <div className="stat-label">Image Files</div>
                  <div className="stat-value">156</div>
                  <div className="stat-percent text-success">12%</div>
                </div>
                <div className="stat-row d-flex justify-content-between align-items-center py-2">
                  <div className="stat-label">Other Formats</div>
                  <div className="stat-value">162</div>
                  <div className="stat-percent text-success">14%</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}