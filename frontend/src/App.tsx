import { useEffect, useMemo } from 'react';
import './App.css';
import { CssBaseline, createTheme } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import Navigation from './components/navigation/Navigation';
import { Outlet } from 'react-router-dom';
import { userService } from './services/user/user';
import { useCurrentUser } from './context/user';
import { HttpError } from './util/HttpError';
import { Toaster } from 'react-hot-toast';
import { theme } from './constants/theme';
import { linkBehaviorConfiguration } from './linkBehaviorConfiguration';

function App() {
  const appTheme = useMemo(() => createTheme({ ...theme, ...linkBehaviorConfiguration }), []);

  const { setUser, restartUser } = useCurrentUser();

  useEffect(() => {
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = localStorage.getItem('accessToken');

    if (refreshToken && accessToken) {
      userService
        .verifySession(refreshToken)
        .then(async (jwt) => {
          localStorage.setItem('accessToken', jwt);
          const { user_id } = userService.extractUserFromToken(jwt);
          const user = await userService.getUserById(user_id);

          setUser({ user_id, ...user });
        })
        .catch((res) => {
          if (res instanceof HttpError && res.err.status < 500) {
            restartUser();
          }
        });
    }
  }, []);
  return (
    <>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <Navigation />
        <main className="min-h-full">
          <Outlet />
        </main>
        <Toaster
          toastOptions={{
            success: {
              style: {
                background: theme.palette.success.main,
              },
            },
            error: {
              style: {
                background: theme.palette.error.main,
              },
            },
          }}
        />
      </ThemeProvider>
    </>
  );
}

export default App;
