import WebGl from './WebGL'
import { useState } from 'react'

function App() {
    const [glReady, setGlReady] = useState(false)
    return (
        <>
            <img
                src="loader.svg"
                width={36}
                height={36}
                className="loader"
            />
            <a href='https://cafeyvino.vercel.app' target='blank'>
                <img
                    src="logo.svg"
                    width={56}
                    height={56}
                    className={`logo ${glReady && 'logo-visible'}`}
                />
            </a>
            <WebGl onGlReady={setGlReady} />
        </>
    )
}

export default App
