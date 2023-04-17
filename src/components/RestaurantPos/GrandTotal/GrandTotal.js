import React, { useState, useEffect } from 'react';
import scannerBeepsSound from '../../../assets/audio/shop-scanner-beeps.wav';
import useSound from 'use-sound';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
const _ = require('lodash');
const axios = require('axios');

const GrandTotal = ({ invoiceData, totalDiscount, totalAmount, customerType, customerName, waiterName, tableName }) => {
	const [scannerBeepsSoundPlay] = useSound(scannerBeepsSound);
	const [grandTotalAmount, setGrandTotalAmount] = useState(0);
	const [taxByPercent, setTaxByPercent] = useState(15);
	const [serviceChargeByPercent, setServiceChargeByPercent] = useState(10);
	const [taxChargeAmount, setTaxChargeAmount] = useState(0);
	const [serviceChargeAmount, setServiceChargeAmount] = useState(0);
	const [isButtonsDisable, setIsButtonsDisable] = useState(true);
	const [isCancelButtonDisable, setIsCancelButtonDisable] = useState(true);

	/**
	 * @method {useDispatch, useSelector}
	 * To change the global redux store
	 */
	const dispatch = useDispatch();
	const orderData = useSelector((reduxStore) => reduxStore?.InvoiceInfoTableReducer?.orderData);

	/**
	 * {trans_service, trans_tax, trans_total}
	 * created_at:- 31/07/2022 10:00:01
	 */
	useEffect(() => {
		if (!_.isNil(orderData)) {
			let { trans_service, trans_tax } = orderData;
			setServiceChargeByPercent(trans_service);
			setTaxByPercent(trans_tax);
		}
	}, [orderData]);

	/**
	 * @method {calcGrandTotal}
	 * @set {}
	 * type {}
	 * return {}
	 */
	const calcGrandTotal = () => {
		let calcTaxChargeAmount = (totalAmount / 100) * taxByPercent;
		let calcServiceChargeAmount = (totalAmount / 100) * serviceChargeByPercent;
		setTaxChargeAmount(Math.round(calcTaxChargeAmount));
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
					dispatch({ type: 'REMOVE_ALL_INVOICE_DATA' });
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
				//console.log(response);
				const { status, message } = response?.data;
				if (status === true) {
					toast.success(message || 'Order & Payment Saved Successfully !', {
						position: 'bottom-right',
						theme: 'colored',
					});
					dispatch({ type: 'REMOVE_ALL_INVOICE_DATA' });
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
		let grandTotalObj = {};
		let total = Math.round(Number(totalAmount));
		let tDiscount = Math.round(Number(totalDiscount));
		let payable = Math.round(Number(grandTotalAmount));
		let posInfo = { posType: 'restaurant', orderDate: new Date().toLocaleString() };
		let transDetails = { taxChargeAmount: taxByPercent, serviceChargeAmount: serviceChargeByPercent, total, totalDiscount: tDiscount, payable };
		grandTotalObj['resortsInfo'] = {
			posInfo,
			invoice_id: orderData?.invoice_id ?? null,
			customerType: customerType ?? null,
			customerName: customerName ?? null,
			waiterName: waiterName ?? null,
			tableName: tableName ?? null,
			transactionDetails: transDetails,
		};
		grandTotalObj['invoiceDetails'] = invoiceData;
		grandTotalObj['transactionDetails'] = transDetails;

		if (status === 'order') sendInvoiceDetailsToOrder(grandTotalObj);
		if (status === 'payment') makePayment(grandTotalObj);
		//console.log(grandTotalObj)
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
	}, [invoiceData, taxByPercent, serviceChargeByPercent, calcGrandTotal, totalAmount]);

	/**
	 * @method {component did update}
	 * @set {}
	 * type {}
	 * return {}
	 */
	useEffect(() => {
		if (_.size(invoiceData) < 1 || _.isNil(customerType) || _.isNil(customerName) || _.isNil(waiterName) || _.isNil(tableName)) {
			setIsButtonsDisable(true);
		} else {
			setIsButtonsDisable(false);
		}
	}, [invoiceData, customerType, customerName, waiterName, tableName]);

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
		return () => {
			toast.dismiss();
		};
	}, []);

	return (
		<>
			<div className="total-sticky-overview position-fixed bottom-0 w-100 end-0 p-2 px-4 bg-light border-top" style={{ zIndex: '999' }}>
				<div className="row align-items-center justify-content-between">
					<div className="col-xl-7">
						<div className="row align-items-center">
							<div className="col-sm-6 col-xl-4 mb-2 mb-md-0">
								<div className="overview-widget d-flex align-items-center justify-content-md-end gap-3 mb-1">
									<p className="mb-0 flex-shrink-0">Vat({taxByPercent}%) :</p>
									<span style={{ width: '120px' }} className="form-control form-control-sm vatStyle">
										{currency_position === 'prefix' && currency_symbol} {Number(taxChargeAmount).toFixed(2)} {currency_position === 'suffix' && currency_symbol}
									</span>
								</div>
								<div className="overview-widget d-flex align-items-center justify-content-md-end gap-3">
									<p className="mb-0 flex-shrink-0">Service Charge(10%) :</p>
									<input
										type="number"
										className="form-control form-control-sm"
										style={{ width: '120px' }}
										value={serviceChargeByPercent}
										onChange={(e) => {
											setServiceChargeByPercent(e.target.value);
											scannerBeepsSoundPlay();
										}}
									/>
								</div>
							</div>
							<div className="col-sm-6 col-xl-3">
								<div className="overview-widget d-flex align-items-center justify-content-sm-end gap-3 mb-1">
									<p className="mb-0 fw-bold flex-shrink-0">Total :</p>
									<span className="badge fs-6 text-start bg-primary text-dark bg-opacity-50 rounded-0" style={{ minWidth: '100px' }}>
										{currency_position === 'prefix' && currency_symbol} {Math.round(totalAmount)}
										{currency_position === 'suffix' && currency_symbol}
									</span>
								</div>
								<div className="overview-widget d-flex align-items-center justify-content-sm-end gap-3 mb-1">
									<p className="mb-0 fw-bold flex-shrink-0">Discount :</p>
									<span className="badge fs-6 text-start bg-danger text-dark bg-opacity-50 rounded-0" style={{ minWidth: '100px' }}>
										{currency_position === 'prefix' && currency_symbol} {totalDiscount} {currency_position === 'suffix' && currency_symbol}
									</span>
								</div>
							</div>
							<div className="col-sm-12 col-xl-5 col-xxl-4">
								<div className="overview-widget d-flex align-items-center justify-content-sm-end gap-3 mb-1">
									<p className="mb-0 fw-bold flex-shrink-0">Service Charge :</p>
									<span className="badge fs-6 text-start bg-info text-dark bg-opacity-50 rounded-0" style={{ minWidth: '100px' }}>
										{currency_position === 'prefix' && currency_symbol} {Number(serviceChargeAmount).toFixed(2)} {currency_position === 'suffix' && currency_symbol}
									</span>
								</div>
								<div className="overview-widget d-flex align-items-center justify-content-sm-end gap-3 mb-1">
									<p className="mb-0 fw-bold flex-shrink-0">Payable :</p>
									<span className="badge fs-6 text-start bg-success rounded-0" style={{ minWidth: '100px' }}>
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
									dispatch({ type: 'REMOVE_ALL_INVOICE_DATA' });
									scannerBeepsSoundPlay();
									setTimeout(() => window.location.reload(), 100);
								}}
								className="btn btn-sm btn-danger rounded-0"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={() => {
									makeOrder('order');
									dispatch({ type: 'REMOVE_ALL_INVOICE_DATA' });
									setTimeout(() => window.location.reload(), 100);
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
