/* A fictional food-planning example. No image recognition runs on this page. */
(() => {
  'use strict';
  window.coachingExamples = window.coachingExamples || {};
  window.coachingExamples.dinner = {
    title: 'A few ingredients.\nDinner, figured out.',
    label: 'Make dinner easier',
    description: 'An illustrative ingredient photo becomes a practical dinner plan. A person corrects the suggested chickpeas to butter beans, then adds two people, 20 minutes and no oven to the request. Those constraints produce a tomato, spinach and butter-bean skillet using the ingredients they actually have. No photo upload or live AI processing takes place.',
    chapters: ['Look', 'Ask', 'Adapt', 'Cook'],
    captions: [
      'Check what AI sees. A quick correction makes the next answer more useful.',
      'Add the people, the time and the kitchen you actually have.',
      'Learn to turn a suggestion into something that fits your day.',
      'A dinner plan you can use, made from what you already have.'
    ],
    html: `
      <section class="scene dinner-look" aria-labelledby="dinner-look-title" inert aria-hidden="true">
        <div class="scene-heading"><p class="chapter-label">01 / START WITH WHAT’S HERE</p><h2 id="dinner-look-title">What can I make with this?</h2></div>
        <div class="dinner-look-layout">
          <figure class="dinner-photo-card">
            <img src="assets/dinner-ingredients.jpg" alt="Tomatoes, spinach, cooked butter beans and bread on a kitchen worktop." width="1100" height="825" decoding="async">
            <figcaption><span class="dinner-photo-dot" aria-hidden="true"></span> A quick photo of what you have<span>Illustrative photo</span></figcaption>
          </figure>
          <div class="dinner-reading-card">
            <p class="dinner-card-kicker">AI’S FIRST LOOK</p>
            <ul class="dinner-ingredient-reading">
              <li><span class="dinner-read-check" aria-hidden="true">✓</span> Tomatoes</li>
              <li><span class="dinner-read-check" aria-hidden="true">✓</span> Spinach</li>
              <li class="dinner-bean-row"><span class="dinner-read-check dinner-bean-check" aria-hidden="true">?</span><span class="dinner-bean-name">Chickpeas?</span><span class="dinner-corrected-tag" aria-hidden="true">Corrected</span></li>
              <li><span class="dinner-read-check" aria-hidden="true">✓</span> Bread</li>
            </ul>
            <div class="dinner-correction" aria-hidden="true"><span class="dinner-person-label">YOU</span><p>“Those are butter beans.”</p></div>
            <p class="dinner-look-guidance">A photo is a starting point.<br> <strong>You know what’s in your kitchen.</strong></p>
          </div>
        </div>
      </section>
      <section class="scene dinner-ask" aria-labelledby="dinner-ask-title" inert aria-hidden="true">
        <div class="scene-heading"><p class="chapter-label">02 / MAKE THE REQUEST YOURS</p><h2 id="dinner-ask-title">Dinner that fits your evening.</h2></div>
        <div class="dinner-ask-layout">
          <article class="dinner-prompt-card">
            <div class="dinner-photo-chip"><svg aria-hidden="true"><use href="#i-file"/></svg> Ingredient photo · checked by you</div>
            <p class="dinner-original-prompt">Make dinner from these ingredients.</p>
            <div class="dinner-prompt-addition" aria-hidden="true">
              <span class="dinner-card-kicker">WITH YOUR COACH’S GUIDANCE</span>
              <p class="dinner-constraints"><mark>Two people.</mark> <mark>20 minutes.</mark><br> <mark>No oven.</mark></p>
              <p class="dinner-pantry">I have cooked butter beans, tomatoes, spinach, bread, oil, salt and pepper.</p>
            </div>
            <div class="dinner-prompt-footer"><span>Your ingredients. Your limits.</span><span class="dinner-prompt-arrow" aria-hidden="true"><svg><use href="#i-arrow"/></svg></span></div>
          </article>
          <aside class="dinner-coach-note"><span class="dinner-note-rule" aria-hidden="true"></span><p class="dinner-card-kicker">THE COACHING MOMENT</p><h3>Make “useful”<br> specific.</h3><p>How many people?<br> How much time?<br> What can you cook with?</p></aside>
        </div>
      </section>
      <section class="scene dinner-adapt" aria-labelledby="dinner-adapt-title" inert aria-hidden="true">
        <div class="scene-heading"><p class="chapter-label">03 / A SMALL DETAIL, A BETTER PLAN</p><h2 id="dinner-adapt-title">“No oven” changes the answer.</h2></div>
        <div class="dinner-adapt-layout">
          <article class="dinner-method-card dinner-oven-card">
            <p class="dinner-card-kicker">WITHOUT THAT DETAIL</p>
            <svg class="dinner-appliance" viewBox="0 0 100 80" aria-hidden="true"><rect x="18" y="9" width="64" height="62" rx="5"/><path d="M18 26h64M28 18h4m9 0h4m10 0h4m10 0h4"/><rect x="27" y="34" width="46" height="27" rx="2"/><path d="M37 40h26"/></svg>
            <h3>A baked bean dish.</h3><p>Sounds good.<br> Needs an oven.</p>
            <div class="dinner-method-status"><span aria-hidden="true">×</span> Doesn’t fit your kitchen</div>
          </article>
          <div class="dinner-plan-change" aria-hidden="true"><span>No oven</span><svg><use href="#i-arrow"/></svg></div>
          <article class="dinner-method-card dinner-pan-card" aria-hidden="true">
            <p class="dinner-card-kicker">WITH YOUR CONSTRAINT</p>
            <svg class="dinner-appliance dinner-skillet" viewBox="0 0 100 80" aria-hidden="true"><path d="M13 37c0 18 12 27 31 27s31-9 31-27Z"/><path d="M73 43 94 33c4-2 6 5 2 7L74 51M22 70h45M32 26c-6-6 6-7 0-14m13 14c-6-6 6-7 0-14m13 14c-6-6 6-7 0-14"/></svg>
            <h3>Make it in one pan.</h3><p>Soften the tomatoes.<br> Warm beans. Wilt spinach.</p>
            <div class="dinner-method-status"><svg aria-hidden="true"><use href="#i-check"/></svg> Hob only · about 20 minutes</div>
          </article>
        </div>
        <p class="dinner-adapt-takeaway">The ingredients stay the same. <strong>The method fits your life.</strong></p>
      </section>
      <section class="scene dinner-cook" aria-labelledby="dinner-cook-title" inert aria-hidden="true">
        <div class="scene-heading"><p class="chapter-label">04 / SOMETHING YOU CAN USE</p><h2 id="dinner-cook-title">You know what’s for dinner.</h2></div>
        <article class="dinner-recipe">
          <div class="dinner-recipe-heading"><div><p class="dinner-card-kicker">TONIGHT’S PLAN</p><h3>Tomato, spinach &amp;<br> butter-bean skillet</h3></div><span class="dinner-recipe-seal" aria-hidden="true"><svg><use href="#i-check"/></svg></span></div>
          <div class="dinner-recipe-tags"><span>2 portions</span><span>About 20 min, with prep</span><span>Hob only</span></div>
          <div class="dinner-recipe-body">
            <div class="dinner-recipe-ingredients"><h4>What you have</h4><ul><li>400 g cooked butter beans, drained</li><li>250 g tomatoes</li><li>100 g spinach</li><li>2 slices of bread</li><li>1 tbsp oil · salt &amp; pepper</li></ul></div>
            <div class="dinner-recipe-method"><h4>What to do</h4><ol><li><span>1</span><p>Chop tomatoes. Sauté in oil<br> for <strong>5 minutes.</strong></p></li><li><span>2</span><p>Add beans. Heat through<br> for <strong>6 minutes.</strong></p></li><li><span>3</span><p>Stir in spinach for <strong>2 minutes.</strong><br> Season. Serve with bread.</p></li></ol></div>
          </div>
          <div class="dinner-recipe-footer"><svg aria-hidden="true"><use href="#i-check"/></svg><span>Built around your ingredients, your time and your kitchen.</span></div>
        </article>
      </section>`,
    update({phase, moment, stage}) {
      const corrected = phase === 0 && moment >= 1;
      const beanName = stage.querySelector('.dinner-bean-name');
      const beanCheck = stage.querySelector('.dinner-bean-check');
      if (beanName) beanName.textContent = corrected ? 'Butter beans' : 'Chickpeas?';
      if (beanCheck) beanCheck.textContent = corrected ? '✓' : '?';
      const visibility = [
        ['.dinner-correction', corrected],
        ['.dinner-corrected-tag', corrected],
        ['.dinner-prompt-addition', phase === 1 && moment >= 1],
        ['.dinner-pan-card', phase === 2 && moment >= 1]
      ];
      visibility.forEach(([selector, shown]) => {
        const element = stage.querySelector(selector);
        if (element) element.setAttribute('aria-hidden', String(!shown));
      });
    }
  };
})();
