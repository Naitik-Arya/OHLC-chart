import { useEffect, useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCandleRequest } from "../store/slices/candleSlice";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import 'highcharts/css/highcharts.css';
import './Candle.css';


function Candle() {
    const dispatch = useDispatch();
    const { data, loading, error } = useSelector((state) => state.candle);
    const [ohlcData, setOhlcData] = useState([]);
    const [chartSize, setChartSize] = useState({
        width: window.innerWidth - 60, // Subtract sidebar width
        height: window.innerHeight
      });

    
    // Create a ref for the chart component
    const chartComponentRef = useRef(null);

    // Fetch data when component mounts
    useEffect(() => {
        dispatch(fetchCandleRequest());
    }, [dispatch]);

    // Format data only when `data` changes
    useEffect(() => {
        if (data && data.length > 0) {
            const formattedData = data.map((d) => [d[0], d[1], d[3], d[4], d[2]]);
            setOhlcData(formattedData.sort((a, b) => a[0] - b[0]));
        }
    }, [data]);

    useEffect(() => {
        const handleResize = () => {
          setChartSize({
            width: window.innerWidth - 60, // minus sidebar
            height: window.innerHeight
          });
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, []);
    

     // Set up WebSocket connection for real-time updates
  useEffect(() => {

    const ws = new WebSocket("wss://api-pub.bitfinex.com/ws/2");

    ws.onopen = () => {
      console.log("WebSocket connected");
      const subMsg = {
        event: "subscribe",
        channel: "candles",
        key: "trade:1m:tBTCUSD"
      };
      ws.send(JSON.stringify(subMsg));
    };

    

    ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
      
        if (msg.event) {
          console.log("WebSocket event:", msg);
          return;
        }
      
        const dataPayload = msg[1];
        if (!dataPayload || dataPayload === "hb") return;
      
        if (Array.isArray(dataPayload[0])) {
          // Snapshot case
          const formattedSnapshot = dataPayload.map((item) => [
            item[0], // timestamp
            item[1], // open
            item[3], // high
            item[4], // low
            item[2], // close
          ]);
          
          setOhlcData(formattedSnapshot.sort((a, b) => a[0] - b[0]));
      
          if (chartComponentRef.current?.chart?.series[0]) {
            chartComponentRef.current.chart.series[0].setData(formattedSnapshot, true);
          }
        } else {
          // Update case
          const formattedPoint = [
            dataPayload[0],  // timestamp
            dataPayload[1],  // open
            dataPayload[3],  // high
            dataPayload[4],  // low
            dataPayload[2],  // close
          ];
      
          setOhlcData((prevData) => {
            const lastIndex = prevData.findIndex((d) => d[0] === formattedPoint[0]);
            let updatedData;
            if (lastIndex !== -1) {
              // Update existing candle
              updatedData = [...prevData];
              updatedData[lastIndex] = formattedPoint;
            } else {
              updatedData = [...prevData, formattedPoint];
            }
      
            updatedData.sort((a, b) => a[0] - b[0]);
            // return updatedData.slice(-200);
          });
      
          const chart = chartComponentRef.current?.chart;
          if (chart && chart.series[0]) {
            const shouldShift = chart.series[0].data.length >= 200;
            chart.series[0].addPoint(formattedPoint, true, shouldShift);
          }
        }
      };
      

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    // Cleanup: close WebSocket when component unmounts
    return () => {
      ws.close();
    };
  }, []);

    // Memoize chart options for performance
    const options = useMemo(() => ({
        title: { text: "BTC/USD OHLC Candlestick Chart" },
        chart: {
            type: "candlestick",
            zoomType: "x", 
            panning: true, 
            panKey: "shift", 
            styledMode: true,
            height: chartSize.height,
            width: chartSize.width,
        },
        xAxis: { 
            type: "datetime",
            minRange: 10 * 60 * 1000, 
            scrollbar: { enabled: true }, 
        },
        yAxis: { 
            opposite: true,
            title: { text: "Price" } 
        },
        rangeSelector: { enabled: true },
        navigator: { enabled: true },
        series: [
            {
                type: "candlestick",
                name: "BTC/USD",
                data: ohlcData,
                dataGrouping: { enabled: true }
            },
        ],
    }), [ohlcData,chartSize,]);



    return (
        <div className="chart-container">
            {loading && <p className="loading">Loading...</p>}
            {error && <p className="error">Error: {error}</p>}
            {!loading && !error && (
                <div className="chart-wrapper">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={options}
                  ref={chartComponentRef}
                  containerProps={{ style: { height: "100%", width: "100%" } }}
                />
              </div>
            )}
        </div>
    );
}

export default Candle;
