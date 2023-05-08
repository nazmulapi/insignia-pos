import React from 'react';
import { Routes as PathWays, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { useSelector } from 'react-redux';
import _ from 'lodash';

/* Dashboard */
import Dashboard from '../pages/Dashboard';

/* For RestaurantPos */
import CurrentOrders from '../pages/RestaurantPos/CurrentOrders';
import RestaurantPos from '../pages/RestaurantPos/Index';

/* For RoomServicePos */
import RoomServicePos from '../pages/RoomServicePos/Index';
import COrders from '../pages/RoomServicePos/CurrentOrders';

/* For CardPos */
import CardPos from '../pages/CardPos/Index';


import Login from '../pages/Login';
import NotFound from '../pages/NotFound';

const Routes = () => {

	const posAccessPermissions = useSelector((reduxStore) => {
		let { pos_permission_access } = reduxStore?.userReducer?.user;
		let posPermissions = !_.isNil(pos_permission_access) && pos_permission_access.split(',');
		return posPermissions || undefined;
	});

	return (
		<>
			<PathWays>

					<Route path="/dashbord" element={<Dashboard />} />

					<Route path="/restaurant-pos" element={<RestaurantPos />} />
					<Route path="/current-orders" element={<CurrentOrders />} />

					<Route path="/room-serive" element={<RoomServicePos />} />
					<Route path="/current-orders" element={<COrders />} />

					<Route path="" element={<CardPos />} />
				<Route path="/login" element={<Login />} />
				<Route path="*" element={<NotFound />} />
			</PathWays>
		</>
	);
};
export default Routes;
