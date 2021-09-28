import * as React from 'react';
import { Route } from 'react-router-dom';
import Configuration from './configuration/Configuration';

import Merge from './components/Eye/Merge';

const Routes = [
    <Route exact path="/configuration" render={() => <Configuration />} />,
    <Route exact path="/gaze" render={() => <Merge />} noLayout/>,
    
];

export default Routes;