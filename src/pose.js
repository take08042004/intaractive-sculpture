import {
    FilesetResolver,
    PoseLandmarker
} from '@mediapipe/tasks-vision';


let poseLandmarker = null;


// ========================================
// MediaPipe初期化
// ========================================

export async function initializePose() {

    const vision =
        await FilesetResolver.forVisionTasks(
            'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );

    poseLandmarker =
        await PoseLandmarker.createFromOptions(
            vision,
            {
                baseOptions: {
                    modelAssetPath:
                        'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task'
                },

                runningMode: 'VIDEO',

                numPoses: 1
            }
        );

    console.log(
        'MediaPipe Poseを初期化しました'
    );
}


// ========================================
// Pose検出
// ========================================

export function detectPose(video) {

    if (!poseLandmarker) {
        return null;
    }

    if (video.readyState < 2) {
        return null;
    }

    const result =
        poseLandmarker.detectForVideo(
            video,
            performance.now()
        );

    if (
        !result.landmarks ||
        result.landmarks.length === 0
    ) {
        return null;
    }

    return result.landmarks[0];
}