import './style.css';

import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

import {
    startWebcam,
    stopWebcam
} from './webcam.js';

import {
    initializePose,
    detectPose
} from './pose.js';

// ========================================
// Mode
// ========================================

let currentMode = 'normal';

//Webカメラから取得する腕の広がり
let armSpread = 0;
//Webカメラから取得する腕の上がり具合
let armRaise = 0;

// ========================================
// Scene
// ========================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x000000);

// 少しだけ霧を入れる
scene.fog = new THREE.Fog(
    0x000000,
    5,
    25
);


// ========================================
// Camera
// ========================================

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);

// 人間の目線くらい
camera.position.set(
    0,
    1.6,
    8
);

// ========================================
// Audio Listener
// ========================================

const listener = new THREE.AudioListener();

camera.add(listener);


// ========================================
// Renderer
// ========================================

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

document.body.appendChild(renderer.domElement);

// ========================================
// Mode UI
// ========================================

const modeButton = document.createElement('button');

modeButton.textContent = 'Webカメラモード';

modeButton.id = 'modeButton';

document.body.appendChild(modeButton);

const webcamVideo =
    document.createElement('video');

webcamVideo.id = 'webcamVideo';

webcamVideo.autoplay = true;
webcamVideo.playsInline = true;
webcamVideo.muted = true;

webcamVideo.style.display = 'none';

document.body.appendChild(webcamVideo);

modeButton.addEventListener('click', async (event) => {

    event.stopPropagation();

    // ========================================
    // Normal → Webcam
    // ========================================

    if (currentMode === 'normal') {

        const success =
            await startWebcam(webcamVideo);

        if (!success) {
            return;
        }

        //MediaPipeを初期化
        await initializePose();

        currentMode = 'webcam';

        if (controls.isLocked) {
            controls.unlock();
        }
        
        webcamVideo.style.display = 'block';

        webcamVideo.style.display =
            'block';

        modeButton.textContent =
            '通常モード';

        console.log(
            'Webカメラモードに変更'
        );
    }

    // ========================================
    // Webcam → Normal
    // ========================================

    else {

        stopWebcam(webcamVideo);

        currentMode = 'normal';

        // ========================================
        // Webcam Interaction Reset
        // ========================================
        
        armSpread = 0;
        armRaise = 0;
        
        ring1.scale.setScalar(1);
        ring2.scale.setScalar(1);

        webcamVideo.style.display =
            'none';

        modeButton.textContent =
            'Webカメラモード';

        console.log(
            '通常モードに変更'
        );
    }

});


// ========================================
// PointerLockControls
// ========================================

const controls = new PointerLockControls(
    camera,
    document.body
);


// ========================================
// クリックで操作開始
// ========================================

document.addEventListener('click', () => {

    // UIをクリックした場合はPointerLockしない
    if (
        event.target === modeButton ||
        event.target === webcamVideo
    ) {
        return;
    }

    controls.lock();

    if (
        sculptureSound.buffer &&
        !sculptureSound.isPlaying
    ) {
        sculptureSound.play();
    }

});


// ========================================
// Floor
// ========================================

const floorGeometry = new THREE.PlaneGeometry(
    40,
    40
);

const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x080808,
    roughness: 1
});

const floor = new THREE.Mesh(
    floorGeometry,
    floorMaterial
);

// Planeは最初縦向きなので90度倒す
floor.rotation.x = -Math.PI / 2;

floor.position.y = 0;

scene.add(floor);


// ========================================
// Abstract Sculpture
// ========================================

// 彫刻全体をまとめるGroup
const sculpture = new THREE.Group();

sculpture.position.set(0, 3, 0);

scene.add(sculpture);


// 共通マテリアル
const sculptureMaterial = new THREE.MeshStandardMaterial({
    color: 0x11141a,
    emissive: 0x6688aa,
    emissiveIntensity: 0,
    roughness: 0.35,
    metalness: 0.7
});


// ========================================
// Core
// ========================================

const coreGeometry = new THREE.IcosahedronGeometry(
    1.2,
    2
);

const core = new THREE.Mesh(
    coreGeometry,
    sculptureMaterial
);

core.scale.set(
    0.8,
    1.8,
    0.8
);

sculpture.add(core);


// ========================================
// Upper Object
// ========================================

const upperGeometry = new THREE.IcosahedronGeometry(
    0.65,
    1
);

const upper = new THREE.Mesh(
    upperGeometry,
    sculptureMaterial
);

upper.position.set(
    0.3,
    2,
    0
);

upper.rotation.z = 0.5;

sculpture.add(upper);


// ========================================
// Lower Object
// ========================================

const lowerGeometry = new THREE.OctahedronGeometry(
    0.8,
    0
);

const lower = new THREE.Mesh(
    lowerGeometry,
    sculptureMaterial
);

lower.position.set(
    -0.3,
    -2,
    0
);

lower.scale.set(
    0.7,
    1.3,
    0.7
);

lower.rotation.z = -0.3;

sculpture.add(lower);


// ========================================
// Ring 1
// ========================================

const ringGeometry = new THREE.TorusGeometry(
    1.8,
    0.05,
    8,
    80
);

const ringMaterial = new THREE.MeshStandardMaterial({
    color: 0x223344,
    emissive: 0x88bbff,
    emissiveIntensity: 0,
    metalness: 0.8,
    roughness: 0.2
});

const ring1 = new THREE.Mesh(
    ringGeometry,
    ringMaterial
);

ring1.rotation.x = Math.PI / 2;

sculpture.add(ring1);


// ========================================
// Ring 2
// ========================================

const ring2 = new THREE.Mesh(
    ringGeometry,
    ringMaterial
);

ring2.rotation.y = Math.PI / 2;
ring2.rotation.x = 0.4;

sculpture.add(ring2);

// ========================================
// Sculpture Audio
// ========================================

const sculptureSound =
    new THREE.PositionalAudio(listener);

const audioLoader =
    new THREE.AudioLoader();

audioLoader.load(
    '/sounds/sculpture-bgm.mp3',

    (buffer) => {

        sculptureSound.setBuffer(buffer);

        sculptureSound.setLoop(true);

        sculptureSound.setVolume(0);

        sculptureSound.setRefDistance(2);

    }
);

sculpture.add(sculptureSound);


// ========================================
// Sculpture Particles
// ========================================

const particleCount = 50;

const particleGeometry =
    new THREE.BufferGeometry();

const particlePositions =
    new Float32Array(particleCount * 3);

const particleBaseY =
    new Float32Array(particleCount);


// 彫刻の周囲にランダム配置
for (let i = 0; i < particleCount; i++) {

    const i3 = i * 3;

    // 彫刻を中心としたランダムな位置
    const radius =
        2.5 + Math.random() * 2.5;

    const angle =
        Math.random() * Math.PI * 2;

    const height =
        (Math.random() - 0.5) * 6;

    particlePositions[i3] =
        Math.cos(angle) * radius;

    particlePositions[i3 + 1] =
        height;

    particlePositions[i3 + 2] =
        Math.sin(angle) * radius;
    
    particleBaseY[i] = height;
}


// Geometryに位置情報を設定
particleGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(
        particlePositions,
        3
    )
);


// Particleの見た目
const particleMaterial =
    new THREE.PointsMaterial({

        color: 0x88bbff,

        size: 0.06,

        transparent: true,

        opacity: 0.15,

        depthWrite: false

    });


// Particleを生成
const particles =
    new THREE.Points(
        particleGeometry,
        particleMaterial
    );


// 彫刻の子にする
sculpture.add(particles);


// ========================================
// Sculpture Light
// ========================================

const sculptureLight = new THREE.PointLight(
    0x88aaff,
    0,
    12
);

sculptureLight.position.set(
    0,
    4,
    2
);

scene.add(sculptureLight);


// ========================================
// Key Input
// ========================================

const keys = {
    forward: false,
    backward: false,
    left: false,
    right: false
};


document.addEventListener('keydown', (event) => {

    switch (event.code) {

        case 'KeyW':
            keys.forward = true;
            break;

        case 'KeyS':
            keys.backward = true;
            break;

        case 'KeyA':
            keys.left = true;
            break;

        case 'KeyD':
            keys.right = true;
            break;

    }

});


document.addEventListener('keyup', (event) => {

    switch (event.code) {

        case 'KeyW':
            keys.forward = false;
            break;

        case 'KeyS':
            keys.backward = false;
            break;

        case 'KeyA':
            keys.left = false;
            break;

        case 'KeyD':
            keys.right = false;
            break;

    }

});


// ========================================
// Movement
// ========================================

const clock = new THREE.Clock();

const moveSpeed = 3;

let elapsedTime = 0;

// ========================================
// Sculpture Interaction
// ========================================

// この距離から反応開始
const reactionDistance = 10;

// この距離でほぼ最大反応
const maxReactionDistance = 2;


// ========================================
// Animation Loop
// ========================================

function animate() {

    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    elapsedTime += delta;

    // ========================================
    // Webcam Pose Detection
    // ========================================
    
    // ========================================
    // Webcam Pose Detection
    // ========================================
    
    if (currentMode === 'webcam') {
        
        const landmarks =
            detectPose(webcamVideo);
            
        if (landmarks) {
            
            // 左右の肩
            const leftShoulder =
                landmarks[11];
                
            const rightShoulder =
                landmarks[12];
            
            // 左右の手首
            const leftWrist =
                landmarks[15];
                
            const rightWrist =
                landmarks[16];
                
            // ========================================
            // 肩幅を計算
            // ========================================
            // 
            const shoulderWidth =
                Math.abs(
                    leftShoulder.x -
                    rightShoulder.x
                );
            
            // ========================================
            // 左右の手首の距離
            // ========================================
            
            const wristDistance =
                Math.abs(
                    leftWrist.x -
                    rightWrist.x
                );
                
            // ========================================
            // 腕の広がりを0～1に変換
            // ========================================
            
            if (shoulderWidth > 0.01) {
                
                const spreadRatio =
                    wristDistance /
                    shoulderWidth;
                
                const targetArmSpread =
                    THREE.MathUtils.clamp(
                        (spreadRatio - 1.0) / 2.0,
                        0,
                        1
                    );

                armSpread =
                    THREE.MathUtils.lerp(
                        armSpread,
                        targetArmSpread,
                        0.1
                    );
                
                // ========================================
                // 腕の高さを0～1に変換
                // ========================================
                
                // 左右の手首の平均Y座標
                const averageWristY =
                    (leftWrist.y + rightWrist.y) / 2;
                    
                // 左右の肩の平均Y座標
                const averageShoulderY =
                    (leftShoulder.y + rightShoulder.y) / 2;
                    
                // MediaPipeでは上に行くほどYが小さくなる
                const raiseAmount =
                    averageShoulderY - averageWristY;
                    
                // 腕を上げた量を0～1へ変換
                const targetArmRaise =
                    THREE.MathUtils.clamp(
                        raiseAmount / 0.3,
                        0,
                        1
                    );
                    
                // 急激に変化しないよう滑らかにする
                armRaise =
                    THREE.MathUtils.lerp(
                        armRaise,
                        targetArmRaise,
                        0.1
                    );
            }
            
            console.log(
                'armSpread:',
                armSpread.toFixed(2)
            );
        } else {
            
            armSpread =
                THREE.MathUtils.lerp(
                    armSpread,
                    0,
                    0.05
                );
                
            armRaise =
                THREE.MathUtils.lerp(
                    armRaise,
                    0,
                    0.05
                );
        }
    }

    // PointerLock中だけ移動
    if (currentMode ==='normal' && controls.isLocked) {

        const distance = moveSpeed * delta;

        if (keys.forward) {
            controls.moveForward(distance);
        }

        if (keys.backward) {
            controls.moveForward(-distance);
        }

        if (keys.left) {
            controls.moveRight(-distance);
        }

        if (keys.right) {
            controls.moveRight(distance);
        }

    }

    // ========================================
    // Webcam Sculpture Interaction
    // ========================================
    
    if (currentMode === 'webcam') {
        
        const ringScale =
            1 + armSpread * 0.5;
        
        ring1.scale.setScalar(
            ringScale
        );
        
        ring2.scale.setScalar(
            ringScale
        );

        // 腕を広げるほどRingが回転
        ring1.rotation.z +=
            armSpread * 0.003;
            
        ring2.rotation.z -=
            armSpread * 0.002;
    }

    // ========================================
    // Distance Interaction
    // ========================================

    // Playerと彫刻の距離
    const distanceToSculpture =
        camera.position.distanceTo(sculpture.position);

    // 距離を 0 ～ 1 に変換
    const reaction = THREE.MathUtils.clamp(
        (reactionDistance - distanceToSculpture) /
        (reactionDistance - maxReactionDistance),
        0,
        1
    );

    // 反応を滑らかにする
    const smoothReaction = THREE.MathUtils.smoothstep(
        reaction,
        0,
        1
    );
    
    // ========================================
    // Light Interaction
    // ========================================
    
    if (currentMode === 'webcam') {
        
        // Webカメラモード
        sculptureMaterial.emissiveIntensity =
            armRaise * 2.5;
            
        ringMaterial.emissiveIntensity =
            armRaise * 4;
            
        sculptureLight.intensity =
            armRaise * 50;
    
    } else {
        
        // 通常モード
        sculptureMaterial.emissiveIntensity =
            smoothReaction * 1.5;
            
        ringMaterial.emissiveIntensity =
            smoothReaction * 3;
        
        sculptureLight.intensity =
            smoothReaction * 40;
    }

    // 彫刻の回転速度
    sculpture.rotation.y +=
        reaction * 0.005;

    
    // 音量
    if (sculptureSound.isPlaying) {
        sculptureSound.setVolume(
            smoothReaction * 0.35
        );
    }

    // ======================================== 
    // Particle Interaction
    // ========================================
    // 近づくほどParticleが見える
    if (currentMode === 'webcam') {
        
        particleMaterial.opacity =
            0.1 + armRaise * 0.7;
    
    } else {
        
        particleMaterial.opacity =
            0.05 + smoothReaction * 0.55;        
    }

    // ゆっくり回転
    particles.rotation.y +=
        smoothReaction * 0.002;
        
    // 呼吸するような拡大縮小
    const particleBreath =
        Math.sin(elapsedTime * 0.7)
        * 0.05
        * smoothReaction;
    
    const webcamExpansion =
    currentMode === 'webcam'
        ? armSpread * 0.4
        : 0;

    particles.scale.setScalar(
        1 + particleBreath+webcamExpansion
    );

    // 個々のParticleを上下させる
    const positions =
        particleGeometry.attributes.position.array; 
    
    for (let i = 0; i < particleCount; i++) {
        
        const i3 = i * 3;
        
        positions[i3 + 1] =
            particleBaseY[i]
            + Math.sin(
                elapsedTime * 0.5 + i
            )
            * 0.15
            * smoothReaction;
    }
    
    particleGeometry.attributes.position.needsUpdate =
        true;

    renderer.render(
        scene,
        camera
    );

}

animate();


// ========================================
// Window Resize
// ========================================

window.addEventListener('resize', () => {

    camera.aspect =
        window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

});