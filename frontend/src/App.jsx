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
import Footer                from './components/Footer.jsx';
import DevelopmentScreen     from './screens/DevelopmentScreen.jsx';
import PrivateRoute          from './components/PrivateRoute.jsx';
import AdminRoute            from './components/AdminRoute.jsx';

import AdminOverviewScreen   from './screens/admin/AdminOverviewScreen.jsx';
import AdminProductsScreen   from './screens/admin/AdminProductsScreen.jsx';
import AdminOrdersScreen     from './screens/admin/AdminOrdersScreen.jsx';
import AdminUsersScreen      from './screens/admin/AdminUsersScreen.jsx';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="app-container">
          <Header/>
            <main className="main-content">
              <Routes>
                {/* Público */}
                <Route path="/"                          element={<HomeScreen />} />
                <Route path="/login"                     element={<LoginScreen />} />
                <Route path="/register"                  element={<RegisterScreen />} />
                <Route path="/product/:id"               element={<ProductScreen />} />

                {/* Usuário logado */}
                <Route element={<PrivateRoute />}>
                  <Route path="/cart"        element={<CartScreen />} />
                  <Route path="/checkout"    element={<CheckoutScreen />} />
                  <Route path="/orders/:id"  element={<OrderScreen />} />
                  <Route path="/orders"      element={<MyOrdersScreen />} />
                  <Route path="/profile"     element={<ProfileScreen />} />
                </Route>

                {/* Admin */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin"          element={<AdminOverviewScreen />} />
                  <Route path="/admin/products" element={<AdminProductsScreen />} />
                  <Route path="/admin/orders"   element={<AdminOrdersScreen />} />
                  <Route path="/admin/users"    element={<AdminUsersScreen />} />
                </Route>

                {/* Em desenvolvimento */}
                <Route path="/contact"   element={ <DevelopmentScreen title="Contato" description="Nosso canal de atendimento está sendo preparado." />} />
                <Route path="/faq"       element={ <DevelopmentScreen title="Perguntas Frequentes" description="Estamos organizando as dúvidas mais comuns." />} />
                <Route path="/privacy"   element={ <DevelopmentScreen title="Política de Privacidade" description="Esta seção estará disponível em breve." />} />
                <Route path="/instagram" element={ <DevelopmentScreen title="Instagram" description="Nossa presença nas redes sociais será lançada em breve." />} />
                <Route path="/facebook"  element={ <DevelopmentScreen title="Facebook" description="Nossa presença nas redes sociais será lançada em breve." />} />
                <Route path="/whatsapp"  element={ <DevelopmentScreen title="WhatsApp" description="Em breve você poderá falar conosco diretamente." />} />
              
                {/* Rota coringa */}
                <Route path="*" element={<DevelopmentScreen title="Página não encontrada" description="A página que você está procurando não existe." />} />
              </Routes>
            </main>
          <Footer/>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
