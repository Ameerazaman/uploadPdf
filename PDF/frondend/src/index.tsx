// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { Provider } from 'react-redux'; // Import Provider from react-redux
// import { Toaster } from 'react-hot-toast';
// import './index.css';
// import App from './App';
// import { store } from './App/Store'; // Import your configured store

// const root = ReactDOM.createRoot(
//   document.getElementById('root') as HTMLElement
// );

// root.render(
//   <React.StrictMode>
//     <Provider store={store}> {/* Wrap your app with Provider */}
//       <App />
//       <Toaster />
//     </Provider>
//   </React.StrictMode>
// );

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from 'react-hot-toast';
import { store, persistor } from './App/Store';
import { GlobalWorkerOptions } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <Provider store={store}>
      <PersistGate
        persistor={persistor}
        loading={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin text-red-500 w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full"></div>
          </div>
        }
      >
        <App />
        <Toaster />
      </PersistGate>
    </Provider>
  );
} else {
  console.error('Root element not found');
}
