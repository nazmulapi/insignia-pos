import './App.scss';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './routes/Routes';
import { ToastContainer } from 'react-toastify';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, persistor } from './redux-store/Store';
import { PersistGate } from 'redux-persist/integration/react';
import Header from './components/Header/Header';
import ApplicationHelmet from './components/ApplicationHelmet/ApplicationHelmet';
const axios = require('axios');
const _ = require('lodash');

/**
 * Axios Global Config
 * @type {string}
 */

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

const AppContainer = () => {
	const dispatch = useDispatch();

	/**
	 * useSelector
	 * appTitle, appFavIcon
	 * created_at:- 31/07/2022 10:00:01
	 */
	const { appTitle, appFavIcon } = useSelector((store) => {
		let { settings } = store?.settingReducer;
		let appTitle, appFavIcon;
		settings.forEach((setting) => {
			if (setting?.name === 'title') appTitle = setting?.value;
			if (setting?.name === 'favicon') appFavIcon = setting?.value;
		});
		return { appTitle, appFavIcon };
	});

	
	/**
	 * getPaymentCurrency
	 * created_at:- 31/07/2022 09:25:43
	 */
	const getApplicationSettings = async () => {
		try {
			const response = await axios.get(`/settings`);
			let data = response?.data;
			if (data) dispatch({ type: 'SETTINGS', payload: data });
		} catch (error) {
			console.error(error);
		}
	};


	/**
	 * useEffect
	 * created_at:- 31/07/2022 09:33:55
	 */
	useEffect(() => {
		getApplicationSettings();
	}, []);

	
	return (
		<>
			<ApplicationHelmet>
				<link rel="apple-touch-icon" href={`${process.env.REACT_APP_API_BACKEND_SERVER_URL}/storage/logo/${appFavIcon}`} />
				<link rel="icon" href={`${process.env.REACT_APP_API_BACKEND_SERVER_URL}/storage/logo/${appFavIcon}`} />
				{ !_.isNil(appTitle) && <title> {appTitle } </title> }
			</ApplicationHelmet>
			<main id="main" className="px-xl-4 px-3 pt-2 pb-5">
				<Header />
				<Routes />
			</main>
		</>
	);
};

function App() {
	return (
		<>
			<Provider store={store}>
				<BrowserRouter basename="/insignia-pos">
					<PersistGate loading={null} persistor={persistor}>
						<AppContainer />
					</PersistGate>
					<ToastContainer />
				</BrowserRouter>
			</Provider>
		</>
	);
}

export default App;
