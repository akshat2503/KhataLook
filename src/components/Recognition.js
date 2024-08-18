import React, { useState, useRef, useEffect } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { loadModels, detectFace, getRegisteredFaces } from './faceApiHelper';
import * as faceapi from 'face-api.js';
import axios from 'axios';

export default function Recognition() {
  const [recognizedName, setRecognizedName] = useState('');
  const [amountPending, setAmountPending] = useState(0);
  const [capturing, setCapturing] = useState(false);
  const videoRef = useRef();
  const canvasRef = useRef();
  const audioRef = useRef(null);
  const registeredFacesRef = useRef([]);

  useEffect(() => {
    // Load models and registered faces when the component mounts
    const initialize = async () => {
      await loadModels();
      registeredFacesRef.current = await getRegisteredFaces();
    };
    initialize();
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

  const recognizeFace = async () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

    const descriptor = await detectFace(canvasRef.current);
    if (!descriptor) return;

    // Compare the detected face with registered faces
    const faceMatcher = new faceapi.FaceMatcher(registeredFacesRef.current.map(face => new faceapi.LabeledFaceDescriptors(
      face.name, [face.faceDescriptor])), 0.6); // Set a threshold for similarity

    const bestMatch = faceMatcher.findBestMatch(descriptor);
    if (bestMatch.label !== 'unknown') {
      const recognizedFace = registeredFacesRef.current.find(face => face.name === bestMatch.label);
      setRecognizedName(recognizedFace.name);
      setAmountPending(recognizedFace.amount_pending);
      playAudioMessage(recognizedFace.name, recognizedFace.amount_pending);
    } else {
      setRecognizedName('Face not recognized');
      setAmountPending(0);
    }
  };

  const playAudioMessage = async (name, amount) => {
    let message = '';

    // This text is in Hindi, Modify it as per your preference
    message = `${name} Ji, aapke ${amount} rupye udhaar hai.`; // Default message

    const audioContent = await getSpeechAudio(message);

    if (audioContent && audioRef.current) { // Check if audioRef is defined
      const audioBlob = new Blob([audioContent], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current.src = audioUrl;
      audioRef.current.play();
    } else {
      console.error('Audio element is not available or audio content is invalid.');
    }
  };

  const getSpeechAudio = async (text) => {
    try {
      const response = await axios.post(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=YOUR_API_KEY_HERE`,
        {
          input: { text: text },
          voice: { languageCode: 'hi-IN', ssmlGender: 'FEMALE' }, // Language and gender of the voice
          audioConfig: { audioEncoding: 'MP3' },
        }
      );
      const binaryString = window.atob(response.data.audioContent);
      const binaryLen = binaryString.length;
      const bytes = new Uint8Array(binaryLen);
      for (let i = 0; i < binaryLen; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
    } catch (error) {
      console.error('Error generating speech:', error);
      return null;
    }
  };


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Face Recognition
      </Typography>
      <Typography variant="h6" color="secondary">
        {recognizedName && `Recognized Face: ${recognizedName}`}
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        {amountPending !== 0 && `Amount Pending: ${amountPending}`}
      </Typography>

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
        <audio ref={audioRef} />
      </Box>

      {!capturing && (
        <Button variant="contained" color="primary" onClick={startVideo}>
          Start Camera
        </Button>
      )}

      {capturing && (
        <Button variant="contained" color="secondary" onClick={recognizeFace}>
          Capture and Recognize Face
        </Button>
      )}
    </Box>
  );
};
