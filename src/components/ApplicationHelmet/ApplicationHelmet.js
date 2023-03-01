import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import _ from 'lodash';

const ApplicationHelmet = ({ title, description, children }) => {
	return (
		<div className="ApplicationHelmet">
			<Helmet>
				<meta charSet="utf-8" />
				<meta http-equiv="X-UA-Compatible" content="IE=edge" />
				<meta name="description" content={description} />
				<title> {!_.isNil(title) && title} </title>
				<link rel="canonical" href="#" />
				{children}
			</Helmet>
		</div>
	);
};

ApplicationHelmet.defaultProps = {
	title: 'React App',
	description: 'Web site created using create-react-app',
};

ApplicationHelmet.propTypes = {
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
};

export default ApplicationHelmet;
