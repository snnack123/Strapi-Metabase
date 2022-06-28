const initialState = {
  data: [],
  categories: [],
  collection: "",
  newOrder: false,
  cart: [],
  cartPrice: 0,
};

export function productsReducer(state = initialState, action) {
  switch (action.type) {
    case "products/collection":
      return {
        ...state,
        collection: action.payload,
      };
    case "products/setData": {
      return { ...state, data: [...state.data, ...action.payload] };
    }
    case "products/setCategories": {
      return { ...state, categories: [...state.categories, ...action.payload] };
    }
    case "products/newProduct": {
      return { ...state, data: [...state.data, action.payload] };
    }
    case "products/clearData":
      return { ...state, data: [] };
    case "products/clearCategories":
      return { ...state, categories: [] };
    case "products/deleteProduct":
      return {
        ...state,
        data: [...state.data.filter((item) => item.id !== action.payload)],
      };
    case "products/newOrder":
      return { ...state, newOrder: action.payload };
    case "products/addToCart": {
      return {
        ...state,
        cart: [...state.cart, ...action.payload.id],
        cartPrice: state.cartPrice + action.payload.price,
      };
    }

    case "products/removeFromCart": {
      return {
        ...state,
        cart: state.cart.filter((item) => item !== action.payload.id),
        cartPrice: state.cartPrice - action.payload.price,
      };
    }
    default:
      return state;
  }
}
