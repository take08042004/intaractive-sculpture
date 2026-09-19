let stream = null;

export async function startWebcam(videoElement) {

    try {

        stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        });

        videoElement.srcObject = stream;

        await videoElement.play();

        console.log('Webカメラを開始しました');

        return true;

    } catch (error) {

        console.error(
            'Webカメラを開始できませんでした:',
            error
        );

        return false;
    }
}


export function stopWebcam(videoElement) {

    if (stream) {

        stream.getTracks().forEach((track) => {
            track.stop();
        });

        stream = null;
    }

    videoElement.srcObject = null;

    console.log('Webカメラを停止しました');
}