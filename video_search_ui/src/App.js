'use client'
import React, { useState } from 'react';
import axios from 'axios';

const VideoPage = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleVideoSubmit = async (event) => {
    event.preventDefault();
    const videos = videoUrl.split(",");
    console.log("here")
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/submit-video',
        { videos },
        { headers: { 'Content-Type': 'application/json' } }
      );

      // Handle success response
      console.log('Videos submitted successfully');
      setVideoUrl('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    console.log('Submitted search query:', searchQuery);
    console.log('here')
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/search/param=${searchQuery}`,
        { headers: { 'Content-Type': 'application/json' } }
      );

      // Handle success response
      const convertedResults = response.data.results.map((url) => {
        const videoId = getVideoIdFromUrl(url);
        const startTime = getStartTimeFromUrl(url);
        if (videoId && startTime !== null) {
          return `https://www.youtube.com/embed/${videoId}?start=${startTime}`;
        }
        return null;
      });
      setSearchResults(convertedResults.filter((result) => result !== null));
      console.log(searchResults)
      console.log('here')
    } catch (error) {
      console.log('here')
      console.error(error);
    }
    setSearchQuery('');
  };

  function getVideoIdFromUrl(url) {
    const videoIdMatch = url.match(/v=([^&]+)/);
    return videoIdMatch ? videoIdMatch[1] : null;
  }

  function getStartTimeFromUrl(url) {
    const startTimeMatch = url.match(/[?&]t=(\d+)/);
    return startTimeMatch ? startTimeMatch[1] : null;
  }

  const handleVideoChange = (event) => {
    setVideoUrl(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="video-page">
      <h1 className="video-page-title">Video Searcher</h1>
      <div className="form-container">
        <form className="video-form" onSubmit={handleVideoSubmit}>
          <input
            className="video-input"
            type="text"
            value={videoUrl}
            onChange={handleVideoChange}
            placeholder="Enter Comma Separated YouTube Videos to be uploaded"
          />
          <button className="submit-button" type="submit">Submit Videos</button>
        </form>
      </div>
      <div className="form-container">
        <form className="video-form" onSubmit={handleSearchSubmit}>
          <input
            className="video-input"
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Enter a search query"
          />
          <button className="submit-button" type="submit">Search</button>
        </form>
      </div>
      <div className="video-results">
        {Array.isArray(searchResults) && searchResults.length > 0 ? (
          searchResults.map((video, index) => (
            <div key={index}>
              <iframe
                width="560"
                height="315"
                src={video}
                title={`Video ${index}`}
                allowFullScreen
              ></iframe>
            </div>
          ))
        ) : (
          <p>No search results found.</p>
        )}
      </div>
    </div>
  );
};

export default VideoPage;






