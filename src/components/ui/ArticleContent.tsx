'use client';

import { useEffect } from 'react';

type Props = {
  html: string;
};

export default function ArticleContent({ html }: Props) {
  useEffect(() => {
    // ✅ 복사 버튼: data-copy-target 기반 이벤트 위임
    const onClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const btn = target?.closest?.('[data-copy-target]') as HTMLElement | null;
      if (!btn) return;

      const sel = btn.getAttribute('data-copy-target');
      if (!sel) return;

      const codeEl = document.querySelector(sel) as HTMLElement | null;
      if (!codeEl) return;

      const text = (codeEl.innerText || codeEl.textContent || '').trim();
      if (!text) return;

      const original = btn.textContent || '복사';

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
        } else {
          // fallback
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.focus();
          ta.select();
          document.execCommand('copy');
          ta.remove();
        }

        btn.textContent = '✅ 복사 완료!';
        window.setTimeout(() => (btn.textContent = original), 2000);
      } catch {
        btn.textContent = '복사 실패';
        window.setTimeout(() => (btn.textContent = original), 2000);
      }
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <div
      className="prose prose-lg max-w-none prose-slate prose-headings:font-bold prose-a:text-orange-600 hover:prose-a:text-orange-800 prose-img:rounded-xl break-words"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
