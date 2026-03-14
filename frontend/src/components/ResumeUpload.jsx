import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const ResumeUpload = ({ onFileSelect }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');

  const validateFile = (file) => {
    if (file.type !== 'application/pdf') {
      return 'Only PDF files are allowed';
    }
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return 'File size must be less than 5MB';
    }
    
    return null;
  };

  const handleDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Clear previous errors
    setFileError('');

    if (rejectedFiles.length > 0) {
      setFileError('Only PDF files are allowed');
      return;
    }

    if (acceptedFiles.length === 0) {
      return;
    }

    const file = acceptedFiles[0];
    const error = validateFile(file);
    
    if (error) {
      setFileError(error);
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);
  }, [onFileSelect]);

  const clearFile = () => {
    setSelectedFile(null);
    setFileError('');
    onFileSelect(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  return (
    <div className="resume-upload">
      <h3>Resume Upload</h3>
      
      {!selectedFile ? (
        <div 
          {...getRootProps()} 
          className={`dropzone ${isDragActive ? 'active' : ''} ${fileError ? 'error' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="dropzone-content">
            <div className="upload-icon">📄</div>
            {isDragActive ? (
              <p>Drop your PDF resume here...</p>
            ) : (
              <>
                <p>Drag & drop your PDF resume here</p>
                <p className="or-text">or</p>
                <button type="button" className="browse-btn">
                  Browse Files
                </button>
              </>
            )}
            <p className="file-info">PDF files only, max 5MB</p>
          </div>
        </div>
      ) : (
        <div className="file-selected">
          <div className="file-info">
            <div className="file-icon">📄</div>
            <div className="file-details">
              <div className="file-name">{selectedFile.name}</div>
              <div className="file-size">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
            <button 
              type="button" 
              onClick={clearFile}
              className="remove-btn"
              title="Remove file"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      
      {fileError && <div className="error-message">{fileError}</div>}
    </div>
  );
};

export default ResumeUpload;