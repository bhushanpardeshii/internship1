import "./global.css";
import { FirstData, SecondData, ThirdData } from './utils/datapoints';
import { ColorType, createChart } from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';
function App() {
  const chartContainerRef = useRef();
  const toolipRef = useRef();

  const [FirstchartPrice, setFirstchartPrice] = useState(null);
  const [SecondchartPrice, setSecondchartPrice] = useState(null);
  const [ThirdchartPrice, setThirdchartPrice] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [showFirstChart, setShowFirstChart] = useState(true);
  const [showSecondChart, setShowSecondChart] = useState(true);
  const [showThirdChart, setShowThirdChart] = useState(true);

  useEffect(() => {

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "white" }
      },
      width: chartContainerRef.current.clientwidth,
      height: 500,

    })
    chart.timeScale().fitContent();


    const FirstChart = chart.addAreaSeries({
      visible: showFirstChart,
      lineColor: '#2962FF', topColor: '#2962FF',
      bottomColor: 'rgba(41, 98, 255, 0.28)',
    });


    const SecondChart = chart.addAreaSeries({
      visible: showSecondChart,
      lineColor: '#FFC64C', topColor: '#FDEE00',
      bottomColor: 'rgba(255,240,100,0.60)',
    });
    const ThirdChart = chart.addAreaSeries({
      visible: showThirdChart,
      lineColor: '#004C00', topColor: '#008D00',
      bottomColor: 'rgba(0,255,209,0.50)',
    });

    FirstChart.setData(FirstData);
    SecondChart.setData(SecondData);
    ThirdChart.setData(ThirdData);

    chart.subscribeCrosshairMove((param) => {
      if (param.time) {
        const Firstchartdata = param.seriesData.get(FirstChart);
        setFirstchartPrice(Firstchartdata);
        const coordinate = FirstChart.priceToCoordinate(Firstchartdata.value)
        const shiftedCoordinate = param.point.x;


        toolipRef.current.style.left = shiftedCoordinate + "px";
        toolipRef.current.style.top = coordinate + "px";
        const Secondchartdata = param.seriesData.get(SecondChart);
        setSecondchartPrice(Secondchartdata);

        const Thirdchartdata = param.seriesData.get(ThirdChart);
        setThirdchartPrice(Thirdchartdata);
        setCurrentTime(param.time);

      }
    });

    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
      })
    };
    window.addEventListener("resize", handleResize);

    return () => {
      chart.remove();
      window.removeEventListener('resize', handleResize);
    };
  }, [showSecondChart, showFirstChart, showThirdChart]);

  const toggleFirstChartVisibility = () => {
    setShowFirstChart(prevState => !prevState);

  }; const toggleSecondChartVisibility = () => {
    setShowSecondChart(prevState => !prevState);

  }; const toggleThirdChartVisibility = () => {
    setShowThirdChart(prevState => !prevState);

  };


  return <div>
    <div ref={chartContainerRef} style={{ position: 'relative' }}></div>
    <div ref={toolipRef} style={{
      position: 'absolute',
      width: 120,
      height: 150,
      border: '1px solid',
      borderRadius: '5px',
      color: "black",
      backgroundColor: "white",
      padding: 4,
      zIndex: 2,
    }}>
      <p>{currentTime}</p>
      {showFirstChart && (
        <p><b>Stock A </b>  {FirstchartPrice?.value}</p>
      )}

      {showSecondChart && (
        <p><b>Stock B </b>  {SecondchartPrice?.value}</p>
      )}

      {showThirdChart && (
        <p><b>Stock C </b>  {ThirdchartPrice?.value}</p>
      )}

    </div>
    <div className='buttons'>


      <button style={{
        position: 'absolute',
        top: '85%',
        left: '20%',
        padding: '10px 20px',
        backgroundColor: '#2962FF',
        color: 'black',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',

      }}
        onClick={toggleFirstChartVisibility}>
        {showFirstChart ? 'Hide Stock A' : 'Show Stock A'}
      </button>

      <button style={{
        position: 'absolute',
        top: '85%',
        left: '40%',
        padding: '10px 20px',
        backgroundColor: '#FDEE00',
        color: 'black',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
      }}
        onClick={toggleSecondChartVisibility}>
        {showSecondChart ? 'Hide Stock B' : 'Show Stock B '}
      </button>

      <button style={{
        position: 'absolute',
        top: '85%',
        left: '60%',
        padding: '10px 20px',
        backgroundColor: '#008D00',
        color: 'black',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',

      }}
        onClick={toggleThirdChartVisibility}>
        {showThirdChart ? 'Hide Stock C' : 'Show Stock C'}
      </button>
    </div>

  </div>

}

export default App;
