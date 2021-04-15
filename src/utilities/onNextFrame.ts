// Make sure all is rendered to the DOM
export const onNextFrame = (callback: () => void) => {
    setTimeout(function() {
      requestAnimationFrame(callback);
    });
  };
  