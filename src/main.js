const slices = [];

b.style.cssText = `
  background: #112;
  margin: 50vh 0 0;
  min-height: 50vh;
  display: grid;
  align-content: start;
`;

const renderSlice = (index) => {
  const box = slices[index].firstChild;
  const reflection = `${box.getHsla(55, 80)} 0, ${box.getHsla(55, 20)}`;

  slices[index].style.cssText = `
    grid-row: -${index};
    display: grid;
    place-items: center;
    transition: all.8s;
    height: ${index === 0 || slices[index].notFirstRender ? '4.2vmin' : '0'};
  `;

  slices[index].notFirstRender = true;

  box.style.cssText = `
    position: absolute;
    transform-style: preserve-3d;
    width: ${box.w}vmin;
    height: ${box.h}vmin;
    background: ${box.getHsla(65)};
    transform: rotateX(60deg) rotateZ(45deg) translate(${box.x}vmin, ${box.y}vmin);
  `;

  box.firstChild.style.cssText = `
    transform-style: preserve-3d;
    position: absolute;
    width: ${box.w}vmin;
    height: 10vmin;
    transform: rotateX(-90deg) translateZ(${box.h - 0.1}vmin);
    transform-origin: top;
    clip-path: polygon(0 0, 100% 0, 100% 50%, calc(100% - 6.3vmin) 100%, 0 100%);
    background: linear-gradient(
      ${box.getHsla(55)} 50%,
      ${box.getHsla(70)} 0 calc(50% + 1px),
      ${box.y < slices[index - 1]?.firstChild.y || 0 ? reflection : '#0000 0'}
    );
  `;

  box.firstChild.nextElementSibling.style.cssText = `
    transform-style: preserve-3d;
    position: absolute;
    width: 10vmin;
    height: ${box.h}vmin;
    transform: rotateY(-90deg) translateZ(${5.1 - box.w}vmin) translateX(-5vmin);
    clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 100%, 0 calc(100% - 6.3vmin));
    background: linear-gradient(
      -90deg,
      ${box.getHsla(60)} 50%,
      ${box.getHsla(70)} 0 calc(50% + 1px),
      ${box.x < slices[index - 1]?.firstChild.x || 0 ? reflection : '#0000 0'}
    );
  `;
}

const addSlice = (width = 40, height = 40) => {
  const slice = document.createElement('div');
  const box = document.createElement('div');
  const faceLeft = document.createElement('div');
  const faceRight = document.createElement('div');
  const index = slices.length

  box.w = width;
  box.h = height; // More like depth
  box.getHsla = (lightness, alpha = 100) =>
    `hsl(${index * 4}deg ${lightness * 2 - 30}% ${lightness}% / ${alpha}%)`;

  box[index % 2 ? 'x' : 'y'] = index ? 180 : 0;
  box[index % 2 ? 'y' : 'x'] = index ? slices[index - 1].firstChild[index % 2 ? 'y' : 'x'] : 0;

  box.append(faceLeft, faceRight);

  b.append(slice);

  slice.append(box);
  slices.push(slice);
}

const handleClick = (event) => {
  if (!event.key || event.key === ' ') {
    event.preventDefault();

    const prevBox = slices.at(-2)?.firstChild;
    const currBox = slices.at(-1)?.firstChild;
    const width = 40;
    const height = 40;

    if (prevBox) {
      const overlapX = prevBox.x - currBox.x;
      const overlapY = prevBox.y - currBox.y;
      width = currBox.w = prevBox.w - Math.abs(overlapX);
      height = currBox.h = prevBox.h - Math.abs(overlapY);
      if (width < 0 || height < 0) {
        alert('ded');
      }
      currBox.x += overlapX / 2;
      currBox.y += overlapY / 2;
      // Rerender the current box one more time (but grey/dead/disabled?)
      renderSlice(slices.length - 1);
    }

    // Add a new slice
    addSlice(width, height);
  }
}

document.onclick = document.onkeydown = handleClick;

addSlice();
renderSlice(0);

// Main game loop
setInterval(() => {
  if (slices.length > 1) {
    slices[slices.length -1].firstChild[(slices.length - 1) % 2 ? 'x' : 'y']--;
    renderSlice(slices.length -1);
  }
}, 17); // 17ms ~59fps
