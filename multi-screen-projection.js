// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");
global.Leap = require("leapjs");
global.LeapPlugins = require("leapjs-plugins");

let spheres = [];

console.log("<<<<", Leap);
let indexTip = new THREE.Vector3(0, 0, 0);
let thumbTip = new THREE.Vector3(0, 0, 0);

// global.ML = require( 'three.meshline' );

function newSphere(scene, sphereColor="white") {
  // Setup a geometry
  const geometry = new THREE.SphereGeometry(0.25, 32, 32);
  // Setup a material
  const material = new THREE.MeshBasicMaterial({
    color: sphereColor,
    wireframe: true
  });
  // Setup a mesh with geometry + material
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  return mesh;
}

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

function addPlane(rotation, scene) {
  var geometry = new THREE.PlaneBufferGeometry( 1, 1, 32);
  var wireframe = new THREE.WireframeGeometry( geometry );
  var line = new THREE.LineSegments( wireframe );
  line.material.depthTest = false;
  line.material.opacity = 0.25;
  line.material.transparent = false;

  scene.add( line );
}

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl"
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor("#000", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(0, 0, -4);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  let s1 = newSphere(scene);
  let s2 = newSphere(scene, "red");
  console.log("S1", s1)
  spheres.push(s1);
  spheres.push(s2);

  addPlane(0, scene);

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time }) {
      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    }
  };
};

Leap.loop(function(frame) {
  frame.hands.forEach(function(hand, index) {

    console.log("---", hand);
    console.log(hand.indexFinger.tipPosition)
    console.log(hand.thumb.tipPosition)

    if (spheres.length != 0) {
      spheres[0].position.fromArray(hand.indexFinger.tipPosition)
      spheres[0].position.multiplyScalar(0.025);
      spheres[1].position.fromArray(hand.thumb.tipPosition)
      spheres[1].position.multiplyScalar(0.025);
    }
    // spheres[0].position.needsUpdate = true;
    // spheres[1].position.needsUpdate = true;

    // indexTip.fromArray(hand.indexFinger.tipPosition)
    // thumbTip.fromArray(hand.thumb.tipPosition)
    console.log("---");
  });
}).use('screenPosition', {scale: 0.25});

canvasSketch(sketch, settings);