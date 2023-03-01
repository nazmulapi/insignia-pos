import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import axios from 'axios';
import _ from 'lodash';

const CardPos = () => {
	const [selectedCardType, setSelectedCardType] = useState();
	const [cardTypes, setCardTypes] = useState();
	const [selectedCards, setSelectedCards] = useState();
	const [cards, setCards] = useState();
	const [cardInfo, setCardInfo] = useState();
	const cardSelectRef = useRef();

	/**
	 * description :- getCardTypes
	 * created_at:- 11/08/2022 09:52:33
	 */
	const getCardTypes = async () => {
		try {
			const response = await axios.get(`/card-type`);
			let data = response?.data.map((d) => {
				return { ...d, value: d.name, label: d.name };
			});
			if (!_.isNil(data)) {
				setCardTypes(data);
				setSelectedCardType(data[0]);
				getCards(data[0]);
			}
		} catch (error) {
			console.error(error);
		}
	};

	/**
	 * description :- getCardInfo
	 * created_at:- 11/08/2022 09:52:33
	 */
	const getCards = async (card) => {
		try {
			let { id } = card;
			const response = await axios.get(`/type-wise-card-number/${id}`);
			let data = response?.data?.cardNumber.map((ci) => {
				return {
					...ci,
					value: ci.card_id,
					label: ci.card_id,
				};
			});
			if (!_.isNil(data)) setCards(data);
		} catch (error) {
			console.error(error);
		}
	};

	/**
	 * description :- getCardInfo
	 * created_at:- 11/08/2022 09:52:33
	 */
	const getCardInfo = async (card) => {
		try {
			let { card_id } = card;
			const response = await axios.get(`/member-card-info/${card_id}`);
			let data = response?.data?.cardInfo[0];
			if (!_.isNil(data)) setCardInfo(data);
		} catch (error) {
			console.error(error);
		}
	};

	/**
	 * useEffect - component didMount
	 * description :-
	 * created_at:- 11/08/2022 09:52:59
	 */
	useEffect(() => {
		getCardTypes();
	}, []);

	return (
		<>
			<div className="card-pos py-4 pb-5">
				<h3 className="mb-4 fw-2 text-primary fw-normal">Card POS</h3>
				<div className="card-info">
					<div className="row gx-xl-5">
						<div className="col-xl-5">
							<div className="row">
								<div className="col-xl-6">
									<div className="form-group mb-2">
										<label htmlFor="#" className="mb-1 form-label">
											Card Type
										</label>
										<Select
											placeholder="Select Card Type ..."
											className="react-select-card-type"
											classNamePrefix="Search"
											isDisabled={false}
											isLoading={false}
											isClearable={true}
											isRtl={false}
											isSearchable={true}
											name="card-type"
											value={selectedCardType}
											onChange={(value) => {
												cardSelectRef.current.clearValue();
												setCardInfo(null);
												setSelectedCardType(value);
												getCards(value);
											}}
											options={cardTypes}
										/>
									</div>
								</div>
								<div className="col-xl-6">
									<div className="form-group mb-2">
										<label htmlFor="#" className="mb-1 form-label">
											Card Number
										</label>
										<Select
											ref={cardSelectRef}
											placeholder="Select Card Number ..."
											className="react-select-card-number"
											classNamePrefix="Search"
											isDisabled={false}
											isLoading={false}
											isClearable={true}
											isRtl={false}
											isSearchable={true}
											name="card-number"
											value={selectedCards}
											onChange={(value) => {
												setSelectedCards(value);
												!_.isNil(value) && getCardInfo(value);
											}}
											options={cards}
										/>
									</div>
								</div>
								<div className="col-12">
									{!_.isNil(cardInfo) && (
										<div className="card-info-show mt-2">
											<h6 className="mb-2 fw-bold border-dark border-bottom pb-1 font-monospace">Card Information</h6>
											<ul className="p-0 d-flex flex-wrap">
												<li className="d-inline-flex me-2 mb-1">
													<div className="fw-bold me-1">Card Name : </div>
													<span>{cardInfo?.name},</span>
												</li>
												<li className="d-inline-flex me-2 mb-1">
													<div className="fw-bold me-1">Card ID : </div>
													<span>{cardInfo?.card_id},</span>
												</li>
												<li className="d-inline-flex me-2 mb-1">
													<div className="fw-bold me-1">Card Member ID : </div>
													<span>{cardInfo?.card_member_id},</span>
												</li>
												<li className="d-inline-flex me-2 mb-1">
													<div className="fw-bold me-1">Card Min Value : </div>
													<span>{cardInfo?.card_min_value},</span>
												</li>
												<li className="d-inline-flex me-2 mb-1">
													<div className="fw-bold me-1">Card Trash Hold : </div>
													<span>{cardInfo?.card_trash_hold}</span>
												</li>
											</ul>
										</div>
									)}
								</div>
							</div>
						</div>
						<div className="col-xl-7">
							<h5 className="mb-3 font-monospace border-bottom border-dark pb-1 fw-bold">Card Records</h5>
							<div className="card-records table-responsive">
								<table className="table">
									<thead>
										<tr>
											<th>ID</th>
											<th></th>
											<th></th>
											<th></th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
				<div className="make-card-payment position-fixed bottom-0 w-100 end-0 p-2 px-4 bg-light border-top">
					<div className="row">
						<div className="col-xl-8"></div>
						<div className="col-xl-4"></div>
					</div>
				</div>
			</div>
		</>
	);
};

export default CardPos;
