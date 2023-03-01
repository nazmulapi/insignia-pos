import Cookies from 'cookies-js';
import { toast } from 'react-toastify';
const _ = require('lodash');
const axios = require('axios');

class AuthLibrary {
	/**
	 *
	 * @param access_token
	 * @param token_type
	 * @param expired_at
	 * @returns {Cookies}
	 */
	setTokenToCookie = (access_token) => {
		try {
			return Cookies.set('access_token', access_token, {
				expires: 5000,
			});
		} catch (err) {
			throw Error('Auth generation is failed.');
		}
	};

	login = (callback) => {
		window.location.href = process.env.PUBLIC_URL;

		if (typeof callback === 'function') {
			return callback();
		}
	};

	/**
	 *
	 * @param callback
	 * @returns {boolean|*}
	 */
	logout = async (loggedUserId = undefined, callback) => {
		if (!_.isNil(loggedUserId)) {
			try {
				let response = await axios.get(`/restaurant-pos-logout/${loggedUserId}`);
				if (response?.data?.status === true) {
					Cookies.expire('access_token');
					window.location.href = process.env.REACT_APP_API_BACKEND_SERVER_URL + '/login';
				} else {
					let { message } = response?.data;
					toast.error(message || 'Logout Failed', {
						position: 'bottom-right',
						theme: 'colored',
					});
				}
			} catch (error) {
				console.log(error);
			}
		} else {
			Cookies.expire('access_token');
			window.location.href = process.env.REACT_APP_API_BACKEND_SERVER_URL + '/login';
		}

		if (typeof callback === 'function') {
			return callback();
		}
	};
}

export default new AuthLibrary();
