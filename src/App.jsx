import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Three from './components/Three'
import Lights from './components/Lights'
import Raycasting from './components/Raycasting'
import GltfModel from './components/GltfModel'
import Test from './components/Test'
import Test2 from './components/Test2'
import Final from './components/Final'
import LineDrow from './LineDrow'
import NewTest from './NewTest'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      {/* <Three/> */}
      {/* <LineDrow/> */}
      {/* <Lights/> */}
      {/* <NewTest/> */}
      {/* <Test2/> */}
      <Final/>
      {/* <GltfModel/> */}
      {/* <Test/> */}
      {/* <Raycasting/> */}
    </div>
  )
}

export default App
