// RegisterFace.js
import React from 'react';
import Registration from './components/Registration';
import Recognition from './components/Recognition';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';


const App = () => {

  return (
    <Router>
      {/* The navigation bar */}
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              KhataLook
            </Typography>
            <Button color="inherit" component={Link} to="/register">
              Register Face
            </Button>
            <Button color="inherit" component={Link} to="/recognize">
              Recognize Face
            </Button>
          </Toolbar>
        </AppBar>
      </Box>

      {/* The routes for the application */}
      <Routes>
        <Route path="/register" element={<Registration />} />
        <Route path="/recognize" element={<Recognition />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

function Home() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Welcome to the Face Recognition App</Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Use the navigation links above to either register a face or recognize a face.
      </Typography>
    </Box>
  );
}

export default App;
