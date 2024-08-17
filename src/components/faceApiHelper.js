// faceApiHelper.js
import * as faceapi from 'face-api.js';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

// Load face-api.js models
export const loadModels = async () => {
  await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
  await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
  await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
};

// Detect a face from an image element or canvas
export const detectFace = async (imageElement) => {
  const detection = await faceapi.detectSingleFace(imageElement).withFaceLandmarks().withFaceDescriptor();
  if (!detection) {
    alert('No face detected');
    return null;
  }
  return detection.descriptor;
};

// Register the face in Firestore
export const registerFace = async (name, mobileNumber, descriptor) => {
  try {
    await addDoc(collection(db, 'users'), {
      name,
      mobileNumber,
      faceDescriptor: Array.from(descriptor),  // Convert Float32Array to array
    });
    alert('Face registered successfully!');
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};
