import { useState } from 'react';
import { ADMIN_EMAIL, PHONE } from '../data/site.js';

const field = 'w-full min-h-12 rounded border border-plum/25 bg-white px-4 py-3 text-ink focus:border-ocean';
const label = 'block text-sm font-semibold text-ink mb-1.5';
const PRACTITIONERS = ['Michelle Barratt', 'Timothy Rach', 'Rachel Cleary', 'Eddie Mtakwa', 'Kimberly King', 'Pamela Bray Formas', 'Jennifer Cook', 'Grant Harvey'];

// Where enquiries go. The reference posted to a Base44 server function; set VITE_CONTACT_ENDPOINT
// (e.g. a Formspree/Web3Forms/serverless URL that accepts a JSON POST) to send directly.
// Without it, the form opens the visitor's email app addressed to the practice instead.
const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT;

function mailtoFor(d) {
  const lines = [
    `Name: ${d.name}`, `Email: ${d.email}`, d.phone && `Phone: ${d.phone}`,
    d.preferred_practitioner && `Preferred practitioner: ${d.preferred_practitioner}`,
    d.contact_mode && `Preferred mode of contact: ${d.contact_mode}`, d.location && `Location: ${d.location}`,
    `Marketing emails: ${d.marketing_opt_in ? 'Yes' : 'No'}`, '', d.message,
  ].filter((l) => l !== undefined && l !== false && l !== '');
  return `mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent(`Website enquiry from ${d.name}`)}&body=${encodeURIComponent(lines.join('\n'))}`;
}

export default function ContactForm() {
  const [status, setStatus] = useState('idle'); // idle | sending | sent | mailto | error

  async function onSubmit(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const data = {
      name: f.get('name'),
      email: f.get('email'),
      phone: f.get('phone') || undefined,
      preferred_practitioner: f.get('prac') || undefined,
      contact_mode: f.get('mode') || undefined,
      location: f.get('loc') || undefined,
      message: f.get('message'),
      marketing_opt_in: f.get('optin') === 'on',
    };
    if (!ENDPOINT) {
      window.location.href = mailtoFor(data);
      setStatus('mailto');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
      setStatus(res.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent' || status === 'mailto') {
    return (
      <div className="bg-lilac rounded p-6 md:p-10 text-center" role="status">
        <h3 className="text-3xl font-semibold">{status === 'sent' ? 'Thank you — your message has been sent' : 'Your email app has opened with your message'}</h3>
        <p className="mt-3">
          {status === 'sent'
            ? 'We will be in touch within 24 to 48 hours. If in crisis, please call 000.'
            : <>Please press send in your email app. If it did not open, email us at <a className="text-ocean underline underline-offset-4 font-medium" href={`mailto:${ADMIN_EMAIL}`}>{ADMIN_EMAIL}</a>. If in crisis, please call 000.</>}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="bg-lilac rounded p-6 md:p-10 grid gap-5 md:grid-cols-2">
      <p className="md:col-span-2">
        Prefer to call? Phone our administration team on{' '}
        <a className="text-ocean underline underline-offset-4 font-medium" href={PHONE.href}>{PHONE.label}</a> or complete the form below.
      </p>
      <div>
        <label className={label} htmlFor="cf-name">Name *</label>
        <input id="cf-name" name="name" required maxLength={120} autoComplete="name" className={field} />
      </div>
      <div>
        <label className={label} htmlFor="cf-email">Email *</label>
        <input id="cf-email" name="email" type="email" required maxLength={200} autoComplete="email" className={field} />
      </div>
      <div>
        <label className={label} htmlFor="cf-phone">Phone</label>
        <input id="cf-phone" name="phone" type="tel" maxLength={40} autoComplete="tel" className={field} />
      </div>
      <div>
        <label className={label} htmlFor="cf-prac">Preferred Practitioner (if applicable)</label>
        <select id="cf-prac" name="prac" className={field} defaultValue="">
          <option value="">No preference</option>
          {PRACTITIONERS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <div>
        <label className={label} htmlFor="cf-mode">Preferred mode of contact</label>
        <select id="cf-mode" name="mode" className={field} defaultValue="">
          <option value="">Select…</option>
          <option>Phone</option>
          <option>Email</option>
          <option>SMS Text</option>
        </select>
      </div>
      <div>
        <label className={label} htmlFor="cf-loc">Location</label>
        <select id="cf-loc" name="loc" className={field} defaultValue="">
          <option value="">Select…</option>
          <option>Toowong</option>
          <option>Manly-West</option>
          <option>Online Therapy / Telehealth</option>
        </select>
      </div>
      <div className="md:col-span-2">
        <label className={label} htmlFor="cf-msg">How can we help you? *</label>
        <textarea id="cf-msg" name="message" required maxLength={3000} rows={5} className={field} />
      </div>
      <label className="md:col-span-2 flex gap-3 items-start text-sm cursor-pointer">
        <input type="checkbox" name="optin" className="mt-1 h-5 w-5 accent-[#263C37]" />
        <span>I agree to receive marketing emails and newsletters from Michelle Barratt Psychology. I understand I can unsubscribe at any time via the link in each email.</span>
      </label>
      <div className="md:col-span-2 flex flex-col gap-3">
        <button type="submit" disabled={status === 'sending'} className="self-start inline-flex items-center gap-2 min-h-12 px-8 rounded bg-rose text-white text-[13px] font-semibold uppercase tracking-[0.12em] hover:bg-[#D84B83] disabled:opacity-60 transition-colors">
          {status === 'sending' ? 'Sending…' : 'Send Message'}
        </button>
        {status === 'error' && (
          <p className="text-sm text-red-700" role="alert">Something went wrong sending your message. Please try again or call 07 3185 0040.</p>
        )}
        <p className="text-sm text-ink/75">*Your personal information will be handled in the strictest confidence in accordance with the Privacy Act 1988 (Cth). You will receive a response in 24 to 48 hours. If in crisis, please call 000.</p>
      </div>
    </form>
  );
}
