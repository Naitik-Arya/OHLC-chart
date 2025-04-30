import { useEffect, useState } from 'react'
import './App.css'
import { useDispatch, useSelector } from 'react-redux'
import { fetchStatusRequest } from './store/slices/statusSlice'
import Candle from './components/Candle';
import OrderBook  from './components/Book';
import tradeIcon from './assets/trade.png';
import settingIcon from './assets/settings.png';
import searchIcon from './assets/search.png'
import cameraIcon from './assets/camera.png'
import fullscreenIcon from './assets/fullscreen.png'
import clickIcon from './assets/clicks.png'
import lineIcon from './assets/line.png'
import meshIcon from './assets/mesh.png'
import brushIcon from './assets/brush.png'
import textIcon from './assets/text.png'
import smileIcon from './assets/smile.png'


function App() {
  const dispatch = useDispatch();
  const {data, loading, error} = useSelector((state) => state.status);
  const [showCandle, setShowCandle] = useState(true);
  const [showOrderBook, setShowOrderBook] = useState(true);

  useEffect(() => {
    dispatch(fetchStatusRequest());
  },[dispatch]);

  console.log(data);

  return(
    <>
      <div className="header">
                <div className="left">
                  <button>30m</button>
                  <div className="vl"></div>
                  <button><img src={tradeIcon} alt="" srcset="" /></button>
                  <div className="vl"></div>
                  <button> <span>&#x1D453;&#x1D465;</span> indicators</button>
                </div>
                <div className="right">
                  <button>save</button>
                  <button>&#x2193;</button>
                  <div className="vl"></div>
                  <button><img src={cameraIcon} alt="" /></button>
                  <button><img src={fullscreenIcon} alt="" srcset="" /></button> 
                  <button><img src={searchIcon} alt="" /></button>  
                  <button><img src={settingIcon} alt="" srcset="" /></button> 

                </div>
      </div>
      <div className="app-container">
              <div className="sidebar">
                  <button className="icon-btn"><img src={clickIcon} alt="" srcset="" /></button>
                  <button className="icon-btn"><img src={lineIcon} alt="" /></button>
                  <button className="icon-btn"><img src={meshIcon} alt="" srcset="" /></button>
                  <button className="icon-btn"><img src={brushIcon} alt="" srcset="" /></button>
                  <button className="icon-btn"><img src={textIcon} alt="" srcset="" /></button>
                  <button className="icon-btn"><img src={smileIcon} alt="" srcset="" /></button>

                  <button className="icon-btn">⚙️</button>
              </div>
              <div className="chart-area">
              <div className="show">
                <button onClick={() => setShowCandle(!showCandle)}>
                {showCandle ? '\u2193' : '\u2192'}
                </button>
                <span style={{color:'#c6cbcf'}}>CHART </span>
                <span style={{color:'#586871'}}>BTC/USD</span>
              </div>
              {showCandle && <Candle />}
              <div className="show">
                <button onClick={() => setShowOrderBook(!showOrderBook)}>
                {showOrderBook ? '\u2193' : '\u2192'}
                </button>
                <span style={{color:'#c6cbcf'}}>CHART </span>
                <span style={{color:'#586871'}}>BTC/USD</span>
              </div>
              {showOrderBook && <OrderBook />}
              </div>
        </div>
    </>
  );
}

export default App
  