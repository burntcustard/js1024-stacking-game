const slices = [];

const renderSlice = (index) => {
  const box = slices[index].children[0];
  // reflection must be separate (not in .cssText), as regpack breaks nested template literals
  const getHsla = (lightness, alpha = 100) =>
    `hsl(${index * 4}grad ${lightness * 2 - 30}% ${lightness}% / ${alpha}%)`;
  const reflection = `${getHsla(55, 80)} 0, ${getHsla(55, 20)}`;

  // If this is the first render of the slice, slice.style.cssText is undefined, so
  // the height should be 0 to allow a transition next render to it's actual height
  slices[index].style.cssText = `
    grid-row: -${index};
    display: grid;
    place-items: center;
    transition: all.8s;
    height: ${index && !slices[index].style.cssText ? '0' : '4.2'}vmin
  `;

  box.style.cssText = `
    transform-style: preserve-3d;
    position: absolute;
    width: ${box.w}vmin;
    height: ${box.h}vmin;
    transform: rotateX(67grad) rotateZ(50grad) translate(${box.x}vmin, ${box.y}vmin);
    background: ${getHsla(65)};
  `;

  // Transform-style not required but makes more similar to box css for regpacking
  box.children[0].style.cssText = `
    transform-style: preserve-3d;
    position: absolute;
    width: ${box.w}vmin;
    height: 10vmin;
    transform: rotateX(-100grad);
    clip-path: polygon(0 0, 100% 0, 100% 50%, calc(100% - 6.3vmin) 100%, 0 100%);
    transform-origin: top left;
    top: calc(100% - 1px);
    background: linear-gradient(
      ${getHsla(55)} 50%,
      ${getHsla(65)} 0 calc(50% + 1px),
      ${box.y < slices[index - 1]?.children[0].y || 0 ? reflection : '#0000 0'}
    );
  `;

  box.children[1].style.cssText = `
    transform-style: preserve-3d;
    position: absolute;
    width: ${box.h}vmin;
    height: 10vmin;
    transform: rotateX(-100grad) rotateY(100grad) scaleX(-1);
    clip-path: polygon(0 0, 100% 0, 100% 50%, calc(100% - 6.3vmin) 100%, 0 100%);
    transform-origin: top left;
    left: calc(100% - 1px);
    background: linear-gradient(
      ${getHsla(60)} 50%,
      ${getHsla(65)} 0 calc(50% + 1px),
      ${box.x < slices[index - 1]?.children[0].x || 0 ? reflection : '#0000 0'}
    );
  `;
}

const addSlice = (width = 40, height = 40) => {
  const slice = document.createElement('div');
  const box = document.createElement('div');

  box.w = width;
  box.h = height; // More like depth

  box['yx'[slices.length % 2]] = slices.length ? 180 : 0;
  box['xyx'[slices.length % 2]] = slices.length ? slices[slices.length - 1].children[0]['xyx'[slices.length % 2]] : 0;

  // faceLeft and faceRight
  box.append(document.createElement('div'), document.createElement('div'));

  b.append(slice);

  slice.append(box);
  // slices.push(slice); // Replaced with index method of pushing to save 4B
  slices[slices.length] = slice;
}

const handleClick = (event) => {
  // Removed mouse or spacebar check to save a few bytes
  // if (event.x || event.key === ' ') {
    event.preventDefault();

    const prevBox = slices[slices.length - 2]?.children[0];
    const currBox = slices[slices.length - 1]?.children[0];

    if (prevBox) {
      const overlapX = prevBox.x - currBox.x;
      const overlapY = prevBox.y - currBox.y;
      currBox.w = prevBox.w - Math.abs(overlapX);
      currBox.h = prevBox.h - Math.abs(overlapY);

      if (currBox.w < 0 || currBox.h < 0) {
        alert('Game Over!');
      }

      currBox.x += overlapX / 2;
      currBox.y += overlapY / 2;

      // Rerender the current box one more time (but grey/dead/disabled?)
      renderSlice(slices.length - 1);
    }

    // Add a new slice
    addSlice(currBox.w, currBox.h);
  // }
}

// overflow-x: hidden hides the horizontal scrollbar
// width: 100vw means that when vertical scrollbars appear, the page content won't move 16px sideways
// 45vh margin-bottom instead of align-content: start;
b.style.cssText = `
  background: #112;
  margin: 45vh 0;
  display: grid;
  overflow-x: hidden;
  width: 100vw;
`;

document.onclick = document.onkeydown = handleClick;

addSlice();
renderSlice(0);

// Main game loop
setInterval(() => {
  if (slices.length > 1) {
    // Move the most recently added box on the x or y dimension, dependant on it's slices index
    slices[slices.length -1].children[0]['xyx'[(slices.length) % 2]]--;
  }

  renderSlice(slices.length -1); // Saves 2B having this outisde the if()
}, 18); // 17ms ~59fps
