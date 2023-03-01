// initialState
const initialState = {
	settings: [],
};

// Use the initialState as a default value
function settingReducer(state = initialState, action) {
	// The reducer normally looks at the action type field to decide what happens
	switch (action.type) {
		case 'SETTINGS':
			return {
				...state,
				settings: action.payload,
			};
		default:
			// If this reducer doesn't recognize the action type, or doesn't
			// care about this specific action, return the existing state unchanged
			return state;
	}
}

export default settingReducer;
