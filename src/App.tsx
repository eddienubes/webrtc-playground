import { useRef } from "react";
import "./index.css";

export const App = () => {
	const getMedia = async () => {
		console.log('requesting media')
		try {
			const media = await navigator.mediaDevices.getUserMedia({
				audio: true,
				video: true
			})
			console.log('got media', media)
			const conn = new RTCPeerConnection()
			for (const track of media.getTracks()) {
				conn.addTrack(track)
			}
			const offer = await conn.createOffer()
			await conn.setLocalDescription(offer)
			if (videoRef.current) {
				console.log('set video element')
				videoRef.current.srcObject = media
			}
		} catch (e) {
			console.error('media error', e)
		}
	}
	const videoRef = useRef<HTMLVideoElement>(null)
	// const connection = new RTCPeerConnection()
	// connection.addTrack()
	// connection.setLocalDescription()

	return <div>
		<button onClick={getMedia}>Request Media</button>
		<video ref={videoRef} autoPlay></video>
	</div>;
};
