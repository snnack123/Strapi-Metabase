const initialState = {
  username: "",
  password: "",
  loggedIn: false,
  tryLogin: false,
  jwt: "",
};

export function userReducer(state = initialState, action) {
  switch (action.type) {
    case "user/username": {
      return {
        ...state,
        username: action.payload,
      };
    }
    case "user/password": {
      return {
        ...state,
        password: action.payload,
      };
    }

    case "user/tryLogin":
      return { ...state, tryLogin: action.payload };
    case "user/loggedIn":
      return { ...state, loggedIn: action.payload };
    case "user/jwt":
      return { ...state, jwt: action.payload };
    default:
      return state;
  }
}
