import React, { useState, useEffect } from 'react';

const LoadSong = ({ songs, setSong }) => {
  return (
    <>
      <h4>Load a song</h4>
      {songs.map(song => (
        <div className="loadsong-song" onClick={() => setSong(song)}>{song.title}</div>
      ))}
    </>
  )
};

export default LoadSong;
