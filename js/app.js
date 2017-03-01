(function () {
    'use strict';

    var supportsVideo = !!document.createElement('video').canPlayType;

    if (supportsVideo) {
        var playbig = document.querySelectorAll('.video__play-btn');

        Array.prototype.map.call(playbig, function(btn) {
            btn.addEventListener('click', function(e) {
                var el = e.currentTarget;

                var videoContainer = el.parentNode;
                var video = videoContainer.querySelector('.video-tag');
                var videoControls = videoContainer.querySelector('.video-controls');
                videoControls.setAttribute('data-state', 'visible');

                var playpause = videoContainer.querySelector('.video__playpause-btn');
                var playbig = videoContainer.querySelector('.video__play-btn');

                var mute = videoContainer.querySelector('.video__mute-btn');
                var progress = videoContainer.querySelector('progress');
                var progressBar = videoContainer.querySelector('.progress-bar span');

                var supportsProgress = (document.createElement('progress').max !== undefined);
                if (!supportsProgress) progress.setAttribute('data-state', 'fake');



                if (document.addEventListener) {
                    video.addEventListener('loadedmetadata', function() {
                        progress.setAttribute('max', video.duration);
                    });

                    var changeButtonState = function(type) {
                        // Play/Pause button
                        if (type == 'playpause') {
                            if (video.paused || video.ended) {
                                playpause.setAttribute('data-state', 'play');
                                playbig.setAttribute('data-state', 'not-hidden');
                            }
                            else {
                                playpause.setAttribute('data-state', 'pause');
                                playbig.setAttribute('data-state', 'hidden');
                            }
                        }
                        // Mute button
                        else if (type == 'mute') {
                            mute.setAttribute('data-state', video.muted ? 'unmute' : 'mute');
                        }
                    };

                    // Add event listeners for video specific events
                    video.addEventListener('play', function() {
                        changeButtonState('playpause');
                    }, false);

                    video.addEventListener('pause', function() {
                        changeButtonState('playpause');
                    }, false);

                    // Add events for all buttons
                    playpause.addEventListener('click', function(e) {
                        if (video.paused || video.ended) video.play();
                        else video.pause();
                    });
                    mute.addEventListener('click', function(e) {
                        video.muted = !video.muted;
                        changeButtonState('mute');
                    });

                    //update the progress bar
                    video.addEventListener('timeupdate', function() {
                        if (!progress.getAttribute('max')) progress.setAttribute('max', video.duration);
                        progress.value = video.currentTime;
                        progressBar.style.width = Math.floor((video.currentTime / video.duration) * 100) + '%';
                    });

                    // React to the user clicking within the progress bar
                    progress.addEventListener('click', function(e) {
                        var box = e.currentTarget.getBoundingClientRect();
                        var pos = (e.pageX  - box.left)/ this.offsetWidth;
                        video.currentTime = pos * video.duration;
                    });

                    if (video.paused || video.ended)  video.play();
                }
            });
        });
    }
})();