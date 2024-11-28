import WebGl from './WebGL'

function App() {
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
                    className="logo"
                />
            </a>
            <WebGl />
        </>
    )
}

export default App
