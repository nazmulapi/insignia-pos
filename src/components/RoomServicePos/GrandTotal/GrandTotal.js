import React, { useState, useEffect } from 'react';
import scannerBeepsSound from '../../../assets/audio/shop-scanner-beeps.wav';
import useSound from 'use-sound';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
const _ = require('lodash');
const axios = require('axios');

const GrandTotal = ({ invoiceData, totalDiscount, totalAmount, customerType, customerName, waiterName }) => {
	const [scannerBeepsSoundPlay] = useSound(scannerBeepsSound);
	const [grandTotalAmount, setGrandTotalAmount] = useState(0);
	const [taxByPercent] = useState(0);
	const [taxChargeAmount, setTaxChargeAmount] = useState();
	const [serviceChargeType, setServiceChargeType] = useState({});
	const [serviceChargeAmount, setServiceChargeAmount] = useState();
	const [isButtonsDisable, setIsButtonsDisable] = useState(true);
	const [isCancelButtonDisable, setIsCancelButtonDisable] = useState(true);

	/**
	 * @method {useDispatch}
	 * To change the global redux store
	 */
	const dispatch = useDispatch();
	const orderData = useSelector((reduxStore) => reduxStore?.RoomInvoiceInfoTableReducer?.orderData);

	/**
	 * description :-
	 * created_at:- 07/08/2022 11:48:50
	 */
	const getRoomServiceSettings = async () => {
		try {
			const response = await axios.get(`/room-service-settings`);
			const settings = response?.data;
			let service_type = await settings.reduce((acc, setting) => {
				if (setting.name === 'room_service_type') acc = setting.value;
				return acc;
			}, '');

			let service_value = await settings.reduce((acc, setting) => {
				if (service_type === 'fixed' && setting.name === 'room_service_charge_fixed') acc = setting.value;
				if (service_type === 'percentage' && setting.name === 'room_service_charge_percentage') acc = setting.value;
				return acc;
			}, '');

			setServiceChargeType({ service_type, service_value });
		} catch (error) {
			console.error(error);
		}
	};

	/**
	 * @method {calcGrandTotal}
	 * @set {}
	 * type {}
	 * return {}
	 */
	const calcGrandTotal = () => {
		let calcTaxChargeAmount = (totalAmount / 100) * taxByPercent;
		const { service_type, service_value } = serviceChargeType;
		let calcServiceChargeAmount;
		_.size(invoiceData) < 1 ? (calcServiceChargeAmount = 0) : (calcServiceChargeAmount = service_type === 'fixed' ? parseInt(service_value) : (totalAmount / 100) * parseInt(service_value));
		setTaxChargeAmount(calcTaxChargeAmount);
		setServiceChargeAmount(calcServiceChargeAmount);
		setGrandTotalAmount(() => {
			return Math.round(totalAmount + calcTaxChargeAmount + calcServiceChargeAmount);
		});
	};

	/**
	 * @method {sendInvoiceDetailsToOrder}
	 * @set {}
	 * type {}
	 * return {}
	 */
	const sendInvoiceDetailsToOrder = async (ordersData) => {
		await axios({
			method: 'POST',
			url: '/create-orders',
			data: ordersData,
		})
			.then((response) => {
				const { status, message } = response?.data;
				if (status === true) {
					toast.success(message || 'Order Saved Successfully !', {
						position: 'bottom-right',
						theme: 'colored',
					});
					dispatch({ type: 'REMOVE_ALL_ROOM_INVOICE_DATA' });
				} else if (status === false) {
					toast.error(message || 'Something went wrong !', {
						position: 'bottom-right',
						theme: 'colored',
					});
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	/**
	 * @method {sendInvoiceDetailsToOrder}
	 * @set {}
	 * type {}
	 * return {}
	 */
	const makePayment = async (ordersData) => {
		await axios({
			method: 'POST',
			url: '/order-payment',
			data: ordersData,
		})
			.then((response) => {
				console.log(response);
				const { status, message } = response?.data;
				if (status === true) {
					toast.success(message || 'Order & Payment Saved Successfully !', {
						position: 'bottom-right',
						theme: 'colored',
					});
					dispatch({ type: 'REMOVE_ALL_ROOM_INVOICE_DATA' });
				} else if (status === false) {
					toast.error(message || 'Something went wrong !', {
						position: 'bottom-right',
						theme: 'colored',
					});
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	/**
	 * @method {makeOrder}
	 * @set {}
	 * type {}
	 * return {}
	 */
	const makeOrder = (status) => {
		if (_.size(invoiceData) > 0) {
			let grandTotalObj = {};
			let tChargeAmount = Number(taxChargeAmount);
			let sChargeAmount = Number(serviceChargeAmount);
			let total = Math.round(Number(totalAmount + taxChargeAmount + serviceChargeAmount + totalDiscount));
			let tDiscount = Math.round(Number(totalDiscount));
			let payable = Math.round(Number(grandTotalAmount));
			let posInfo = { posType: 'room', orderDate: new Date().toLocaleString() };
			let transDetails = { taxChargeAmount: tChargeAmount, serviceChargeAmount: sChargeAmount, total, totalDiscount: tDiscount, payable };

			grandTotalObj['resortsInfo'] = {
				posInfo,
				invoice_id: orderData?.invoice_id ?? null,
				customerType: customerType ?? null,
				customerName: customerName ?? null,
				waiterName: waiterName ?? null,
				transactionDetails: transDetails,
			};

			grandTotalObj['invoiceDetails'] = invoiceData;
			grandTotalObj['transactionDetails'] = transDetails;

			if (status === 'order') sendInvoiceDetailsToOrder(grandTotalObj);
			if (status === 'payment') makePayment(grandTotalObj);
		} else {
			toast.error('No invoice data to order', {
				position: 'bottom-right',
				theme: 'colored',
			});
		}
	};

	/**
	 * @method {component did update}
	 * @set {}
	 * type {}
	 * return {}
	 */
	useEffect(() => {
		setIsCancelButtonDisable((state) => {
			return _.size(invoiceData) < 1 ? true : false;
		});
		if (!_.isNull(totalAmount) && !_.isUndefined(totalAmount)) {
			calcGrandTotal();
		}
	}, [invoiceData, taxByPercent, serviceChargeType, calcGrandTotal, totalAmount]);

	/**
	 * @method {component did update}
	 * @set {}
	 * type {}
	 * return {}
	 */
	useEffect(() => {
		if (_.size(invoiceData) < 1 || _.isNil(customerType) || _.isNil(customerName) || _.isNil(waiterName)) {
			setIsButtonsDisable(true);
		} else {
			setIsButtonsDisable(false);
		}
	}, [invoiceData, customerType, customerName, waiterName]);

	/**
	 * useSelector
	 * appTitle, appFavIcon
	 * created_at:- 31/07/2022 10:00:01
	 */
	const { currency_symbol, currency_position } = useSelector((store) => {
		let { settings } = store?.settingReducer;
		let currency_symbol, currency_position;
		settings.forEach((setting) => {
			if (setting?.name === 'currency_symbol') currency_symbol = setting?.value;
			if (setting?.name === 'currency_position') currency_position = setting?.value;
		});
		return { currency_symbol, currency_position };
	});

	/**
	 * @method {component will mount/unmount}
	 * type {}
	 * return {}
	 */
	useEffect(() => {
		getRoomServiceSettings();
		return () => {
			toast.dismiss();
		};
	}, []);


	useEffect(()=>{
		(async()=>{
			try {
				const result = await axios.get('https://jsonplaceholder.typicode.com/posts')
				console.log(result.data)
			} catch (error) {
				console.log(error.message)
			}
		}
		)()
	},[])

	return (
		<>
			<div className="total-sticky-overview position-fixed bottom-0 w-100 end-0 p-2 px-4 bg-light border-top" style={{ zIndex: '999' }}>
				<div className="row align-items-center justify-content-between">
					<div className="col-xl-7">
						<div className="row align-items-center">
							<div className="col-sm-6 col-xl-4 mb-2 mb-md-0">
								<div className="overview-widget d-flex align-items-center justify-content-md-end gap-3">
									<p className="mb-0 fw-bold flex-shrink-0">Service Charge {serviceChargeType?.service_type === 'percentage' && `(${serviceChargeType?.service_value}%)`} :</p>

									<span style={{ width: '100px' }} className="badge fs-6 text-start bg-info border-primary text-dark bg-opacity-50 rounded-0">
										{currency_position === 'prefix' && currency_symbol} {serviceChargeAmount} {currency_position === 'suffix' && currency_symbol}
									</span>
								</div>
							</div>
							<div className="col-sm-6 col-xl-3">
								<div className="overview-widget d-flex align-items-center justify-content-sm-end gap-3 mb-1">
									<p className="mb-0 fw-bold flex-shrink-0">Total :</p>
									<span className="badge fs-6 text-start bg-primary border-primary text-dark bg-opacity-50 rounded-0" style={{ minWidth: '100px' }}>
										{currency_position === 'prefix' && currency_symbol} {Math.round(totalAmount + taxChargeAmount + serviceChargeAmount + totalDiscount)}
										{currency_position === 'suffix' && currency_symbol}
									</span>
								</div>
							</div>
							<div className="col-sm-12 col-xl-5 col-xxl-4">
								<div className="overview-widget d-flex align-items-center justify-content-sm-end gap-3 mb-1">
									<p className="mb-0 fw-bold flex-shrink-0">Payable :</p>
									<span className="badge fs-6 text-start bg-success border-success rounded-0" style={{ minWidth: '100px' }}>
										{currency_position === 'prefix' && currency_symbol} {Math.round(grandTotalAmount)} {currency_position === 'suffix' && currency_symbol}
									</span>
								</div>
							</div>
						</div>
					</div>
					<div className="col-xl-5 text-xl-end mt-1 mt-xl-0">
						<div className="btn-group mt-2 mt-xl-0" role="group">
							<button
								type="button"
								onClick={() => {
									dispatch({ type: 'REMOVE_ALL_ROOM_INVOICE_DATA' });
									scannerBeepsSoundPlay();
									setTimeout(() => window.location.reload(), 100);
								}}
								className="btn btn-sm btn-danger rounded-0"
							>
								Cancel
							</button>
							<button
								type="button"
								disabled={isButtonsDisable}
								onClick={() => {
									makeOrder('order');
								}}
								className="btn btn-sm btn-warning rounded-0"
							>
								Order
							</button>
							<button
								type="button"
								disabled={isButtonsDisable}
								onClick={() => {
									makeOrder('payment');
								}}
								className="btn btn-sm btn-success rounded-0"
							>
								Payment
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default GrandTotal;
