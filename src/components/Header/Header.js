import React from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import AuthLibrary from '../../libraries/AuthLibrary';
import insignia from '../../assets/img/insignia-text.png';
const _ = require('lodash');


const Header = () => {
	/**
	 * @method {useDispatch}
	 * To change the global redux store
	 */
	const dispatch = useDispatch();

	/**
	 * @method {useSelector}
	 * @param  {} => reduxStore
	 * To get the global redux store
	 */
	const loggedUser = useSelector((reduxStore) => reduxStore?.userReducer?.user);

	return (
		<div id="header" className="border-bottom d-flex flex-wrap align-items-center justify-content-between gap-2 py-2">
			<Link to={'/'} className="logo">
				<img src={insignia} alt="logo" className="img-fluid" style={{ maxWidth: '150px' }} />
			</Link>
			<div className="header-right d-flex flex-wrap align-items-center">
				<Dropdown>
					<Dropdown.Toggle className="btn bg-transparent text-dark border-0 p-0">
						{!_.isNull(loggedUser?.avatar) && (
							<img
								src={loggedUser?.avatar}
								alt="img"
								className="img-fluid rounded-circle border me-2"
								style={{ width: '28px', height: '28px', objectFit: 'cover', objectPosition: 'center' }}
							/>
						)}

						{loggedUser?.name}
					</Dropdown.Toggle>
					<Dropdown.Menu className="w-100">
						<Dropdown.Item
							as={Button}
							onClick={() => {
								AuthLibrary.logout(loggedUser?.id, () => {
									dispatch({ type: 'REMOVE_ALL_INVOICE_DATA' });
								});
							}}
						>
							Logout
						</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</div>
		</div>
	);
};

export default Header;
