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
	/**
	 * @method {useSelector}
	 * @param  {} => reduxStore
	 * To get the global redux store
	 */
	const posAccessPermissions = useSelector((reduxStore) => {
		let { pos_permission_access } = reduxStore?.userReducer?.user;
		let posPermissions = !_.isNil(pos_permission_access) && pos_permission_access.split(',');
		return posPermissions || undefined;
	});

	return (
		<>
			<PathWays>
				<Route path="/" element={<ProtectedRoute />}>
					<Route path="" element={<Dashboard />} />
				</Route>
				{!_.isNil(posAccessPermissions) &&
					_.size(posAccessPermissions) > 0 &&
					posAccessPermissions.map((pos_name, index) => {
						return (
							<Route key={index} path={`/${pos_name}-pos`} element={<ProtectedRoute />}>
								{pos_name === 'restaurant' && <Route path="" element={<RestaurantPos />} />}
								{pos_name === 'restaurant' && <Route path="current-orders" element={<CurrentOrders />} />}

								{pos_name === 'room-service' && <Route path="" element={<RoomServicePos />} />}
								{pos_name === 'room-service' && <Route path="current-orders" element={<COrders />} />}

								{pos_name === 'card' && <Route path="" element={<CardPos />} />}
							</Route>
						);
					})}
				<Route path="/login" element={<Login />} />
				<Route path="*" element={<NotFound />} />
			</PathWays>
		</>
	);
};
export default Routes;
