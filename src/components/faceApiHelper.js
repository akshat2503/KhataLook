// faceApiHelper.js
import * as faceapi from 'face-api.js';
import { collection, addDoc, getDocs } from 'firebase/firestore';
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
export const registerFace = async (name, mobileNumber, amount_pending, descriptor) => {
  try {
    await addDoc(collection(db, 'users'), {
      name,
      mobileNumber,
      amount_pending,
      faceDescriptor: Array.from(descriptor),  // Convert Float32Array to array
    });
    alert('Face registered successfully!');
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

// Fetch registered faces from Firestore
export const getRegisteredFaces = async () => {
  const snapshot = await getDocs(collection(db, 'users'));
  const registeredFaces = [];
  snapshot.forEach((doc) => {
    registeredFaces.push({
      name: doc.data().name,
      mobileNumber: doc.data().mobileNumber,
      amount_pending: doc.data().amount_pending,
      faceDescriptor: new Float32Array(doc.data().faceDescriptor),
    });
  });
  return registeredFaces;
};