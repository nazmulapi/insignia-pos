import React from 'react';
import { Navigate, Outlet, useSearchParams } from 'react-router-dom';
import Cookies from 'cookies-js';
import _ from 'lodash';

const ProtectedRoute = ({ ...props }) => {
	const [searchParams] = useSearchParams();
	const autoLoginToken = searchParams.get('token');
	const isAuth = !_.isNil(Cookies.get('access_token'));

	if (!isAuth && _.isNil(autoLoginToken)) {
		return <Navigate to={`/login`} />;
	} else if (!_.isNil(autoLoginToken)) {
		return <Navigate to={`/login?token=${autoLoginToken}`} />;
	}
	return <Outlet />;
};

export default ProtectedRoute;
