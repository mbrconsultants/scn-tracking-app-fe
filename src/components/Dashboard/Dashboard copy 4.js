import React, { useState, useEffect, useContext } from "react";
import CountUp from "react-countup";
import ReactApexChart from "react-apexcharts";
import { Breadcrumb, Col, Row, Card, Table, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Context } from "../../context/Context";
import endpoint from "../../context/endpoint";

export default function Dashboard() {
  const { user } = useContext(Context);
  const [pendingFiles, setPendingFiles] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [processedFiles, setProcessedFiles] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  // State for chart data
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

  const getPendingFiles = async () => {
    try {
      const { data } = await endpoint.get(`/file-track/pending-files`);
      console.log("Pending Files:", data.data);
      // Extract the numeric value if it's an object
      setPendingFiles(typeof data.data === 'object' ? data.data.totalPendingFiles || 0 : data.data);
    } catch (error) {
      console.error("Error fetching pending files:", error);
      setPendingFiles(0);
    }
  };

  const getTotalFiles = async () => {
    try {
      const { data } = await endpoint.get(`/file/total-files`);
      console.log("Total Files:", data.data);
      // Extract the numeric value if it's an object
      setTotalFiles(typeof data.data === 'object' ? data.data.totalFiles || 0 : data.data);
    } catch (error) {
      console.error("Error fetching total files:", error);
      setTotalFiles(0);
    }
  };

  const getProcessedFiles = async () => {
    try {
      const { data } = await endpoint.get(`/file-track/process-files`);
      console.log("Processed Files:", data.data);
      // Extract the numeric value if it's an object
      setProcessedFiles(typeof data.data === 'object' ? data.data.totalProcessedFiles || 0 : data.data);
    } catch (error) {
      console.error("Error fetching processed files:", error);
      setProcessedFiles(0);
    }
  };

  const getActiveUsers = async () => {
    try {
      const { data } = await endpoint.get(`/user/all-users`);
      console.log("Active Users:", data.data);
      // Extract the numeric value if it's an object
      setActiveUsers(typeof data.data === 'object' ? data.data.totalUsers || 0 : data.data);
    } catch (error) {
      console.error("Error fetching active users:", error);
      setActiveUsers(0);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          getPendingFiles(),
          getTotalFiles(),
          getProcessedFiles(),
          getActiveUsers()
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
              {`${user.user.first_name} ${user.user.middle_name} ${user.user.surname}`}
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      
      {/* First Row - Two Stats Cards */}
      <Row className="mb-1">
        <Col lg={6} md={6} sm={12} className="mb-1">
          <Card className="overflow-hidden" style={{ backgroundColor: '#4e8de6', border: 'none', borderRadius: '6px' }}>
            <Card.Body className="card-body">
              <Row>
                <div className="col">
                  {!loading ? (
                    <>
                      <h6 className="" style={{ color: 'white' }}>Total Files</h6>
                      <h3 className="mb-2 number-font" style={{ color: 'white' }}>
                        {totalFiles}
                      </h3>
                    </>
                  ) : (
                    <p className="text-white">Loading...</p>
                  )}
                </div>
                <div className="col col-auto">
                  <div className="counter-icon box-shadow-primary brround ms-auto" style={{ backgroundColor: '#3a67c9', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{color: "#4e73df"}}><i className="fa fa-file text-white"></i></span>
                  </div>
                </div>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={6} md={6} sm={12} className="mb-1">
          <Card className="overflow-hidden" style={{ backgroundColor: '#3cb878', border: 'none', borderRadius: '6px' }}>
            <Card.Body className="card-body">
              <Row>
                <div className="col">
                  {!loading ? (
                    <>
                      <h6 className="" style={{ color: 'white' }}>Processed Files</h6>
                      <h3 className="mb-2 number-font" style={{ color: 'white' }}>
                        {processedFiles}
                      </h3>
                    </>
                  ) : (
                    <p className="text-white">Loading...</p>
                  )}
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
          <Card className="overflow-hidden" style={{ backgroundColor: '#e6a532', border: 'none', borderRadius: '6px' }}>
            <Card.Body className="card-body">
              <Row>
                <div className="col">
                  {!loading ? (
                    <>
                      <h6 className="" style={{ color: 'white' }}>Pending Files</h6>
                      <h3 className="mb-2 number-font" style={{ color: 'white' }}>
                        {pendingFiles}
                      </h3>
                    </>
                  ) : (
                    <p className="text-white">Loading...</p>
                  )}
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
          <Card className="overflow-hidden" style={{ backgroundColor: '#3a9dd9', border: 'none', borderRadius: '6px' }}>
            <Card.Body className="card-body">
              <Row>
                <div className="col">
                  {!loading ? (
                    <>
                      <h6 className="" style={{ color: 'white' }}>Active Users</h6>
                      <h3 className="mb-2 number-font" style={{ color: 'white' }}>
                        {activeUsers}
                      </h3>
                    </>
                  ) : (
                    <p className="text-white">Loading...</p>
                  )}
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
      
      {/* Third Row - Chart */}
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
      </Row>
    </div>
  );
}