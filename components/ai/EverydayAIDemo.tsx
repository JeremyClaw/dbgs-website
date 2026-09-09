"use client";

import { useEffect, useRef } from "react";

export function EverydayAIDemo() {
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    let observer: ResizeObserver | undefined;

    function connect() {
      observer?.disconnect();
      const content = frame?.contentDocument?.querySelector<HTMLElement>("#paperwork-demo");
      if (!content) return;

      const resize = () => {
        const height = Math.ceil(content.getBoundingClientRect().height);
        if (frame && height > 0) frame.style.height = `${height}px`;
      };

      resize();
      observer = new ResizeObserver(resize);
      observer.observe(content);
    }

    frame.addEventListener("load", connect);
    connect();

    return () => {
      frame.removeEventListener("load", connect);
      observer?.disconnect();
    };
  }, []);

  return (
    <iframe
      ref={frameRef}
      className="fluent-demo-frame"
      src="/ai-coaching-demo/index.html"
      title="Everyday AI coaching: paperwork, email and dinner examples"
      loading="lazy"
    />
  );
}
