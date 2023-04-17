import React, { useEffect } from 'react';
import logo from '../assets/img/insignia.png';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import AuthLibrary from '../libraries/AuthLibrary';
import Cookies from 'cookies-js';
import _ from 'lodash';
import { Navigate, useSearchParams } from 'react-router-dom';
import Loader from '../utilities/Loader';
const axios = require('axios');

const Login = () => {
	const [searchParams] = useSearchParams();

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

	/**
	 * @method {goNext}
	 * To change the global redux store
	 */
	const goNextWithLogin = (user, login_token, message) => {
		dispatch({ type: 'USER_LOGGED', payload: user });
		dispatch({ type: 'REMOVE_ALL_INVOICE_DATA' });
		toast.success(message || 'Login Successfully ', {
			position: 'bottom-right',
			theme: 'colored',
		});
		setTimeout(() => {
			AuthLibrary.login(() => {
				AuthLibrary.setTokenToCookie(login_token);
			});
		}, 1400);
	};

	
	/**
	 * @method {checkUserIdByQueryString}
	 * @description :
	 * type :
	 * return :
	 */
	const checkTokenByQueryString = async () => {
		let token = searchParams.get('token');
		if (!_.isNil(token)) {
			axios
				.get(`restaurant-pos-login/${token}`)
				.then((result) => {
					if (result?.data?.status === true) {
						let { user, message } = result?.data;
						let { login_token } = user;
						goNextWithLogin(user, login_token, message);
						window.location.href = "http://pos.insignia-resorts.com/"
						console.log('redirect..')
					} else {
						let { message } = result?.data;
						toast.error(message || 'Authentication Failed', {
							position: 'bottom-right',
							theme: 'colored',
						});
					}
				})
				.catch((err) => {
					console.log(err);
				});
		} else {
			AuthLibrary.logout(loggedUser?.id, () => {
				dispatch({ type: 'REMOVE_ALL_INVOICE_DATA' });
			});
		}
	};

	/**
	 * @method {call checkTokenByQueryString}
	 * @description did update for {checkTokenByQueryString}
	 * type {}
	 * return {}
	 */
	useEffect(() => {
		checkTokenByQueryString();
	}, [searchParams]);

	/**
	 * @method {component will unmount}
	 * desc {}
	 */
	useEffect(() => {
		return () => toast.dismiss();
	}, []);

	/**
	 * @check {Redirect}
	 * desc {}
	 */
	if (!_.isNil(Cookies.get('access_token'))) {
		return <Navigate to={'/'} />;
	}

	return (
		<div className="login position-fixed top-0 start-0 w-100 h-100 bg-light d-flex align-items-center justify-content-center">
			<div className="sign-in text-center w-100">
				<img src={logo} alt="" className="img-fluid d-inline-block mb-2" style={{ height: '150px' }} />
				<Loader type={'balls'} />
			</div>
		</div>
	);
};

export default Login;
