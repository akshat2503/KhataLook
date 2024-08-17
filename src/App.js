// RegisterFace.js
import React, { useState, useRef, useEffect } from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';
import { loadModels, detectFace, registerFace } from './components/faceApiHelper';

const App = () => {
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [capturing, setCapturing] = useState(false);
  const videoRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    // Load face-api.js models when the component mounts
    loadModels();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCapturing(true);
      })
      .catch((err) => {
        console.error("Error accessing the webcam: ", err);
      });
  };

  const captureImage = async () => {
    if (!name || !mobileNumber) {
      alert('Please fill out all fields');
      return;
    }

    // Draw the video frame on the canvas
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

    // Detect face from the canvas
    const descriptor = await detectFace(canvasRef.current);
    if (descriptor) {
      await registerFace(name, mobileNumber, descriptor);
      setName('');
      setMobileNumber('');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Register Face via Camera
      </Typography>
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Mobile Number"
        value={mobileNumber}
        onChange={(e) => setMobileNumber(e.target.value)}
        fullWidth
        margin="normal"
      />

      <Box mt={3} mb={3}>
        <video
          ref={videoRef}
          style={{ width: '100%', maxWidth: '500px', display: capturing ? 'block' : 'none' }}
        />
        <canvas
          ref={canvasRef}
          style={{ display: 'none' }}
          width="500"
          height="500"
        />
      </Box>

      {!capturing && (
        <Button variant="contained" color="primary" onClick={startVideo}>
          Start Camera
        </Button>
      )}

      {capturing && (
        <Button variant="contained" color="secondary" onClick={captureImage}>
          Capture and Register Face
        </Button>
      )}
    </Box>
  );
};

export default App;
