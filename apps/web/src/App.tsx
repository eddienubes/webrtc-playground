import {
	createRef,
	useCallback,
	useEffect,
	useRef,
	useState,
	type Ref,
} from "react";
import "./index.css";
import "./App.css";

type Participant = {
	id: string;
	media: MediaStream;
};

export const Video = ({ stream }: { stream: MediaStream }) => {
	const ref = useCallback(
		(ref: HTMLVideoElement | null) => {
			if (ref) {
				ref.srcObject = stream;
			}
		},
		[stream],
	);
	return <video ref={ref} autoPlay></video>;
};

export const App = () => {
	const [participants, setParticipants] = useState<Participant[]>([]);

	const getMedia = async () => {
		console.log("requesting media");
		try {
			const devices = await navigator.mediaDevices.enumerateDevices();
			console.log("available media devices", devices);

			const media = await navigator.mediaDevices.getUserMedia({
				audio: {
					echoCancellation: false,
					noiseSuppression: false,
					sampleRate: 48000,
				},
				video: true,
			});
			console.log("got media", media);
			const conn = new RTCPeerConnection();
			for (const track of media.getTracks()) {
				conn.addTrack(track);
			}
			const offer = await conn.createOffer();
			await conn.setLocalDescription(offer);
			setParticipants((prev) => [
				{
					id: crypto.randomUUID(),
					media,
				},
				...prev,
			]);
		} catch (e) {
			console.error("media error", e);
		}
	};

	return (
		<div>
			<button onClick={getMedia}>Request Media</button>
			<div className="videos-container">
				{participants.map((part) => (
					<div key={part.id} className="video">
						<p>{part.id}</p>
						<Video stream={part.media} />
					</div>
				))}
			</div>
		</div>
	);
};
