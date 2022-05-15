const head = document.getElementsByTagName('head')[0];
const style = document.createElement('style');

const picsContainer = document.querySelector('.pics');
const pics = document.querySelectorAll('.pic');

const getMaxPos = () => {
  const picsRect = picsContainer.getBoundingClientRect();
  const picRect = pics[0].getBoundingClientRect();

  const maxX = picsRect.width - picRect.width;
  const maxY = picsRect.height - picRect.height;

  return [maxX, maxY];
};

const getRandom = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

const generateKeyframes = (idx) => {
  const keyframes = `
      @keyframes fade${idx} {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }`;

  return keyframes;
};

const animatePics = () => {
  const [maxX, maxY] = getMaxPos();

  pics.forEach((pic, idx) => {
    let xPos = getRandom(0, maxX);
    let yPos = getRandom(0, maxY);

    pic.style.top = yPos + 'px';
    pic.style.left = xPos + 'px';

    const animation = generateKeyframes(idx);
    style.append(animation);
    head.append(style);
    pic.style.animation = `fade${idx} ${
      idx + 1
    }s ease-in-out ${idx}s infinite alternate`;
  });
};

window.addEventListener('resize', animatePics);
animatePics();
