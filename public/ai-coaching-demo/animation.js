/* One deterministic timeline; only the selected example is mounted and animated. */
(() => {
  'use strict';
  const root = document.querySelector('#paperwork-demo');
  const stage = root.querySelector('.stage');
  const panel = root.querySelector('#example-player');
  const description = root.querySelector('#demo-description');
  const chapters = [...root.querySelectorAll('[data-chapter]')];
  const tabs = [...root.querySelectorAll('[data-example-id]')];
  const playButton = root.querySelector('#toggle-play');
  const playIcon = playButton.querySelector('use');
  const playLabel = playButton.querySelector('span');
  const narration = root.querySelector('#narration-text');
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const examples = {
    paperwork: {
      title: 'Scattered paperwork.\nOne organised summary.',
      label: 'Sort my paperwork',
      description: description.textContent,
      html: stage.innerHTML,
      chapters: ['Gather', 'Ask', 'Check', 'Organise'],
      durations: [5500, 8500, 10000, 8000],
      captions: [
        'Start with a real task you’d like help with.',
        'Learn to ask for sources, possible duplicates and missing details.',
        'Learn to check the result against the original.',
        'An organised summary. And the confidence to check it.'
      ],
      update({ phase, moment, stage }) {
        const confirmed = phase === 2 && moment === 2;
        stage.querySelector('.receipt-compare').setAttribute('aria-hidden', String(!(phase === 2 && moment >= 1)));
        stage.querySelector('.confirmation').setAttribute('aria-hidden', String(!confirmed));
        stage.querySelector('.coach-addition').setAttribute('aria-hidden', String(!(phase === 1 && moment >= 1)));
        stage.querySelector('.duplicate-label').textContent = confirmed ? 'Duplicate · excluded' : 'Possible duplicate';
        stage.querySelector('.duplicate-status .status-symbol').textContent = confirmed ? '✓' : '!';
        stage.querySelector('.review-message').textContent = confirmed ? 'Match confirmed. Both source records are kept.' : 'AI flags it. You check the original.';
      }
    },
    ...(window.coachingExamples || {})
  };
  const exampleDurations = { email: [5500, 9000, 9000, 10500], dinner: [7000, 8000, 8000, 13000] };
  let exampleId = 'paperwork';
  let config = examples.paperwork;
  let scenes = [...stage.querySelectorAll('.scene')];
  let durations = config.durations;
  let starts = [0, 5500, 14000, 24000];
  let duration = 32000;
  let elapsed = 0;
  let playing = !media.matches;
  let lastTime = null;
  let frame = null;
  let currentPhase = -1;
  let currentMoment = -1;
  let inViewport = true;

  function render() {
    const phase = starts.reduce((found, start, index) => elapsed >= start ? index : found, 0);
    const progress = (elapsed - starts[phase]) / durations[phase];
    const moment = phase === 0 ? (progress < .28 ? 0 : progress < .62 ? 1 : 2)
      : phase === 1 ? (progress < .14 ? 0 : progress < .6 ? 1 : 2)
      : phase === 2 ? (progress < .22 ? 0 : progress < .6 ? 1 : 2) : 2;
    if (phase !== currentPhase) {
      currentPhase = phase;
      currentMoment = -1;
      stage.dataset.phase = String(phase);
      scenes.forEach((scene, index) => {
        const active = index === phase;
        scene.classList.toggle('is-active', active);
        scene.inert = !active;
        scene.setAttribute('aria-hidden', String(!active));
      });
      chapters.forEach((chapter, index) => {
        chapter.classList.toggle('is-current', index === phase);
        if (index === phase) chapter.setAttribute('aria-current', 'step');
        else chapter.removeAttribute('aria-current');
      });
      narration.textContent = config.captions[phase];
    }
    if (moment !== currentMoment) {
      currentMoment = moment;
      stage.dataset.moment = String(moment);
      config.update?.({ phase, moment, progress, stage });
    }
    chapters.forEach((chapter, index) => chapter.style.setProperty('--progress', index < phase ? 1 : index === phase ? progress : 0));
    stage.style.setProperty('--float', media.matches ? 0 : Math.sin(elapsed / 1500));
  }

  function updateControls() {
    playButton.setAttribute('aria-label', playing ? 'Pause animation' : 'Play animation');
    playIcon.setAttribute('href', playing ? '#i-pause' : '#i-play');
    playLabel.textContent = playing ? 'Pause' : 'Play';
    root.querySelector('#playback-note').textContent = media.matches
      ? 'Reduced motion · Choose a chapter to explore'
      : `${duration / 1000}-second loop · Watch at your own pace`;
  }

  function shouldAnimate() { return playing && !document.hidden && inViewport; }

  function tick(now) {
    frame = null;
    if (!shouldAnimate()) { lastTime = null; return; }
    if (lastTime !== null) elapsed = (elapsed + Math.min(now - lastTime, 100)) % duration;
    lastTime = now;
    render();
    frame = requestAnimationFrame(tick);
  }

  function syncPlayback() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    lastTime = null;
    if (shouldAnimate()) frame = requestAnimationFrame(tick);
    updateControls();
  }

  function seek(milliseconds) {
    elapsed = Math.max(0, Math.min(duration - 1, Number(milliseconds) || 0));
    lastTime = null;
    currentMoment = -1;
    render();
  }

  function selectExample(id) {
    if (!Object.prototype.hasOwnProperty.call(examples, id)) return false;
    if (id === exampleId) return true;
    exampleId = id;
    config = examples[id];
    durations = config.durations || exampleDurations[id];
    starts = durations.map((_, index) => durations.slice(0, index).reduce((sum, value) => sum + value, 0));
    duration = durations.reduce((sum, value) => sum + value, 0);
    stage.innerHTML = config.html;
    stage.dataset.example = id;
    scenes = [...stage.querySelectorAll('.scene')];
    stage.querySelectorAll('svg:not([role="img"])').forEach(svg => svg.setAttribute('aria-hidden', 'true'));
    description.textContent = config.description;
    panel.setAttribute('aria-labelledby', `example-${id}`);
    tabs.forEach(tab => {
      const selected = tab.dataset.exampleId === id;
      tab.classList.toggle('is-selected', selected);
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    chapters.forEach((chapter, index) => { chapter.children[1].textContent = config.chapters[index]; });
    currentPhase = -1;
    seek(0);
    syncPlayback();
    return true;
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectExample(tab.dataset.exampleId));
    tab.addEventListener('keydown', event => {
      let next = null;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== null) {
        event.preventDefault();
        tabs[next].focus();
        selectExample(tabs[next].dataset.exampleId);
      }
    });
  });
  playButton.addEventListener('click', () => { playing = !playing; syncPlayback(); });
  chapters.forEach((chapter, index) => chapter.addEventListener('click', () => {
    playing = false;
    seek(starts[index] + durations[index] * (index < 3 ? .75 : .2));
    syncPlayback();
  }));
  root.querySelector('#replay').addEventListener('click', () => {
    seek(0);
    playing = !media.matches;
    syncPlayback();
  });
  media.addEventListener('change', () => {
    if (media.matches) playing = false;
    seek(elapsed);
    syncPlayback();
  });
  document.addEventListener('visibilitychange', syncPlayback);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      inViewport = entries[0].isIntersecting;
      syncPlayback();
    }, { threshold: .08 }).observe(panel);
  }
  stage.querySelectorAll('svg:not([role="img"])').forEach(svg => svg.setAttribute('aria-hidden', 'true'));
  window.coachingDemo = Object.freeze({
    pause() { playing = false; syncPlayback(); },
    play() { playing = true; syncPlayback(); },
    seek,
    select: selectExample,
    getState() { return { example: exampleId, elapsed, duration, starts: [...starts], durations: [...durations], phase: currentPhase, moment: currentMoment, playing, reducedMotion: media.matches }; }
  });
  window.paperworkDemo = window.coachingDemo;
  render();
  syncPlayback();
})();
