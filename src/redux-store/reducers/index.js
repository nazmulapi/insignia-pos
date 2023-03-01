import { combineReducers } from 'redux';
import InvoiceInfoTableReducer from './InvoiceInfoTableReducer';
import userReducer from './userReducer';
import settingReducer from './settingReducer';
import RoomInvoiceInfoTableReducer from './RoomInvoiceInfoTableReducer';

const rootReducer = combineReducers({
    InvoiceInfoTableReducer,
    userReducer,
    settingReducer,
    RoomInvoiceInfoTableReducer
});

export default rootReducer;