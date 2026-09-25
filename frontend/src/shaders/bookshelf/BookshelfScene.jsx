import { useEffect, useRef, useState } from "react";
import { createBookshelfRenderer } from "./bookshelfRenderer.js";
import "../threeui.css";

export function BookshelfScene({ className = "" }) {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  const [state, setState] = useState("ready");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return undefined;

    let disposed = false;
    let renderer;
    let resizeObserver;
    let timerId;

    // Defer initialization so initial page paint and user interaction are instant
    const initRenderer = () => {
      if (disposed) return;
      try {
        renderer = createBookshelfRenderer(host, canvas, {
          onReady: () => {
            if (!disposed) setState("ready");
          },
          onError: (message) => {
            if (!disposed) {
              setErrorMessage(message);
              setState("unavailable");
            }
          },
        });

        if (renderer?.ready) {
          void renderer.ready.catch((error) => {
            if (!disposed) {
              setErrorMessage(error instanceof Error ? error.message : "Unknown renderer error");
              setState("unavailable");
            }
          });
        }

        resizeObserver = new ResizeObserver(() => {
          if (renderer && typeof renderer.resize === 'function') {
            renderer.resize();
          }
        });
        resizeObserver.observe(host);
      } catch (error) {
        if (!disposed) {
          setErrorMessage(error instanceof Error ? error.message : "Unknown renderer error");
          setState("unavailable");
        }
      }
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(initRenderer, { timeout: 1000 });
    } else {
      timerId = setTimeout(initRenderer, 150);
    }

    return () => {
      disposed = true;
      if (timerId) clearTimeout(timerId);
      if (resizeObserver) resizeObserver.disconnect();
      if (renderer && typeof renderer.dispose === 'function') {
        renderer.dispose();
      }
    };
  }, []);

  return (
    <div
      className={`bookshelf${className ? ` ${className}` : ""}`}
      ref={hostRef}
      data-state={state}
      tabIndex={0}
    >
      <canvas
        ref={canvasRef}
        className={`bookshelf__canvas${state === "ready" ? " is-ready" : ""}`}
        aria-label="Interactive Bookshelf collection"
      />

      <div className="bookshelf__source-controls" aria-hidden="true">
        <div id="loading" hidden />
        <p id="fallback-status" />
        <section id="browse-ui" />
        <aside id="detail-panel">
          <div className="detail-controls"><p className="microcopy" /></div>
        </aside>
        <span id="selection-title" />
        <span id="selection-note" />
        <span id="counter" />
        <span id="palette-label" />
        <div id="markers" />
        <button id="previous" type="button" />
        <button id="next" type="button" />
        <button id="inspect" type="button" />
        <button id="close-detail" type="button" />
        <button id="reset-view" type="button" />
        <button id="toggle-book" type="button" />
        <button id="previous-page" type="button" />
        <button id="next-page" type="button" />
        <span id="page-label" />
        <span id="page-counter" />
        <span id="detail-eyebrow" />
        <span id="detail-title" />
        <span id="detail-deck" />
        <span id="detail-binding" />
        <span id="detail-format" />
        <span id="detail-theme" />
        <span id="detail-motif" />
        <span id="live-region" />
        <span id="pointer-label"><span id="pointer-label-index" /><span id="pointer-label-title" /></span>
      </div>

      {state === "unavailable" ? (
        <p className="bookshelf__unavailable" role="status">
          WebGL is unavailable: {errorMessage || "unsupported context"}.
        </p>
      ) : null}
    </div>
  );
}
