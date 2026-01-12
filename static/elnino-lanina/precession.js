// 세차운동 3D 시뮬레이션
let precessionScene, precessionCamera, precessionRenderer, precessionControls;
let earthSystems = [];
let currentYear = 0;
let precessionInitialized = false;

async function initPrecession() {
    if (precessionInitialized) return;

    const container = document.getElementById('precession-canvas');
    if (!container) return;

    // Three.js 모듈 동적 로드
    const THREE = await import('https://unpkg.com/three@0.160.0/build/three.module.js');
    const { OrbitControls } = await import('https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js');

    // Scene 설정
    precessionScene = new THREE.Scene();

    // Camera 설정
    precessionCamera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 5000);
    precessionCamera.position.set(0, 180, 300);

    // Renderer 설정
    precessionRenderer = new THREE.WebGLRenderer({ antialias: true });
    precessionRenderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(precessionRenderer.domElement);

    // OrbitControls 설정
    precessionControls = new OrbitControls(precessionCamera, precessionRenderer.domElement);
    precessionControls.enableDamping = true;
    precessionControls.screenSpacePanning = true;

    // 배경 별빛
    const starCoords = [];
    for (let i = 0; i < 6000; i++) {
        starCoords.push(
            THREE.MathUtils.randFloatSpread(2000),
            THREE.MathUtils.randFloatSpread(2000),
            THREE.MathUtils.randFloatSpread(2000)
        );
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starCoords, 3));
    precessionScene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.8 })));

    // 태양
    const sun = new THREE.Mesh(
        new THREE.SphereGeometry(15, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0xffcc00 })
    );
    precessionScene.add(sun);

    const sunLight = new THREE.PointLight(0xffffff, 15000, 1500);
    precessionScene.add(sunLight);
    precessionScene.add(new THREE.AmbientLight(0x222222));

    // 공전 궤도 (왼쪽 근일점)
    const xRadius = 120, yRadius = 100, offset = 30;
    const orbitCurve = new THREE.EllipseCurve(offset, 0, xRadius, yRadius, 0, 2 * Math.PI, false);
    const points = orbitCurve.getPoints(100);
    precessionScene.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(p.x, 0, p.y))),
        new THREE.LineBasicMaterial({ color: 0x444444 })
    ));

    // 지구 시스템
    const TILT = 23.5 * (Math.PI / 180);
    const orbitPositions = [0.5, 0.75, 0, 0.25]; // 0.5가 왼쪽(근일점)

    orbitPositions.forEach(t => {
        const root = new THREE.Group();
        const pivot = new THREE.Group();

        const earth = new THREE.Mesh(
            new THREE.SphereGeometry(13, 64, 64),
            new THREE.MeshStandardMaterial({ color: 0x1188ff, roughness: 0.8 })
        );

        const axis = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.3, 50, 8),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        const pole = new THREE.Mesh(
            new THREE.SphereGeometry(2, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0xff0000 })
        );
        pole.position.y = 25;
        axis.add(pole);

        pivot.add(earth);
        pivot.add(axis);
        root.add(pivot);

        const pos = orbitCurve.getPoint(t);
        root.position.set(pos.x, 0, pos.y);
        precessionScene.add(root);
        earthSystems.push({ pivot, earth, TILT });
    });

    // 애니메이션 루프
    function animate() {
        requestAnimationFrame(animate);
        earthSystems.forEach(s => s.earth.rotation.y += 0.01);
        precessionControls.update();
        precessionRenderer.render(precessionScene, precessionCamera);
    }

    updatePrecession();
    animate();

    // 리사이즈 핸들러
    window.addEventListener('resize', () => {
        if (!container) return;
        precessionCamera.aspect = container.clientWidth / container.clientHeight;
        precessionCamera.updateProjectionMatrix();
        precessionRenderer.setSize(container.clientWidth, container.clientHeight);
    });

    precessionInitialized = true;
}

function updatePrecession() {
    // 세차운동 각도 (시계 방향)
    const precessionAngle = (currentYear / 26000) * Math.PI * 2;

    earthSystems.forEach((sys) => {
        sys.pivot.rotation.set(0, 0, 0);
        sys.pivot.rotation.y = -precessionAngle;
        sys.pivot.rotation.z = sys.TILT;
    });

    document.getElementById('yearDisplay').innerText = `서기 ${2000 + currentYear} 년`;
}

window.changeYear = (amount) => {
    currentYear += amount;
    updatePrecession();
};

window.resetYear = () => {
    currentYear = 0;
    updatePrecession();
    if (precessionCamera && precessionControls) {
        precessionCamera.position.set(0, 180, 300);
        precessionControls.target.set(0, 0, 0);
    }
};

// 밀란코비치 섹션이 활성화될 때 초기화
function checkAndInitPrecession() {
    const section = document.getElementById('milankovitch-section');
    if (section && section.classList.contains('active')) {
        initPrecession();
    }
}

// DOM 로드 후 체크
document.addEventListener('DOMContentLoaded', () => {
    // 네비게이션 버튼 클릭 시 체크
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setTimeout(checkAndInitPrecession, 100);
        });
    });
});
