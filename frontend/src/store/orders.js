const initialState = {
  orders: [],
};

export function ordersReducer(state = initialState, action) {
  switch (action.type) {
    case "orders/setOrders": {
      return { ...state, orders: [...state.orders, ...action.payload] };
    }
    case "orders/newOrder": {
      return { ...state, orders: [...state.orders, action.payload] };
    }
    case "orders/clearOrders":
      return { ...state, orders: [] };
    default:
      return state;
  }
}
