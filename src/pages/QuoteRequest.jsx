export default function QuoteRequest() {
  const stopSubmit = (event) => event.preventDefault();

  return (
    <section className="section-shell page-shell quote-page">
      <header className="page-heading">
        <p className="eyebrow">INTAKE TERMINAL // VISUAL DEMO ONLY</p>
        <h1>Quote Request</h1>
        <p>Tell the garage what wandered in. This stage intentionally does not submit, persist, email, or call an API.</p>
      </header>

      <form className="quote-form" onSubmit={stopSubmit}>
        <label>Name<input name="name" autoComplete="name" /></label>
        <label>Email<input name="email" type="email" autoComplete="email" /></label>
        <label>What are we fixing/building?<input name="project" /></label>
        <label>Platform / device<input name="platform" /></label>
        <label>Budget range<input name="budget" inputMode="text" /></label>
        <label>Deadline<input name="deadline" type="text" /></label>
        <label className="full-field">What happened?<textarea name="problem" rows="5" /></label>
        <label className="full-field">Desired outcome<textarea name="outcome" rows="5" /></label>
        <div className="full-field">
          <button type="submit" className="button button-primary" disabled>Demo / Not Yet Submitting</button>
          <p className="fine-print">Submission is deliberately disabled until a future Owner-approved stage.</p>
        </div>
      </form>
    </section>
  );
}
