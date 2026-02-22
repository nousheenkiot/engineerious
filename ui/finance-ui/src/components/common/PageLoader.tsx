import React from 'react';
import { Spinner } from 'react-bootstrap';

const PageLoader: React.FC = () => (
    <div className="d-flex h-100 w-100 align-items-center justify-content-center p-5 min-vh-100">
        <Spinner animation="border" variant="primary" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    </div>
);

export default PageLoader;
