(() => {
  window.coachingExamples = window.coachingExamples || {};
  window.coachingExamples.email = {
    title: 'A tricky email.\nThe right words.',
    label: 'Write a tricky email',
    description: 'Four chapters show a third follow-up to Sam, a local builder, about a bathroom quote. Coaching adds the relationship, the goal and a Friday deadline. AI makes the wording warmer while keeping that deadline. The final email is a draft for you to review; it has not been sent.',
    chapters: ['Start', 'Ask', 'Refine', 'Ready'],
    captions: ['Bring the awkward task. You don’t need the perfect words.', 'Explain who it’s for, what you need and what must stay.', 'Change the tone. Check that the important details survive.', 'A useful draft, in your voice. You decide when it’s ready.'],
    html: `
      <section class="scene email-scene email-start" aria-labelledby="email-title-start">
        <div class="scene-heading"><p class="chapter-label">01 / THE STARTING POINT</p><h2 id="email-title-start">You know what you need to say.</h2></div>
        <div class="email-thoughts">
          <article class="email-thought email-thought-one"><span class="email-note-number">01 / THE SITUATION</span><svg class="email-note-icon" aria-hidden="true"><use href="#i-chat"/></svg><p>Third<br> follow-up.</p><span class="email-thought-small">Still waiting on the quote.</span></article>
          <article class="email-thought email-thought-two"><span class="email-note-number">02 / THE IMPORTANT BIT</span><div class="email-friday-stamp" aria-hidden="true">FRI</div><p>Need an answer<br> by Friday.</p><span class="email-thought-small">So I can plan next week.</span></article>
          <article class="email-thought email-thought-three"><span class="email-note-number">03 / THE TONE</span><span class="email-note-flourish" aria-hidden="true">Aa</span><p>Keep it<br> friendly.</p><span class="email-thought-small">Clear, without being pushy.</span></article>
        </div>
        <p class="email-context"><span class="email-avatar" aria-hidden="true">S</span><span><strong>Sam, your local builder</strong><span>Following up on a bathroom quote</span></span></p>
      </section>
      <section class="scene email-scene email-ask" aria-labelledby="email-title-ask" inert aria-hidden="true">
        <div class="scene-heading"><p class="chapter-label">02 / ASK A LITTLE BETTER</p><h2 id="email-title-ask">Give AI the missing context.</h2></div>
        <div class="email-ask-layout">
          <article class="email-prompt"><div class="email-card-label"><svg aria-hidden="true"><use href="#i-chat"/></svg> YOUR REQUEST</div><p class="email-prompt-original">Help me follow up on a quote.</p><div class="email-prompt-guidance" data-email-guidance><span class="email-small-label">WITH YOUR COACH’S GUIDANCE</span><p>Sam is a local builder. This is my third follow-up on a bathroom quote.</p><p>I need it <mark>by Friday</mark> to plan next week. Keep it friendly and clear.</p></div><div class="email-prompt-bottom"><span>Context makes the difference.</span><svg aria-hidden="true"><use href="#i-arrow"/></svg></div></article>
          <aside class="email-coach"><span class="email-small-label">THE COACHING MOMENT</span><h3>Include what<br> matters.</h3><ul><li><span>01</span> Who it’s for</li><li><span>02</span> What you need</li><li><span>03</span> What must stay</li></ul></aside>
        </div>
      </section>
      <section class="scene email-scene email-refine" aria-labelledby="email-title-refine" inert aria-hidden="true">
        <div class="scene-heading"><p class="chapter-label">03 / REFINE &amp; CHECK</p><h2 id="email-title-refine">Warmer words. The same clear ask.</h2></div>
        <div class="email-tone-request"><svg aria-hidden="true"><use href="#i-chat"/></svg><span>“Make it warmer. Keep the Friday deadline.”</span></div>
        <div class="email-compare">
          <article class="email-draft-before"><span class="email-small-label">FIRST DRAFT</span><p><span class="email-before-phrase">Please send</span> the quote <strong>by Friday.</strong></p><span class="email-before-note">Clear, but a little abrupt.</span></article>
          <span class="email-compare-arrow" aria-hidden="true"><svg><use href="#i-arrow"/></svg></span>
          <article class="email-draft-after" data-email-reveal="1" aria-hidden="true"><div class="email-after-top"><span class="email-small-label">AFTER YOUR REFINEMENT</span><span class="email-tone-chip">Warmer</span></div><p><mark>Could you send</mark> the quote <strong>by Friday?</strong> That would help me plan next week.</p><div class="email-kept-detail" data-email-reveal="2" aria-hidden="true"><svg aria-hidden="true"><use href="#i-check"/></svg><span>Clear ask. Friday deadline kept.</span></div></article>
        </div>
        <p class="email-refine-note">Your coach helps you notice what changed, and what didn’t.</p>
      </section>
      <section class="scene email-scene email-ready" aria-labelledby="email-title-ready" inert aria-hidden="true">
        <div class="scene-heading"><p class="chapter-label">04 / THE USEFUL RESULT</p><h2 id="email-title-ready">Sounds like you. Says what you need.</h2></div>
        <div class="email-ready-layout">
          <article class="email-final"><div class="email-final-meta"><div><span>To</span><strong>Sam</strong></div><span class="email-draft-badge">DRAFT</span></div><div class="email-subject"><span>Subject</span><strong>Following up on the bathroom quote</strong></div><div class="email-final-body"><p>Hi Sam,</p><p>I’m following up on the bathroom quote.</p><p>Could you send the quote <strong>by Friday?</strong> That would help me plan next week.</p><p>Thanks!</p></div><div class="email-final-footer"><span class="email-status-dot"></span> Ready for your review</div></article>
          <aside class="email-review"><div class="email-review-icon" aria-hidden="true"><svg><use href="#i-check"/></svg></div><h3>Before you send.</h3><p>Does it sound like you?<br> Is Friday still right?</p><div class="email-review-takeaway">The wording is easier.<br> <strong>The final say is yours.</strong></div></aside>
        </div>
      </section>`,
    update({ phase, moment, stage }) {
      stage.querySelectorAll('[data-email-reveal]').forEach((element) => {
        const shown = phase === 2 && moment >= Number(element.dataset.emailReveal);
        element.setAttribute('aria-hidden', String(!shown));
      });
      const guidance = stage.querySelector('[data-email-guidance]');
      if (guidance) guidance.setAttribute('aria-hidden', String(phase !== 1 || moment < 1));
    }
  };
})();
