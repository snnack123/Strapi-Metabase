const initialState = {
  categories: [],
};

export function categoriesReducer(state = initialState, action) {
  switch (action.type) {
    case "products/setCategories":
      return { ...state, categories: [...state.categories, ...action.payload] };
    default:
      return state;
  }
}
