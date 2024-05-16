//////////////////////////////////////////////////
const planetsInfomation = [
  [
    {
      radius: 10,
      segments: [40, 20],
      distance: 0,
      rotateSpeed: 0,
      selfRotateSpeed: 0.4,
      texture: "textures/sun.jpg",
      light: { color: 0xffffff, intensity: 15000 },
      name: "sun",
    },
    "scene",
    false,
    true,
  ],
  [
    {
      radius: 1,
      distance: 36,
      rotateSpeed: 1.4,
      selfRotateSpeed: 1,
      texture: "textures/earth.jpg",
      name: "earth",
    },
    "sun",
  ],
  [
    {
      radius: 0.15,
      segments: [20, 10],
      distance: 2.25,
      rotateSpeed: 7,
      selfRotateSpeed: 1.5,
      color: 0xb38769,
      name: "satellite-1",
    },
    "earth",
  ],
  [
    {
      radius: 0.2,
      segments: [20, 10],
      distance: 3.25,
      rotateSpeed: 8,
      selfRotateSpeed: 2,
      color: "gray",
      name: "satellite-2",
    },
    "earth",
  ],
  [
    {
      radius: 0.5,
      segments: [24, 12],
      distance: 20,
      rotateSpeed: 3,
      selfRotateSpeed: 1.2,
      texture: "textures/mercury.jpg",
      name: "mercury",
    },
    "sun",
  ],
  [
    {
      radius: 0.85,
      distance: 30,
      rotateSpeed: 2.2,
      selfRotateSpeed: 1,
      texture: "textures/venus.jpg",
      name: "venus",
    },
    "sun",
  ],
  [
    {
      radius: 0.72,
      distance: 42,
      rotateSpeed: 1,
      selfRotateSpeed: 1,
      texture: "textures/mars.jpg",
      name: "mars",
    },
    "sun",
  ],
  [
    {
      radius: 1.6,
      distance: 58,
      rotateSpeed: 0.8,
      selfRotateSpeed: 1,
      texture: "textures/jupiter.jpg",
      name: "jupiter",
    },
    "sun",
  ],
  [
    {
      radius: 1.48,
      distance: 70,
      rotateSpeed: 0.7,
      selfRotateSpeed: 0.8,
      texture: "textures/saturn.jpg",
      ring: { texture: "textures/saturn ring.png", innerRadius: 2, outerRadius: 5 },
      name: "saturn",
    },
    "sun",
    true,
    false,
  ],
  [
    {
      radius: 1.2,
      distance: 82,
      rotateSpeed: 0.56,
      selfRotateSpeed: 0.5,
      texture: "textures/uranus.jpg",
      ring: { texture: "textures/uranus ring.png", innerRadius: 2, outerRadius: 4 },
      name: "uranus",
    },
    "sun",
    true,
    false,
  ],
  [
    {
      radius: 0.95,
      distance: 90,
      rotateSpeed: 0.5,
      selfRotateSpeed: 0.5,
      texture: "textures/neptune.jpg",
      name: "neptune",
    },
    "sun",
  ],
  [
    {
      radius: 0.48,
      segments: [24, 12],
      distance: 100,
      rotateSpeed: 0.6,
      selfRotateSpeed: 0.5,
      texture: "textures/pluto.jpg",
      name: "pluto",
    },
    "sun",
  ],
];

//////////////////////////////////////////////////

export default planetsInfomation;
