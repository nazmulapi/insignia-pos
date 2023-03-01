import React from 'react';
import { Link } from 'react-router-dom';
import { BsAppIndicator } from 'react-icons/bs';
import { useSelector } from 'react-redux';
const _ = require('lodash');

const Dashboard = () => {
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
		<div className="dashboard py-4">
			<h2 className="display-5 mb-3">Insignia POS Applications</h2>
			<div className="row">
				<div className="col-xl-10 col-xxl-12">
					<div className="row">
						{!_.isNil(posAccessPermissions) &&
							_.size(posAccessPermissions) > 0 &&
							posAccessPermissions.map((pos_name, index) => {
								return (
									<div key={index} className="col-xl-4 col-xxl-3 col-sm-6 mb-4">
										<Link
											to={`/${pos_name}-pos`}
											className={`dashboard-widget text-light text-decoration-none h-100 p-3 py-4 rounded bg-gradient d-flex gap-3 align-items-center 
											${pos_name === 'room-service' && 'bg-success'} 
											${pos_name === 'restaurant' && 'bg-primary'} 
											${pos_name === 'card' && 'bg-info'} 
											`}
										>
											<div className="icon flex-shrink-0">
												<BsAppIndicator size={'3rem'} />
											</div>
											<div className="content flex-grow-1">
												<h3 className="fs-4 fw-semi-bold font-monospace mb-1 text-capitalize">{pos_name}</h3>
											</div>
										</Link>
									</div>
								);
							})}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
