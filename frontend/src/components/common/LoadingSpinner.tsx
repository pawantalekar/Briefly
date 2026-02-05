const LoadingSpinner = () => {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};

export default LoadingSpinner;
