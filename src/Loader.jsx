import { Html, useProgress } from '@react-three/drei'
import { useEffect } from 'react'

function Loader({isLoading}) {
    // const { active, progress, errors, item, loaded, total } = useProgress()

    // useEffect(() => {
    //     console.log(progress)
    // }, [progress])
    return (
        <>
            <div
                className={`web-gl-loader`}
                style={
                    isLoading
                        ? { visibility: 'visible', opacity: '1' }
                        : { visibility: 'hidden', opacity: '0' }
                }
            >
                <img
                    src="/images/loaders/res-actions.svg"
                    style={{ width: '32px', height: '32px' }}
                ></img>
                {/* <div
                    className="loading-runner"
                    style={{ width: `${progress}%` }}
                ></div> */}
            </div>
        </>
    )
}

export default Loader
