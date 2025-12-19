export default (state, action) => {
  switch (action.type) {
    case 'INIT_STATE':
      return {
        ...state,
        ...action.payload,
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(
          (transaction) => transaction.id !== action.payload
        ),
      };
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
    case 'EDIT_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map((transaction) =>
          transaction.id === action.payload.id ? action.payload : transaction
        ),
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case 'CHANGE_CURRENCY':
      return {
        ...state,
        currency: action.payload
      };
    case 'TOGGLE_THEME':
      return {
        ...state,
        theme: action.payload
      };
    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: {
          ...state.notes,
          [action.payload.monthYear]: action.payload.text
        }
      };
    default:
      return state;
  }
};
