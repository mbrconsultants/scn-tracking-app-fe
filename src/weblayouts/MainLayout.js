import React, { Fragment } from 'react';
import Header from '../weblayouts/Header';
import Footer from '../weblayouts/Footer';
import { Outlet } from 'react-router-dom';
import './assets/css/bootstrap.min.css';
import './assets/css/style.css';

const MainLayout = () => {
    return (
        <Fragment>
            <Header />
            <div style={{ backgroundColor: 'white' }}>
                <Outlet />
            </div>
            <Footer />
        </Fragment>
    )
}

export default MainLayout