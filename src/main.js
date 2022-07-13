const slices = [];

const renderSlice = () => {
  // getHsla manually inlined to save a few bytes
  // const getHsla = (lightness, alpha = 100) =>
  //   `hsl(${slices.length * 4}grad ${lightness * 2 - 30}% ${lightness}% / ${alpha}%)`;

  // reflection must be separate (not in .cssText), as regpack breaks nested template literals
  const reflection = `
    hsl(${slices.length * 4}grad 80% 55% / .8) 0,
    hsl(${slices.length * 4}grad 80% 55% / .2)
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

  slices[slices.length - 1].children[0].style.cssText = `
    transform-style: preserve-3d;
    position: absolute;
    width: ${slices[slices.length - 1].w}vmin;
    height: ${slices[slices.length - 1].h}vmin;
    transform: rotateX(67grad) rotateZ(50grad) translate(${slices[slices.length - 1].x}vmin, ${slices[slices.length - 1].y}vmin);
    background: hsl(${slices.length * 4}grad 100% 65%);
  `;

  // Transform-style not required but makes more similar to box css for regpacking
  // transform-origin: 0 0; is top left
  slices[slices.length - 1].children[0].children[0].style.cssText = `
    transform-style: preserve-3d;
    position: absolute;
    width: ${slices[slices.length - 1].w}vmin;
    height: 10vmin;
    transform: rotateX(-100grad);
    clip-path: polygon(0 0, 100% 0, 100% 50%, calc(100% - 6.3vmin) 100%, 0 100%);
    transform-origin: 0 0;
    top: calc(100% - 1px);
    background: linear-gradient(
      hsl(${slices.length * 4}grad 80% 55%) 50%,
      hsl(${slices.length * 4}grad 100% 65%) 0 calc(50% + 1px),
      ${slices[slices.length - 1].y < slices[slices.length - 2]?.y || 0 ? reflection : '#0000 0'}
    );
  `;

  slices[slices.length - 1].children[0].children[1].style.cssText = `
    transform-style: preserve-3d;
    position: absolute;
    width: ${slices[slices.length - 1].h}vmin;
    height: 10vmin;
    transform: rotateX(-100grad) rotateY(100grad) scaleX(-1);
    clip-path: polygon(0 0, 100% 0, 100% 50%, calc(100% - 6.3vmin) 100%, 0 100%);
    transform-origin: 0 0;
    left: calc(100% - 1px);
    background: linear-gradient(
      hsl(${slices.length * 4}grad 90% 60%) 50%,
      hsl(${slices.length * 4}grad 100% 65%) 0 calc(50% + 1px),
      ${slices[slices.length - 1].x < slices[slices.length - 2]?.x || 0 ? reflection : '#0000 0'}
    );
  `;
}

const addSlice = (width, height) => {
  const slice = document.createElement`div`;
  const box = document.createElement`div`;

  slice.w = width;
  slice.h = height; // More like depth

  slice['yx'[slices.length % 2]] = slices.length ? 180 : 0;
  slice['xyx'[slices.length % 2]] = slices.length ? slices[slices.length - 1]['xyx'[slices.length % 2]] : 0;

  // faceLeft and faceRight
  box.append(document.createElement`div`, document.createElement`div`);

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

    // Previously called 'prevBox & currBox, then renamed, then inlined completely
    // const prevSlice = slices[slices.length - 2];
    // const currSlice = slices[slices.length - 1];

    if (slices[slices.length - 2]) {
      const overlapX = slices[slices.length - 2].x - slices[slices.length - 1].x;
      const overlapY = slices[slices.length - 2].y - slices[slices.length - 1].y;
      slices[slices.length - 1].w = slices[slices.length - 2].w - Math.abs(overlapX);
      slices[slices.length - 1].h = slices[slices.length - 2].h - Math.abs(overlapY);

      if (slices[slices.length - 1].w * slices[slices.length - 1].h < 0) {
        alert('Game Over!');
      }

      slices[slices.length - 1].x += overlapX / 2;
      slices[slices.length - 1].y += overlapY / 2;
    }

    // Rerender the current box one more time (but grey/dead/disabled?)
    renderSlice();

    // Add a new slice
    addSlice(slices[slices.length - 1].w, slices[slices.length - 1].h);
  // }
}

// overflow-x: hidden hides the horizontal scrollbar
// width: 100vw means that when vertical scrollbars appear, the page content won't move 16px sideways
// 45vh margin-bottom instead of align-content: start;
b.style.cssText = `
  background: #112;
  margin: 46vh 0;
  display: grid;
  overflow-x: hidden;
  width: 100vw;
`;

onclick = onkeydown = handleClick;

addSlice(40, 40);
renderSlice();

// Main game loop
setInterval(() => {
  // If there is > 1 slice (if there's only 1, slices.length - 1 === 0 so it's falsey)
  // Move the most recently added box on the x or y dimension, dependant on it's slices index
  if (slices.length - 1) {
    slices[slices.length - 1]['xyx'[(slices.length) % 2]]--;
    renderSlice();
  }
}, 18); // 17ms ~59fps
