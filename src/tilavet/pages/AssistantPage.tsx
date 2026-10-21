import React, { useState, useRef, useEffect } from 'react';
import { queryAssistant, AssistantMessage, ASSISTANT_TOPICS, GUARDRAIL_DISCLAIMER } from '../core/learning/assistant';
import { useNavigate } from 'react-router-dom';

export default function AssistantPage() {
  const nav = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'init',
      sender: 'assistant',
      text: 'Esselâmü aleyküm. Tilavet, Kur’an ilimleri ve İslamî temel kavramlarda uygulama içi kaynaklara dayalı rehberlik edebilirim. Bir konu seçebilir veya sorunu kendi cümlenle yazabilirsin.',
      timestamp: new Date().toISOString(),
      disclaimer: GUARDRAIL_DISCLAIMER,
      suggestedActions: ASSISTANT_TOPICS.map(topic => ({ label: topic.label, actionType: 'query', payload: `Konu menüsü: ${topic.id}` }))
    }
  ]);
  const [input, setInput] = useState('');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (textToSend?: string) => {
    const q = (textToSend ?? input).trim();
    if (!q) return;

    const userMsg: AssistantMessage = {
      id: 'u-' + Date.now(),
      sender: 'user',
      text: q,
      timestamp: new Date().toISOString()
    };

    const reply = queryAssistant(q);
    setMessages(prev => [...prev, userMsg, reply]);
    setInput('');
  };

  return (
    <div className="tl-container">
      <header className="tl-page-header">
        <h1 className="tl-page-title">Tilavet Öğrenme Asistanı</h1>
        <p className="tl-page-desc">Tilavet ve İslamî temel konularda uygulama içi kaynaklara dayalı öğrenme rehberi.</p>
        <div className="tl-disclaimer-alert">
          <span className="tl-alert-icon">⚠</span>
          <span>{GUARDRAIL_DISCLAIMER}</span>
        </div>
      </header>

      <section className="tl-card" aria-label="Asistan konu menüsü" style={{ marginBottom: '1rem' }}>
        <h2 style={{ marginTop: 0, fontSize: '1rem' }}>Hangi konuda yardımcı olayım?</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {ASSISTANT_TOPICS.map(topic => (
            <button
              key={topic.id}
              type="button"
              className="tl-btn tl-btn-secondary"
              onClick={() => handleSend(`Konu menüsü: ${topic.id}`)}
              aria-label={`${topic.label} konu menüsünü aç`}
            >
              {topic.label}
            </button>
          ))}
        </div>
      </section>

      <div className="tl-card tl-assistant-chat">
        {/* Mesaj Gecmisi */}
        <div className="tl-assistant-chat__messages">
          {messages.map(m => (
            <div
              key={m.id}
              className="tl-assistant-chat__message"
              style={{
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                background: m.sender === 'user' ? 'var(--tl-emerald)' : 'var(--tl-bg-surface-2)',
                color: m.sender === 'user' ? '#fff' : 'var(--tl-text)',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--tl-radius)',
                border: m.sender === 'assistant' ? '1px solid var(--tl-border)' : 'none'
              }}
            >
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{m.text}</div>

              {m.references && m.references.length > 0 && (
                <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--tl-border)', fontSize: '0.8rem', color: 'var(--tl-gold)' }}>
                  <strong>Kaynaklar:</strong> {m.references.join(', ')}
                </div>
              )}

              {m.suggestedActions && (
                <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {m.suggestedActions.map((act, idx) => (
                    <button
                      key={idx}
                      className="tl-btn tl-btn-secondary"
                      style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                      onClick={() => {
                        if (act.actionType === 'navigate') nav(act.payload);
                        else handleSend(act.payload);
                      }}
                    >
                      {act.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} style={{ height: '1px' }} />
        </div>

        {/* Giris Alani */}
        <form
          onSubmit={e => { e.preventDefault(); handleSend(); }}
          className="tl-assistant-chat__composer"
        >
          <input
            type="text"
            className="tl-input tl-assistant-chat__input"
            placeholder="Tecvid kuralı, makam veya nefes egzersizi hakkında soru sorun..."
            value={input}
            maxLength={500}
            aria-label="Asistana soru yaz"
            onChange={e => setInput(e.target.value)}
          />
          <button type="submit" className="tl-btn tl-btn-primary">
            Gönder
          </button>
        </form>
      </div>
    </div>
  );
}
