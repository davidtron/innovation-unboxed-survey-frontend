import React from "react";
import {Route, Switch} from "react-router-dom";
import AppliedRoute from "./components/AppliedRoute";

import Home from "./containers/Home";
import Login from "./containers/Login"
import Signup from "./containers/Signup";
import Audits from "./containers/Audit";
import ResetPassword from "./containers/ResetPassword";

import NotFound from "./containers/NotFound";

import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";

export default ({childProps}) =>
    <Switch>
        <AppliedRoute path="/" exact component={Home} props={childProps}/>
        <UnauthenticatedRoute path="/login" exact component={Login} props={childProps}/>
        <UnauthenticatedRoute path="/signup" exact component={Signup} props={childProps}/>
        <AuthenticatedRoute path="/id/:id" exact component={Audits} props={childProps} />

        <UnauthenticatedRoute
            path="/login/reset"
            exact
            component={ResetPassword}
            props={childProps}
        />

        {/* Finally, catch all unmatched routes */}
        <Route component={NotFound}/>
    </Switch>;