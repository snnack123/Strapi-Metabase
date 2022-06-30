const initialState = {
  categories: [],
};

export function categoriesReducer(state = initialState, action) {
  switch (action.type) {
    case "categories/setCategories":
      return { ...state, categories: [...state.categories, ...action.payload] };
    case "categories/clearCategories":
      return { ...state, categories: [] };
    case "categories/deleteCategory":
      return {
        ...state,
        categories: [
          ...state.categories.filter((item) => item.id !== action.payload),
        ],
      };
    default:
      return state;
  }
}
