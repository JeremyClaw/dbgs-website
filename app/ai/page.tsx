import Image from "next/image";
import { EverydayAIDemo } from "@/components/ai/EverydayAIDemo";
import { FluentFitAssessment } from "@/components/survey/FluentFitAssessment";
import { fluentCopy as copy } from "@/lib/copy-fluent";

const bookingLabel = "Book a free 15-minute call";

export default function FluentPage() {
  return (
    <div className="fluent">
      <nav className="fluent-nav" aria-label="AI coaching navigation">
        <div className="fluent-shell fluent-nav-inner">
          <a className="fluent-wordmark" href="#top" aria-label="AI coaching home">
            <strong>AI, made clear</strong>
            <span>Real skills. A brighter everyday.</span>
          </a>
          <div className="fluent-nav-actions">
            <a href="#how-it-works">How it works</a>
            <a href="#coach">Your coach</a>
            <a href="#pricing">Pricing</a>
            <a href="#questions">Questions</a>
            <a className="fluent-nav-link" href="#assessment">
              {bookingLabel}
            </a>
          </div>
        </div>
      </nav>

      <main id="top">
        <header className="fluent-hero">
          <div className="fluent-shell fluent-hero-grid">
            <div className="fluent-hero-copy">
              <p className="fluent-kicker">{copy.hero.eyebrow}</p>
              <h1 className="fluent-hero-title">
                {copy.hero.headline.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h1>
              <p className="fluent-hero-body">{copy.hero.body}</p>
              <div className="fluent-hero-promises" aria-label="What to expect">
                <div>
                  <span className="fluent-promise-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <circle cx="12" cy="8" r="3" />
                      <path d="M6.5 19v-1.5a5.5 5.5 0 0 1 11 0V19" />
                    </svg>
                  </span>
                  <span>No technical<br /> experience needed</span>
                </div>
                <div>
                  <span className="fluent-promise-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M6 8h11v7a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V8Z" />
                      <path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17M9 4v2M13 4v2" />
                    </svg>
                  </span>
                  <span>Patient, friendly<br /> one-to-one coaching</span>
                </div>
                <div>
                  <span className="fluent-promise-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="m12 3 7 3v5c0 4.4-2.8 7.6-7 10-4.2-2.4-7-5.6-7-10V6l7-3Z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </span>
                  <span>Practical, real-life<br /> examples</span>
                </div>
              </div>
              <a className="fluent-button" href="#assessment">
                {bookingLabel}<span className="fluent-button-arrow" aria-hidden="true">→</span>
              </a>
              <p className="fluent-note">
                No pressure. Tell us what you would like AI to help you with.
              </p>
            </div>

            <figure className="fluent-hero-media">
              <Image
                src="/fluent/hero-guided-ai.png"
                alt="An older Cape Town couple learning to use AI together at home"
                width={1672}
                height={941}
                priority
                unoptimized
                sizes="(max-width: 760px) 100vw, 62vw"
              />
              <figcaption className="fluent-hero-callout">
                Practical help for real life.
              </figcaption>
            </figure>
          </div>
        </header>

        <section className="fluent-demo-section" id="how-it-works">
          <div className="fluent-demo-shell">
            <EverydayAIDemo />
          </div>
        </section>

        <section className="fluent-process">
          <div className="fluent-shell">
            <h2 className="fluent-section-title">Make it work for you.</h2>
            <div className="fluent-process-grid">
              <article className="fluent-process-step">
                <span className="fluent-step-number">1</span>
                <div>
                  <h3>Start with a free 15-minute call</h3>
                  <p>
                    Tell me what you already use and what you want to do with AI. I will
                    suggest the most useful place to start.
                  </p>
                </div>
              </article>
              <article className="fluent-process-step">
                <span className="fluent-step-number fluent-step-number-dark">2</span>
                <div>
                  <h3>Put it into practice in a paid 60-minute session</h3>
                  <p>
                    Bring a task that matters. We work through it together, refine the
                    result and leave you with a way to do it again.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="fluent-coach" id="coach">
          <div className="fluent-shell fluent-coach-grid">
            <Image
              className="fluent-founder-photo"
              src={copy.founder.photo}
              alt="Deej Burke"
              width={624}
              height={624}
              sizes="(max-width: 760px) 150px, 190px"
            />
            <div>
              <p className="fluent-kicker">{copy.founder.eyebrow}</p>
              <h2 className="fluent-founder-name">{copy.founder.name}</h2>
              <p className="fluent-founder-title">{copy.founder.title}</p>
              <div className="fluent-founder-copy">
                {copy.founder.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {copy.testimonials.length > 0 && (
          <section className="fluent-testimonials" aria-labelledby="testimonial-heading">
            <div className="fluent-shell">
              <div className="fluent-testimonial-heading">
                <h2 className="fluent-section-title" id="testimonial-heading">What clients say</h2>
                <p>Swipe or scroll to read more</p>
              </div>
              <div className="fluent-testimonial-grid">
                {copy.testimonials.map((testimonial) => (
                  <figure key={`${testimonial.firstName}-${testimonial.detail}`}>
                    <div className="fluent-testimonial-stars" aria-label="5 out of 5 stars">
                      <span aria-hidden="true">★★★★★</span>
                    </div>
                    <blockquote>{testimonial.quote}</blockquote>
                    <figcaption>{testimonial.firstName}, {testimonial.detail}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="fluent-pricing" id="pricing">
          <div className="fluent-shell">
            <h2 className="fluent-section-title">Choose your coaching package.</h2>
            <p className="fluent-section-intro">{copy.pricing.intro}</p>
            <div className="fluent-pricing-grid">
              {copy.pricing.tiers.map((tier) => (
                <article
                  className={`fluent-price${tier.featured ? " fluent-price-featured" : ""}`}
                  key={tier.name}
                >
                  <p className="fluent-price-name">{tier.name}</p>
                  <p className="fluent-price-amount">{tier.price} <span>total</span></p>
                  <p className="fluent-price-detail">{tier.detail}</p>
                  {tier.saving ? <p className="fluent-price-saving">{tier.saving}</p> : null}
                </article>
              ))}
            </div>
            <p className="fluent-pricing-footnote">{copy.pricing.upgrade}</p>
            <p className="fluent-pricing-risk">{copy.pricing.riskReversal}</p>
            <p className="fluent-pricing-payment"><strong>How payment works:</strong> {copy.pricing.payment}</p>
            <a className="fluent-button fluent-pricing-button" href="#assessment">
              {bookingLabel}
            </a>
          </div>
        </section>

        <section className="fluent-faq-section" id="questions">
          <div className="fluent-shell fluent-faq-shell">
            <h2 className="fluent-faq-title">A few practical questions</h2>
            <div className="fluent-faq">
              {copy.faq.items.map((item, index) => (
                <details key={item.question} open={index === 0}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="fluent-final">
          <div className="fluent-shell fluent-final-inner">
            <div>
              <h2>What would you like to do with AI?</h2>
              <p>Tell me what you have in mind. We will find a useful place to start.</p>
            </div>
            <a className="fluent-button fluent-button-light" href="#assessment">
              {bookingLabel}
            </a>
          </div>
        </section>
      </main>

      <footer className="fluent-footer">
        <div className="fluent-shell fluent-footer-inner">
          <strong>AI, made clear</strong>
          <div>
            <span>{copy.footer.legal}</span>
            <span>{copy.footer.location}</span>
          </div>
          <div>
            <a href={`mailto:${copy.footer.email}`}>{copy.footer.email}</a>
            <a href="/AI-coaching-by-deej/privacy">Privacy</a>
          </div>
          <p>{copy.footer.privacy}</p>
        </div>
      </footer>

      <section className="fluent-assessment-section" id="assessment" aria-label="AI coaching assessment">
        <a className="fluent-assessment-backdrop" href="#top" aria-label="Close assessment" />
        <div className="fluent-assessment-dialog">
          <a className="fluent-assessment-close" href="#top" aria-label="Close assessment">
            Close
          </a>
          <div className="fluent-assessment-heading">
            <p className="fluent-kicker">{copy.assessment.eyebrow}</p>
            <h2 className="fluent-section-title">{copy.assessment.headline}</h2>
            <p>{copy.assessment.body}</p>
          </div>
          <div className="fluent-assessment-mount" id="assessment-start">
            <FluentFitAssessment />
          </div>
        </div>
      </section>

      <div className="fluent-mobile-cta">
        <span>What would you like to do with AI?</span>
        <a href="#assessment">Book a free 15-min call</a>
      </div>
    </div>
  );
}
