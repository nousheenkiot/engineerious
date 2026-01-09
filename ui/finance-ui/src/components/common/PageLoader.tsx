import React from 'react';

const PageLoader: React.FC = () => (
    <div className="flex h-full w-full items-center justify-center p-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
    </div>
);

export default PageLoader;
