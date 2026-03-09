/**
 * Populate one deferred video element with its poster and source.
 *
 * Parameters
 * ----------
 * video : HTMLVideoElement, shape=()
 *     Video element with a `data-src` attribute that points to an MP4 file.
 *
 * Returns
 * -------
 * undefined, shape=()
 *     Mutates the DOM element in place by setting `poster`, `src`, and a loaded flag.
 */
function load_video(video) {
  if (video.dataset.loaded === 'true') return;
  video.poster = video.dataset.src.replace('.mp4', '.jpg');
  video.src = video.dataset.src;
  video.dataset.loaded = 'true';
  video.load();
}

/**
 * Start muted autoplay for one visible video element.
 *
 * Parameters
 * ----------
 * video : HTMLVideoElement, shape=()
 *     Video element that has already been loaded or is ready to load.
 *
 * Returns
 * -------
 * undefined, shape=()
 *     Requests playback on the element in place.
 */
function play_video(video) {
  const promise = video.play();
  if (promise) promise.catch(function () { });
}

/**
 * Register lazy loading and viewport-driven autoplay for deferred videos.
 *
 * Parameters
 * ----------
 * videos : NodeListOf<HTMLVideoElement>, shape=(N,)
 *     Deferred video elements selected from the document.
 *
 * Returns
 * -------
 * undefined, shape=()
 *     Loads videos near the viewport, plays visible ones, and pauses hidden ones.
 */
function init_lazy_videos(videos) {
  videos.forEach(function (video) {
    video.poster = video.dataset.src.replace('.mp4', '.jpg');
  });

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      const video = entry.target;
      if (entry.isIntersecting) {
        load_video(video);
        play_video(video);
        return;
      }
      video.pause();
    });
  }, { rootMargin: '300px 0px' });

  videos.forEach(function (video) {
    observer.observe(video);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  init_lazy_videos(document.querySelectorAll('.lazy-video'));
});
