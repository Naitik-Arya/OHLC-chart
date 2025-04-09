import { useEffect, useState } from 'react'
import './App.css'
import { useDispatch, useSelector } from 'react-redux'
import { fetchStatusRequest } from './store/slices/statusSlice'
import Candle from './components/Candle';

function App() {
  const dispatch = useDispatch();
  const {data, loading, error} = useSelector((state) => state.status);

  useEffect(() => {
    dispatch(fetchStatusRequest());
  },[dispatch]);

  console.log(data);

  return(
    <div className="app-container">
            <div className="sidebar">
                <button className="icon-btn">🖊️</button>
                <button className="icon-btn">📈</button>
                <button className="icon-btn">🔍</button>
                <button className="icon-btn">⚙️</button>
                {/* Add more as needed */}
            </div>
            <div className="chart-area">
                <Candle />
            </div>
      </div>
  );
}

export default App
