import { useState } from 'react';
import ElectricityChart from './components/ElectricityChart';
import LocationMap from './components/LocationMap';
import './App.css';
import EolienneChart from './components/EolienneChart';

function App() {
  const [count, setCount] = useState(0);
  const [location, setLocation] = useState([51.1657, 10.4515]); // Default location: Germany

  const handleLocationSelect = (newLocation) => {
    setLocation(newLocation);
  };
  return (
    <div className="w-full h-full px-5 py-5 flex flex-col items-center justify-center bg-custom-gradient gap-10 overflow-hidden">
      <div className='flex-1/2 w-full flex flex-row items-center justify-between overflow-hidden gap-10'>
        {/* 2 lignes de bubbles avec information sur la région, le nombre de Gigawhat actuel, une indication de % supérieur par rapport à la moyenne */}
        <div className='flex flex-col items-center justify-center flex-1/2 h-full gap-5 overflow-hidden'>

          <div className='flex flex-row items-center justify-between w-full flex-1/2 gap-5 overflow-hidden'>
            <div className='flex-2/3 h-full text-white rounded-lg flex flex-col px-5 justify-center bg-custom-black relative gap-5' >
              <div className='flex flex-row gap-5'>
                <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png" class="object-fill w-4 h-auto"/>
                <p className='text-lg bottom-10'>Your location :</p>
              </div>
              <h2 className='font-bold text-6xl mb-10'>Hameln</h2>
            </div>

            <div className='flex-1/3 max-h-full aspect-square text-white rounded-lg flex flex-col items-center justify-center bg-custom-black relative' >
              <h2 className='font-bold text-6xl mb-10'>345Gw</h2>
              <p className='text-md text-center absolute bottom-5'>Of green Energy<br/>in your region</p>
            </div>
          </div>

          <div className='flex flex-row items-center justify-between w-full gap-5 flex-1/2 overflow-hidden'>
            <div className='flex-1/3 max-h-full aspect-square text-white rounded-lg flex flex-col items-center justify-center bg-custom-black relative' >
              <h2 className='font-bold text-6xl mb-10'>+10%</h2>
              <p className='text-md text-center absolute bottom-5'>in the next hour</p>
            </div>

            <div className='flex-1/3 max-h-full aspect-square text-white rounded-lg flex flex-col items-center justify-center bg-custom-black relative' >
              <h2 className='font-bold text-6xl mb-10'>+50%</h2>
              <p className='text-md text-center absolute bottom-5'>Above average</p>
            </div>

            <div className='flex-1/3 max-h-full aspect-square text-white rounded-lg flex flex-col items-center justify-center bg-custom-black relative' >
              <h2 className='font-bold text-6xl mb-10'>110%</h2>
              <p className='text-md text-center absolute bottom-5'>of production in the next hour</p>
            </div>
          </div>

        </div>

        {/* Haut à droite du tableau */}
        <div className='flex-1/2 dark-glass'>
          <ElectricityChart />
        </div>
      
      </div>

      {/* Map for selecting location */}
      <div className='w-full flex-1/2 flex flex-row items-center justify-between gap-10'>

        <div className='flex-1/2 h-full flex flex-col items-center justify-center rounded-xl overflow-hidden'>
          <LocationMap onLocationSelect={handleLocationSelect} />
        </div>
      <div className='flex-1/2 dark-glass'>
          <EolienneChart/>
        </div>
      </div>

    </div>
  );
}

export default App;