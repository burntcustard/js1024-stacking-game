let slices = [];

b.style.cssText = `
  background: #112;
  margin: 50vh 0;
  min-height: 50vh;
  display: grid;
  align-content: start;
`;

function getHsl(index, lightness, alpha = 100) {
  return `hsl(${index * 4}deg ${lightness * 2 - 30}% ${lightness}% / ${alpha}%)`;
}

document.onclick = () => {
  const slice = document.createElement('div');
  const box = document.createElement('div');
  let index = slices.length;

  slices.push(slice);
  b.append(slice);
  slice.box = box;
  slice.append(box);

  const getHsl = (lightness, alpha = 100) =>
  `hsl(${index * 4}deg ${lightness * 2 - 30}% ${lightness}% / ${alpha}%)`;

  slice.style.cssText = `
    grid-row: -${index};
    display: grid;
    place-items: center;
    height: 0;
    transition: all .5s;
  `;

  box.style.cssText = `
    position: absolute;
    transform-style: preserve-3d;
    width: 40vmin;
    height: 40vmin;
    background: ${getHsl(65)};
  `;

  box.x = 0;
  box.y = 0;
  box[index % 2 ? 'x' : 'y'] = 180;
  box.style.transform = `rotateX(60deg) rotateZ(45deg) translate(${box.x}vmin, ${box.y}vmin)`;

  requestAnimationFrame(() => {
    slice.style.height = '4.2vmin';
  });

  const faceLeft = document.createElement('div');
  const faceRight = document.createElement('div');
  const faceCSS = `
    transform-style: preserve-3d;
    position: absolute;
    width: 100%;
    height: 10vmin;
    transition: all.9s;
    `;

    faceLeft.style.cssText = faceCSS + `
    transform: rotateX(-90deg) translateZ(40vmin);
    transform-origin: top;
    background:
    linear-gradient(
      ${getHsl(55)} 50%, transparent 0
      )
      `;
      // linear-gradient(-6deg, #0005 0 65%, #0000 70%);
      // ${getHsl(70)} 0 calc(50% + 1px),
      // ${getHsl(55, 70)} 0,
      // ${getHsl(55, 15)}

      faceRight.style.cssText = faceCSS + `
      transform: rotateX(-90deg) rotateY(90deg);
      transform-origin: top right;
      background:
      linear-gradient(
        ${getHsl(60)} 50%,
        ${getHsl(70)} 0 calc(50% + 1px),
        ${getHsl(60, 70)} 0,
        ${getHsl(60, 15)}
        ),
      linear-gradient(-6deg, #0005 0 65%, #0000 70%);
      `;

      box.append(faceLeft, faceRight);
    }

// Main game loop
setInterval(() => {
  if (slices.length) {
    const currentBox = slices.at(-1).box;
    currentBox[(slices.length - 1) % 2 ? 'x' : 'y']--;
    currentBox.style.transform = `rotateX(60deg) rotateZ(45deg) translate(${currentBox.x}vmin, ${currentBox.y}vmin)`;
  }
}, 33); // 33ms ~30fps
