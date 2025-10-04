import React from 'react';

export const PlaceCardSkeleton: React.FC = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
        <div className="w-full h-32 bg-gray-200"></div>
        <div className="p-4">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
    </div>
);

const ProductCardSkeleton: React.FC = () => (
    <div className="flex items-center p-3 bg-white rounded-lg shadow-sm animate-pulse">
        <div className="w-20 h-20 bg-gray-200 rounded-md"></div>
        <div className="ml-4 flex-grow space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="w-1/4 h-6 bg-gray-200 rounded"></div>
    </div>
);

export const BusinessScreenSkeleton: React.FC = () => (
    <div className="flex flex-col h-full bg-mercado-light-gray">
        <div className="bg-mercado-blue text-white p-4 shadow-md z-10 flex items-center">
             <div className="w-6 h-6 mr-4 bg-mercado-blue-light rounded-full"></div>
            <div className="h-6 bg-mercado-blue-light rounded w-1/3"></div>
        </div>
        <div>
            <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-4 bg-white">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                <div className="mt-4 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
            </div>
        </div>
        <main className="flex-grow p-4">
            <div className="h-7 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
             <div className="flex flex-wrap gap-2 mb-4">
                <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-8 w-28 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
            <div className="space-y-3">
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
            </div>
        </main>
    </div>
);

export const ProductScreenSkeleton: React.FC = () => (
    <div className="flex flex-col h-screen">
         <div className="bg-mercado-blue text-white p-4 shadow-md z-10 flex items-center">
            <div className="w-6 h-6 mr-4 bg-mercado-blue-light rounded-full"></div>
            <div className="h-6 bg-mercado-blue-light rounded w-1/3"></div>
        </div>
        <div className="flex-grow overflow-y-auto animate-pulse">
            <div className="w-full h-64 bg-gray-200"></div>
            <div className="p-6">
                <div className="flex justify-between items-start">
                    <div className="h-9 bg-gray-200 rounded w-3/5"></div>
                    <div className="h-9 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="mt-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
                 <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
            </div>
             <div className="my-6 flex justify-center">
                 <div className="h-10 bg-gray-200 rounded-full w-40"></div>
            </div>
            <div className="px-6 pb-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-12 bg-gray-200 rounded-md"></div>
                <div className="h-12 bg-gray-200 rounded-md"></div>
            </div>
        </div>
        <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex justify-between items-center mb-4">
                 <div className="h-7 bg-gray-200 rounded w-1/4"></div>
                 <div className="h-7 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="w-full h-14 bg-gray-300 rounded-lg"></div>
        </div>
    </div>
);