import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider }                      from 'react-redux';
import store                             from './store.js';

import Header                from './components/Header.jsx';
import HomeScreen            from './screens/HomeScreen.jsx';
import LoginScreen           from './screens/LoginScreen.jsx';
import RegisterScreen        from './screens/RegisterScreen.jsx';
import ProductScreen         from './screens/ProductScreen.jsx';
import CartScreen            from './screens/CartScreen.jsx';
import CheckoutScreen        from './screens/CheckoutScreen.jsx';
import OrderScreen           from './screens/OrderScreen.jsx';
import MyOrdersScreen        from './screens/MyOrdersScreen.jsx';
import ProfileScreen         from './screens/ProfileScreen.jsx';

import AdminOverviewScreen   from './screens/admin/AdminOverviewScreen.jsx';
import AdminProductsScreen   from './screens/admin/AdminProductsScreen.jsx';
import AdminOrdersScreen     from './screens/admin/AdminOrdersScreen.jsx';
import AdminUsersScreen      from './screens/admin/AdminUsersScreen.jsx';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Header />
        <main>
          <Routes>
            {/* Público */}
            <Route path="/"                          element={<HomeScreen />} />
            <Route path="/login"                     element={<LoginScreen />} />
            <Route path="/register"                  element={<RegisterScreen />} />
            <Route path="/product/:id"               element={<ProductScreen />} />

            {/* Usuário logado */}
            <Route path="/cart"        element={<CartScreen />} />
            <Route path="/checkout"    element={<CheckoutScreen />} />
            <Route path="/orders/:id"  element={<OrderScreen />} />
            <Route path="/orders"      element={<MyOrdersScreen />} />
            <Route path="/profile"     element={<ProfileScreen />} />

            {/* Admin */}
            <Route path="/admin"          element={<AdminOverviewScreen />} />
            <Route path="/admin/products" element={<AdminProductsScreen />} />
            <Route path="/admin/orders"   element={<AdminOrdersScreen />} />
            <Route path="/admin/users"    element={<AdminUsersScreen />} />
          </Routes>
        </main>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
