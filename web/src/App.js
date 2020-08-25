import React from 'react';
import './App.css';
import Slider from '@material-ui/core/Slider';
function App() {
  const on_change = (o,v) =>{
    console.log(v)
    fetch(`http://localhost:8000/analog/3/${v}`)
  }
  return (
    <div className="App">
      <header className="App-header">
        <Slider
          style={{width:'90vw'}}
          min={0}
          max={255}
          onChange={on_change}
          defaultValue={0}
        />
      </header>
    </div>
  );
}

export default App;
