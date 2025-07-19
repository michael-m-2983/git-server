import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './style.css'
import App from './App.tsx'

import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider defaultColorScheme='dark' forceColorScheme='dark'>
      <ModalsProvider>
        <App />
      </ModalsProvider>
    </MantineProvider>
  </StrictMode>,
)
