import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import { ConfigProvider } from 'antd';
import ptBR from 'antd/lib/locale/pt_BR';
import moment from 'moment';
import 'moment/locale/pt-br';
import { Provider } from 'react-redux';
import { store } from './core/store';
import { DefaultLayout } from './app/layouts/Default';
import AppRoutes from './app/routes';
import './auth/httpConfig';
import './index.less';

moment.locale('pt-br');

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider locale={ptBR}>
      <Provider store={store}>
        <BrowserRouter>
          <DefaultLayout>
            <AppRoutes />
          </DefaultLayout>
        </BrowserRouter>
      </Provider>
    </ConfigProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
