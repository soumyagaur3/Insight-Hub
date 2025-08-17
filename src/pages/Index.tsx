import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { useDataContext } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import Dashboard from './Dashboard';
import Analytics from './Analytics';
import DataUploadPage from './DataUploadPage';
import { MetricData } from '@/utils/mockData';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const Index = () => {
  const { mode, setMode, realData, setRealData, hasUploadedData, setHasUploadedData } = useDataContext();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Handle real data upload
  const handleDataUpload = (uploadedData: { [key: string]: MetricData[] }) => {
    setRealData(uploadedData);
    setHasUploadedData(true);
    navigate('/'); // Redirect to dashboard after upload
  };

  // Function to render content based on current route
  const renderContent = () => {
    const path = location.pathname;
    
    if (path === '/analytics') {
      return mode === 'real' && !hasUploadedData ? (
        <DataUploadPage onDataUploaded={handleDataUpload} hasUploadedData={hasUploadedData} />
      ) : (
        <Analytics mode={mode} realData={realData} />
      );
    }
    
    if (path === '/upload') {
      return <DataUploadPage onDataUploaded={handleDataUpload} hasUploadedData={hasUploadedData} />;
    }
    
    // Default to dashboard for '/' and any other path
    return mode === 'real' && !hasUploadedData ? (
      <DataUploadPage onDataUploaded={handleDataUpload} hasUploadedData={hasUploadedData} />
    ) : (
      <Dashboard mode={mode} realData={realData} />
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation 
        mode={mode} 
        onModeChange={setMode} 
        hasUploadedData={hasUploadedData}
      />
      <div className="container mx-auto px-4 py-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default Index;