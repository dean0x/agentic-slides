import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PresentationProvider } from '@/context/PresentationContext';
import { HomePage } from '@/pages/HomePage';
import { PresentationViewer } from '@/pages/PresentationViewer';

function App() {
  return (
    <BrowserRouter>
      <PresentationProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/presentation/:id" element={<PresentationViewer />} />
          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PresentationProvider>
    </BrowserRouter>
  );
}

export default App;
