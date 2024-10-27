
import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Login, Home, Public, Product, ProductDetail, Blog, FAQ, Service} from './pages/public';
import path from './ultis/path';
import { getProductCategories } from './store/app/asyncAction';
import { useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    console.log("Chạy useEffect")
    dispatch(getProductCategories());
  }, []);
  return (
    <div className="min-h-screen overflow-y-auto font-main">
      <Routes>
        <Route path={path.PUBLIC} element={ <Public/> }>
          <Route path={path.HOME} element= { <Home/> }/>
          <Route path={path.LOGIN} element= { <Login/> }/>
          <Route path={path.BLOGS} element={ <Blog/>}/>
          <Route path={path.PRODUCTS} element={ <Product/>}/>
          <Route path={path.PRODUCT_DETAIL__PID__TITLE} element={ <ProductDetail/>}/>
          <Route path={path.FAQ} element={ <FAQ/>}/>
          <Route path={path.OUR_SERVICES} element={ <Service/>}/>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
