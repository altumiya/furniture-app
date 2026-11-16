"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const REVEAL_SELECTOR = "section, article, figure, [data-scroll-reveal]";

export default function ScrollReveal({ children }) {
  const containerRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    const container = containerRef.current;
    if (
      !container ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.dataset.scrollRevealVisible = "true";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    const observeNewElements = () => {
      container.querySelectorAll(REVEAL_SELECTOR).forEach((element, index) => {
        if (element.dataset.scrollRevealObserved === "true") return;

        element.dataset.scrollReveal = "true";
        element.dataset.scrollRevealObserved = "true";
        element.style.setProperty(
          "--scroll-reveal-delay",
          `${(index % 5) * 55}ms`
        );
        observer.observe(element);
      });
    };

    container.classList.add("scroll-reveal-ready");
    observeNewElements();

    const mutations = new MutationObserver(observeNewElements);
    mutations.observe(container, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer.disconnect();
      container.classList.remove("scroll-reveal-ready");
    };
  }, [pathname]);

  return (
    <div ref={containerRef} className="contents">
      {children}
    </div>
  );
}
