console.log('Hello World');

let sliceHue = 0;

const slice = document.createElement('div');
box.style.cssText = `
  display: grid;
  placeitems: center;
`;

const box = document.createElement('div');
box.style.cssText = `
  position: relative;
  transform-style: preserve-3d;
  transform: rotateX(60deg) rotateZ(45deg);
  width: 3in;
  height: 3in;
`;

const faceCSS = `
  transform-style: preserve-3d;
  position: absolute;
  width: 100%;
  height: 1in;
`;

const faceLeft = document.createElement('div');
faceLeft.style.cssText = faceCSS + `
  transform: rotateX(90deg) rotateY(180deg);
  transform-origin: bottom;
  background:
  linear-gradient(
    to top,
    hsl(${boxHue}deg 99% 65%) 50%,
    hsl(${boxHue}deg 99% 70%) 0 calc(50% + 1px),
    hsl(${boxHue}deg 99% 65% / 70%) 0,
    hsl(${boxHue}deg 99% 65% / 20%)
  ),
  linear-gradient(-6deg, #0005 0 65%, #0000 70%);
`;

const faceRight = document.createElement('div');
faceRight.style.cssText = faceCSS + `

`;

sliceHue++;
