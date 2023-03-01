import React from 'react';
import ReactLoading from 'react-loading';

const Loader = ({ type, color }) => {
	return (
		<>
			<div className="loader d-flex  align-items-center justify-content-center">
				<ReactLoading type={type || 'balls'} color={color || '#00f'} height={'10%'} width={'80px'} />
			</div>
		</>
	);
};

export default Loader;
