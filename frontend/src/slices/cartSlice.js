import { createSlice } from '@reduxjs/toolkit';

// Carrega carrinho do usuário atual (se houver) ou vazio
const getInitialCart = () => {
  try {
    const userInfo = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;
    if (!userInfo) return [];
    const key = `cartItems_${userInfo._id}`;
    return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : [];
  } catch {
    return [];
  }
};

const saveCart = (userId, items) => {
  if (userId) {
    localStorage.setItem(`cartItems_${userId}`, JSON.stringify(items));
  }
};

const getUserId = () => {
  try {
    const u = localStorage.getItem('userInfo');
    return u ? JSON.parse(u)._id : null;
  } catch { return null; }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: { cartItems: getInitialCart() },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }

      saveCart(getUserId(), state.cartItems);
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      saveCart(getUserId(), state.cartItems);
    },

    clearCart: (state) => {
      state.cartItems = [];
      // Não apaga o localStorage do usuário — só zera o state em memória
      // (após finalizar compra)
      const uid = getUserId();
      if (uid) localStorage.removeItem(`cartItems_${uid}`);
    },

    // Chamado no login: carrega o carrinho salvo do usuário que logou
    loadCartForUser: (state, action) => {
      const userId = action.payload;
      try {
        const saved = localStorage.getItem(`cartItems_${userId}`);
        state.cartItems = saved ? JSON.parse(saved) : [];
      } catch {
        state.cartItems = [];
      }
    },

    // Chamado no logout: limpa o state mas mantém o localStorage do usuário
    unloadCart: (state) => {
      state.cartItems = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart, loadCartForUser, unloadCart } = cartSlice.actions;
export default cartSlice.reducer;
