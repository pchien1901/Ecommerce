
import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Login, Home, Public} from './pages/public';
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
        </Route>
      </Routes>
    </div>
  );
}

export default App;
