import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Button } from '@mui/material';
import Calculator from './components/Calculator';
import AdminPanel from './components/AdminPanel';

const App: React.FC = () => {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Калькулятор душевых кабин
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Калькулятор
          </Button>
          <Button color="inherit" component={Link} to="/admin">
            Админ панель
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<Calculator />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App; 