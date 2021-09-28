import React, { useState, useEffect } from "react";
import { Admin, Resource, useGetPermissions, usePermissions } from 'react-admin';

// Admin
import dataProvider from "./dataProvider";
import { Dashboard } from './dashboard';
import themeReducer from './themeReducer';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from './i18n/en.js';
import authProvider from './authProvider';
import { Login, Layout } from './layout';
import customRoutes from './routes';
// Pages
import { UserList, UserEdit, UserCreate } from "./Pages/users";
import { TagList, TagCreate, TagEdit } from './Pages/tags';
import { ReportList, ReportCreate, ReportEdit } from "./Pages/reports";
import { MediaList, MediaCreate } from "./Pages/medias";
import { PendingReportList, PendingReportEdit } from './Pages/pendingReports';




const i18nProvider = polyglotI18nProvider(locale => {
  if (locale === 'tr') {
    return import('./i18n/tr.js').then(messages => messages.default);
  }

  // Always fallback on english
  return englishMessages;
}, 'en');




const App = () => {
  const [role, setRole] = useState('');


  useEffect(() => {
    localStorage.getItem('token') ? setRole(JSON.parse(localStorage.getItem('auth')).role) : setRole('');
  }, [])

  return (
    <Admin
      dataProvider={dataProvider}
      customReducers={{ theme: themeReducer }}
      dashboard={(role === 'teacher' || role === 'admin') ? Dashboard : null}
      i18nProvider={i18nProvider}
      authProvider={authProvider}
      customRoutes={customRoutes}
      loginPage={Login}
      layout={Layout}
    >
      <Resource
        name="users"
        list={role === 'admin' ? UserList : null}
        create={role === 'admin' ? UserCreate : null}
        edit={role === 'admin' ? UserEdit : null}
      />
      <Resource
        name="tags"
        list={(role === 'teacher' || role === 'admin') ? TagList : null}
        create={(role === 'teacher' || role === 'admin') ? TagCreate : null}
        edit={(role === 'teacher' || role === 'admin') ? TagEdit : null}
      />
      <Resource
        name="reports"
        list={(role === 'teacher' || role === 'admin') ? ReportList : null}
        create={(role === 'teacher' || role === 'admin') ? ReportCreate : null}
        edit={(role === 'teacher' || role === 'admin') ? ReportEdit : null}
      />
      <Resource
        name="medias"
        list={MediaList}
        create={MediaCreate}
      />
      <Resource
        name="pendingReports"
        list={PendingReportList}
        edit={PendingReportEdit}
      />
    </Admin>
  )

}

export default App;