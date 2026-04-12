import { useState } from 'react';
import { AuthProvider } from './hooks/useAuth';
import { Login, Register } from './pages/Auth';

function App() {
  const [page, setPage] = useState('login');

  return (
    <AuthProvider>
      {page === 'login' && (
        <Login
          onSuccess={() => setPage('home')}
          onGoRegister={() => setPage('register')}
        />
      )}
      {page === 'register' && (
        <Register
          onSuccess={() => setPage('home')}
          onGoLogin={() => setPage('login')}
        />
      )}
      {page === 'home' && (
        <div style={{ color: 'white', padding: 40 }}>
          🏠 Page principale (à faire)
        </div>
      )}
    </AuthProvider>
  );
}

export default App;