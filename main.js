var activeControl = false,
    hasLight = false,
    alpha = 0,
    playMusic = false;

// Play audio
$(".controls-music-btn").click(() => {
    if (!playMusic) {
        playMusic = true;
        $("#audio").get(0).play();
        $(".controls-music-btn").addClass("active");
    } else {
        playMusic = false;
        $("#audio").get(0).pause();
        $(".controls-music-btn").removeClass("active");
    }
});

function init() {
    var scene = new THREE.Scene();

    var geometry, material, mesh;
    material = new THREE.MeshBasicMaterial({ color: "#ffffff" });

    var backgroundAllPoints = getBackgroundAllPoints();
    scene.add(backgroundAllPoints);

    var gridHelper = new THREE.GridHelper(150, 30, "#fff", "#fff");
    gridHelper.position.y = -0.1;
    scene.add(gridHelper);

    var pointLight = getPointLight(0xffffff, 10, 100);

    var gui = new dat.GUI();
    gui.domElement.id = "GUI";

    //Handle event on click geometry
    $(".geometry").click(function () {
        if (activeControl) {
            $(".controls-btn.active").removeClass("active");
            transformControls.detach(mesh);
        }

        var geometryName = $(this).text();

        switch (geometryName) {
            case "Box":
                geometry = new THREE.BoxGeometry(5, 5, 5);
                break;
            case "Sphere":
                geometry = new THREE.SphereGeometry(3);
                break;
            case "Cone":
                geometry = new THREE.ConeGeometry(3, 8, 32);
                break;
            case "Cylinder":
                geometry = new THREE.CylinderGeometry(3, 3, 8, 32);
                break;
            case "Torus":
                geometry = new THREE.TorusGeometry(4, 2, 16, 100);
                break;
            case "Torus Knot":
                geometry = new THREE.TorusKnotGeometry(4, 1, 100, 16);
                break;
            case "Tetrahedron":
                geometry = new THREE.TetrahedronGeometry(4, 0);
                break;
            case "Octahedron":
                geometry = new THREE.OctahedronGeometry(4, 1);
                break;
            case "Dodecahedron":
                geometry = new THREE.DodecahedronGeometry(4, 1);
                break;
            case "Icosahedron":
                geometry = new THREE.IcosahedronGeometry(4, 0);
                break;
            case "Circle":
                geometry = new THREE.CircleGeometry(5, 32);
                break;
            case "Tube":
                geometry = new THREE.TubeGeometry(getTube(6), 20, 2, 8, false);
                break;
            case "Heart":
                geometry = new THREE.ExtrudeGeometry(getHeart(), { amount: 2, bevelEnable: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 });
                break;
            case "Teapot":
                geometry = new THREE.TeapotGeometry(4, 10);
                break;
        }
        mesh = new THREE.Mesh(geometry, material);

        scene.remove(scene.getObjectByName("geometry"));

        mesh.name = "geometry";
        mesh.castShadow = true; // Shadow (đổ bóng).

        scene.add(mesh);
    });

    //Handle event on click surface
    $(".surface").click(function () {
        if (activeControl) {
            $(".controls-btn.active").removeClass("active");
            transformControls.detach(mesh);
        }

        var loader = new THREE.TextureLoader();
        scene.remove(scene.getObjectByName("geometry"));

        var materialName = $(this).text(),
            materialColor = material.color;

        switch (materialName) {
            case "Point":
                material = new THREE.PointsMaterial({ color: materialColor, size: 0.2 });
                mesh = new THREE.Points(geometry, material);
                break;
            case "Line":
                material = new THREE.LineBasicMaterial({ color: materialColor });
                mesh = new THREE.Line(geometry, material);
                break;
            case "Solid":
                material = new THREE.MeshBasicMaterial({ color: materialColor });
                mesh = new THREE.Mesh(geometry, material);
                break;
            case "Texture Dots":
                material = new THREE.MeshBasicMaterial({
                    map: loader.load("./assets/textures/dots.jpg"),
                });
                mesh = new THREE.Mesh(geometry, material);
                break;
            case "Texture Concrete":
                material = new THREE.MeshBasicMaterial({
                    map: loader.load("./assets/textures/concrete.jpeg"),
                });
                mesh = new THREE.Mesh(geometry, material);
                break;
            case "Texture Water":
                material = new THREE.MeshBasicMaterial({
                    map: loader.load("./assets/textures/water.jpg"),
                });
                mesh = new THREE.Mesh(geometry, material);
                break;
        }
        mesh.name = "geometry";
        mesh.castShadow = true; // Shadow (đổ bóng).
        scene.add(mesh);
    });

    //Handle event click on button controls
    $(".controls-btn").click(function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
            transformControls.detach(mesh);
            activeControl = false;
        } else {
            activeControl = true;
            const controlType = $(this).attr("type");
            switch (controlType) {
                case "translate":
                    transformControls.attach(mesh);
                    transformControls.setMode("translate");
                    break;
                case "rotate":
                    transformControls.attach(mesh);
                    transformControls.setMode("rotate");
                    break;
                case "scale":
                    transformControls.attach(mesh);
                    transformControls.setMode("scale");
                    break;
                case "move-light":
                    transformControls.attach(pointLight);
                    transformControls.setMode("translate");
                    break;
            }

            $(".controls-btn.active").removeClass("active");
            $(this).addClass("active");

            scene.add(transformControls);
        }
    });

    //Handle event on click light
    $(".light").click(function () {
        if ($(this).text() == "Point Light" && hasLight === false) {
            hasLight = true;
            scene.add(pointLight);

            var plane = getPlane(150);
            gridHelper.add(plane);

            var pointLightHelper = getPointLightHelper(pointLight);
            scene.add(pointLightHelper);

            planeColorGUI = addColorGUI(plane.material, "Plane Color", { color: 0x15151e }, colorGUI);
        } else {
            hasLight = false;

            scene.remove(scene.getObjectByName("PointLight"));
            scene.remove(scene.getObjectByName("PointLightHelper"));
            gridHelper.remove(scene.getObjectByName("Plane"));

            colorGUI.remove(planeColorGUI);
        }
    });

    //Handle event on click animation
    $(".animation").click(function () {
        var $nameAnimation = $(this).text();
        if ($(".animation.active").hasClass("active")) {
            $(".animation.active").removeClass("active");
        }
        switch ($nameAnimation) {
            case "Animation 1":
                $(this).addClass("active");
                break;
            case "Animation 2":
                $(this).addClass("active");
                break;
            case "Animation 3":
                $(this).addClass("active");
                break;
            case "Remove Animation":
                break;
        }
    });

    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(10, 7, 20);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    camera.updateProjectionMatrix();
    function updateCamera() {
        camera.updateProjectionMatrix();
    }

    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight - 46);
    renderer.setClearColor("#15151e");
    renderer.shadowMap.enabled = true; // ShadowMap (Đổ bóng).
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Type of shadowMap.
    document.getElementById("WebGL").appendChild(renderer.domElement);
    renderer.render(scene, camera);

    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    var transformControls = new THREE.TransformControls(camera, renderer.domElement);
    transformControls.size = 0.5;
    transformControls.addEventListener("dragging-changed", (event) => {
        controls.enabled = !event.value;
    });

    var cameraGUI = gui.addFolder("Camera");
    cameraGUI.add(camera, "fov", 0, 175).name("FOV").onChange(updateCamera);
    cameraGUI.add(camera, "near", 1, 50, 1).name("Near").onChange(updateCamera);
    cameraGUI.add(camera, "far", 1000, 5000, 10).name("Far").onChange(updateCamera);
    cameraGUI.open();

    var planeColorGUI;
    var colorGUI = gui.addFolder("Color");
    addColorGUI(material, "Geometry Color", { color: 0xffffff }, colorGUI);
    colorGUI.open();

    var lightGUI = gui.addFolder("Light Control");
    lightGUI.add(pointLight, "intensity", 1, 20, 1).name("Intensity");
    lightGUI.add(pointLight, "distance", 1, 200, 1).name("Distance");
    addColorGUI(pointLight, "Light Color", { color: 0xffffff }, lightGUI);
    lightGUI.open();

    update(renderer, scene, camera, controls);
}

function update(renderer, scene, camera, controls) {
    renderer.render(scene, camera);
    controls.update();

    var geometry = scene.getObjectByName("geometry");
    var name = $(".animation.active").text();
    switch (name) {
        case "Animation 1":
            geometry.rotation.x = Date.now() * 0.0005;
            geometry.rotation.y = Date.now() * 0.002;
            geometry.rotation.z = Date.now() * 0.001;
            break;
        case "Animation 2":
            geometry.position.y = (Math.sin(Date.now() * 0.002) + 1) * 10;
            geometry.rotation.y = Date.now() * 0.002;
            geometry.rotation.z = Date.now() * 0.001;
            break;
        case "Animation 3":
            alpha = Math.PI * 0.005 + alpha;
            geometry.position.x = Math.sin(alpha) * 5;
            geometry.position.z = Math.cos(alpha) * 5;
            geometry.rotation.y = Date.now() * 0.002;
            geometry.rotation.z = Date.now() * 0.001;
            if (alpha == 2 * Math.PI) alpha = 0;
            break;
    }

    requestAnimationFrame(function () {
        update(renderer, scene, camera, controls);
    });
}

function getPlane(size) {
    var geometry = new THREE.PlaneGeometry(size, size);
    var material = new THREE.MeshStandardMaterial({
        color: "#15151e",
        side: THREE.DoubleSide,
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true; // Receive shadow (Nhận đỗ bóng).
    mesh.rotation.x = Math.PI / 2;
    mesh.name = "Plane";

    return mesh;
}

function getHeart() {
    const x = -10,
        y = -10;
    var heartShape = new THREE.Shape();
    heartShape.moveTo(x + 5, y + 5);
    heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
    heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
    heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
    heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
    heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
    heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

    return heartShape;
}

function getTube(size) {
    class CustomSinCurve extends THREE.Curve {
        constructor(scale = 1) {
            super();

            this.scale = scale;
        }

        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const tx = t * 3 - 1.5;
            const ty = Math.sin(2 * Math.PI * t);
            const tz = 0;

            return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
        }
    }

    return new CustomSinCurve(size);
}

function getPointLight(color, intensity, distance) {
    var pointLight = new THREE.PointLight(color, intensity, distance);
    pointLight.position.set(10, 10, 10);
    pointLight.castShadow = true;
    pointLight.name = "PointLight";

    return pointLight;
}

function getPointLightHelper(pointLight) {
    const sphereSize = 1;
    const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
    pointLightHelper.name = "PointLightHelper";

    return pointLightHelper;
}

function getBackgroundAllPoints() {
    const vertices = [];

    for (let i = 0; i < 30000; i++) {
        const x = THREE.MathUtils.randFloatSpread(2000);
        const y = THREE.MathUtils.randFloatSpread(2000);
        const z = THREE.MathUtils.randFloatSpread(2000);

        vertices.push(x, y, z);
    }

    const geometry1 = new THREE.BufferGeometry();
    geometry1.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));

    const material1 = new THREE.PointsMaterial({ color: 0x888888 });

    const points = new THREE.Points(geometry1, material1);

    return points;
}

function addColorGUI(obj, name, params, folder) {
    var objColorGUI = folder
        .addColor(params, "color")
        .name(name)
        .onChange(function () {
            obj.color.set(params.color);
        });

    return objColorGUI;
}

init();
