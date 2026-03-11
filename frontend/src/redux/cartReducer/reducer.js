import { ADD_TO_CART, REMOVE_FROM_CART, UPDATE_CART_QUANTITY, CLEAR_CART } from "./actionTypes";

const initialState = { cartItems: [] };

export const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ADD_TO_CART: {
      const exists = state.cartItems.find(
        (item) => (item._id || item.id) === (payload._id || payload.id)
      );
      if (exists) {
        return {
          ...state,
          cartItems: state.cartItems.map((item) =>
            (item._id || item.id) === (payload._id || payload.id)
              ? { ...item, quantity: (item.quantity || 1) + 1 }
              : item
          ),
        };
      }
      return { ...state, cartItems: [...state.cartItems, { ...payload, quantity: 1 }] };
    }
    case REMOVE_FROM_CART:
      return { ...state, cartItems: state.cartItems.filter((item) => (item._id || item.id) !== payload) };
    case UPDATE_CART_QUANTITY:
      return { ...state, cartItems: state.cartItems.map((item) =>
        (item._id || item.id) === payload.id ? { ...item, quantity: payload.quantity } : item
      )};
    case CLEAR_CART:
      return { ...state, cartItems: [] };
    default:
      return state;
  }
};