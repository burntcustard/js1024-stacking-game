const slices = [];

const renderSlice = () => {
  const box = slices[slices.length - 1].children[0];
  // getHsla manually inlined to save a few bytes
  // const getHsla = (lightness, alpha = 100) =>
  //   `hsl(${(slices.length - 1) * 4}grad ${lightness * 2 - 30}% ${lightness}% / ${alpha}%)`;
  // reflection must be separate (not in .cssText), as regpack breaks nested template literals
  const reflection = `
    hsl(${(slices.length - 1) * 4}grad 80% 55% / .8) 0,
    hsl(${(slices.length - 1) * 4}grad 80% 55% / .2)
  `;

  // If this is the first render of the slice, slice.style.cssText is undefined, so
  // the height should be 0 to allow a transition next render to it's actual height
  slices[slices.length - 1].style.cssText = `
    grid-row: -${slices.length - 1};
    display: grid;
    place-items: center;
    transition: all.8s;
    height: ${slices[slices.length - 1].style.cssText ? 4.2 : 0}vmin
  `;

  box.style.cssText = `
    transform-style: preserve-3d;
    position: absolute;
    width: ${box.w}vmin;
    height: ${box.h}vmin;
    transform: rotateX(67grad) rotateZ(50grad) translate(${box.x}vmin, ${box.y}vmin);
    background: hsl(${(slices.length - 1) * 4}grad 100% 65%);
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
      hsl(${(slices.length - 1) * 4}grad 80% 55%) 50%,
      hsl(${(slices.length - 1) * 4}grad 100% 65%) 0 calc(50% + 1px),
      ${box.y < slices[slices.length - 2]?.children[0].y || 0 ? reflection : '#0000 0'}
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
      hsl(${(slices.length - 1) * 4}grad 90% 60%) 50%,
      hsl(${(slices.length - 1) * 4}grad 100% 65%) 0 calc(50% + 1px),
      ${box.x < slices[slices.length - 2]?.children[0].x || 0 ? reflection : '#0000 0'}
    );
  `;
}

const addSlice = (width, height) => {
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

const handleClick = () => {
  // Removed mouse or spacebar check to save a few bytes
  // if (event.x || event.key === ' ') {
    // Remove preventDefault to save a few bytes. Makes spacebar annoyingly scrolly
    // event.preventDefault();

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
    }

    // Rerender the current box one more time (but grey/dead/disabled?)
    renderSlice();

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

b.onclick = b.onkeydown = handleClick;

addSlice(40, 40);
renderSlice();

// Main game loop
setInterval(() => {
  if (slices.length > 1) {
    // Move the most recently added box on the x or y dimension, dependant on it's slices index
    slices[slices.length -1].children[0]['xyx'[(slices.length) % 2]]--;
    renderSlice();
  }
}, 18); // 17ms ~59fps
