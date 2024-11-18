import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Snackbar } from 'react-native-paper';
import { ViewStyle } from 'react-native';
import { snackbarStyles } from '@/styles/styles-snackbar';

const SnackbarContext = createContext<SnackbarContextProps | undefined>(
  undefined
);

interface SnackbarContextProps {
  currentSnackbar: Snackbar | undefined;
  addSnackbarInfoMessage: (snackbar: Snackbar) => void;
}

export function useSnackbarContext(): SnackbarContextProps {
  const context = useContext(SnackbarContext);

  if (!context) {
    throw new Error(
      'Unable to find the SnackbarProvider in the component tree.'
    );
  }

  return context;
}

export function SnackbarProvider({ children }: SnackbarProviderProps) {
  const [currentSnackbar, setCurrentSnackbar] = useState<Snackbar>();
  const [snackbarQueue, setSnackbarQueue] = useState<Snackbar[]>([]);

  const addSnackbarInfoMessage = useCallback((snackbar: Snackbar) => {
    setSnackbarQueue((prevState) => [...prevState, snackbar]);
  }, []);

  useEffect(
    function processQueue() {
      if (currentSnackbar) {
        return;
      }

      if (!snackbarQueue.length) {
        return;
      }

      const snackbar = snackbarQueue[0];
      setCurrentSnackbar(snackbar);
      setSnackbarQueue((prevState) => prevState.slice(1));
    },
    [currentSnackbar, snackbarQueue]
  );

  function getSnackbarStyle(snackbar: Snackbar): ViewStyle {
    switch (snackbar.type) {
      case 'success':
        return snackbarStyles.success;
      case 'error':
        return snackbarStyles.error;
      case 'standard':
      default:
        return snackbarStyles.standard;
    }
  }

  function getSnackbarDuration(snackbar: Snackbar): number {
    switch (snackbar.type) {
      case 'error':
        return 3000;
      case 'standard':
        return 1000;
      case 'success':
        return 1500;
      default:
        return 1000;
    }
  }

  return (
    <SnackbarContext.Provider
      value={{ currentSnackbar, addSnackbarInfoMessage }}
    >
      {children}

      {currentSnackbar && (
        <Snackbar
          visible={true}
          style={getSnackbarStyle(currentSnackbar)}
          duration={getSnackbarDuration(currentSnackbar)}
          onDismiss={() => setCurrentSnackbar(undefined)}
        >
          {currentSnackbar.message}
        </Snackbar>
      )}
    </SnackbarContext.Provider>
  );
}

type SnackbarProviderProps = PropsWithChildren<{}>;

export interface Snackbar {
  message: string;
  type?: 'standard' | 'success' | 'error';
}
