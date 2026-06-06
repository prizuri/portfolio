import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLang, T } from '../../contexts/LangContext';
import { useToast } from '../../contexts/ToastContext';
import { useContent } from '../../contexts/ContentContext';

export default function Contact() {
  const { lang } = useLang();
  const { about } = useContent();
  const toast = useToast();
  const [sending, setSending] = useState(false);

  const email    = about?.email    || 'prizurihartadi10@gmail.com';
  const linkedin = about?.linkedin || 'linkedin.com/in/prizurih/';

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    const data = new FormData(e.target);
    try {
      const res = await fetch('https://formspree.io/f/xvznzqdz', {
        method: 'POST', body: data, headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        toast(lang === 'id' ? 'Pesan terkirim! Terima kasih.' : 'Message sent! Thank you.');
        e.target.reset();
      } else {
        toast(lang === 'id' ? 'Gagal mengirim. Coba lagi.' : 'Failed to send. Try again.', 'error');
      }
    } catch {
      toast(lang === 'id' ? 'Gagal mengirim. Coba lagi.' : 'Failed to send. Try again.', 'error');
    }
    setSending(false);
  }

  return (
    <section id="contact" className="section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="section-title"><T en="Get In Touch" id="Hubungi Saya" /></h2>
          <p className="section-sub">
            <T en="Have a project or opportunity? Let's talk." id="Punya proyek atau peluang? Mari berdiskusi." />
          </p>
        </motion.div>

        <motion.div
          className="contact-grid"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{ maxWidth: 900, margin: '0 auto' }}
        >
          <div className="contact-info">
            <div className="contact-item">
              <div className="contact-icon">✉</div>
              <div>
                <div className="contact-label">Email</div>
                <div className="contact-value">{email}</div>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">in</div>
              <div>
                <div className="contact-label">LinkedIn</div>
                <div className="contact-value">{linkedin}</div>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">📍</div>
              <div>
                <div className="contact-label"><T en="Location" id="Lokasi" /></div>
                <div className="contact-value">Medan, Indonesia</div>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label><T en="Name" id="Nama" /></label>
                <input name="name" required placeholder={lang === 'id' ? 'Nama Anda' : 'Your Name'} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input name="email" type="email" required placeholder="you@example.com" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label><T en="Subject" id="Subjek" /></label>
                <input name="subject" required placeholder={lang === 'id' ? 'Subjek pesan' : 'Message subject'} />
              </div>
              <div className="form-group">
                <label><T en="Company" id="Perusahaan" /> <span style={{ color: 'var(--text-3)', fontWeight: 400 }}>(<T en="optional" id="opsional" />)</span></label>
                <input name="company" placeholder={lang === 'id' ? 'Perusahaan Anda' : 'Your company'} />
              </div>
            </div>
            <div className="form-group">
              <label><T en="Message" id="Pesan" /></label>
              <textarea name="message" required rows={5} placeholder={lang === 'id' ? 'Tulis pesan Anda...' : 'Write your message...'} />
            </div>
            <button type="submit" className="form-submit" disabled={sending}>
              {sending ? (lang === 'id' ? 'Mengirim...' : 'Sending...') : (lang === 'id' ? 'Kirim Pesan' : 'Send Message')}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
