import React, { useState } from 'react';

const JobInput = ({ onUrlSubmit }) => {
  const [jobUrl, setJobUrl] = useState('');
  const [urlError, setUrlError] = useState('');

  const validateUrl = (url) => {
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch {
      return false;
    }
  };

  const handleUrlChange = (event) => {
    const url = event.target.value;
    setJobUrl(url);
    
    // Clear error when user starts typing
    if (urlError) {
      setUrlError('');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (!jobUrl.trim()) {
      setUrlError('Please enter a job posting URL');
      return;
    }

    if (!validateUrl(jobUrl)) {
      setUrlError('Please enter a valid URL (must start with http:// or https://)');
      return;
    }

    setUrlError('');
    onUrlSubmit(jobUrl.trim());
  };

  return (
    <div className="job-input">
      <h3>Job Posting URL</h3>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="url"
            value={jobUrl}
            onChange={handleUrlChange}
            placeholder="https://example.com/job-posting"
            className={`url-input ${urlError ? 'error' : ''}`}
          />
          <button type="submit" className="submit-btn">
            Set Job URL
          </button>
        </div>
        {urlError && <div className="error-message">{urlError}</div>}
      </form>
    </div>
  );
};

export default JobInput;