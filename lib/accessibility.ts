import * as React from "react";

/**
 * Hook pour gérer les raccourcis clavier globaux
 */
export function useKeyboardShortcuts(shortcuts: Record<string, () => void>) {
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignorer si l'utilisateur tape dans un input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        (event.target as HTMLElement)?.contentEditable === "true"
      ) {
        return;
      }

      const key = event.key.toLowerCase();
      const combo = [
        event.ctrlKey && "ctrl",
        event.altKey && "alt",
        event.shiftKey && "shift",
        key,
      ]
        .filter(Boolean)
        .join("+");

      if (shortcuts[key] || shortcuts[combo]) {
        event.preventDefault();
        (shortcuts[key] || shortcuts[combo])();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
}

/**
 * Hook pour gérer le focus et la navigation au clavier
 */
export function useFocusManagement() {
  const [focusedElement, setFocusedElement] =
    React.useState<HTMLElement | null>(null);

  const trapFocus = React.useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener("keydown", handleTabKey);

    return () => {
      container.removeEventListener("keydown", handleTabKey);
    };
  }, []);

  return { focusedElement, setFocusedElement, trapFocus };
}

/**
 * Utilitaires pour l'accessibilité
 */
export const accessibilityUtils = {
  // Annoncer un changement aux lecteurs d'écran
  announceToScreenReader: (
    message: string,
    priority: "polite" | "assertive" = "polite"
  ) => {
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", priority);
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Nettoyer après annonce
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },

  // Générer un ID unique pour les éléments
  generateId: (prefix: string = "element") => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  },

  // Vérifier si un élément est visible pour les technologies d'assistance
  isElementAccessible: (element: HTMLElement) => {
    const style = window.getComputedStyle(element);
    return !(
      style.display === "none" ||
      style.visibility === "hidden" ||
      style.opacity === "0" ||
      element.hasAttribute("aria-hidden")
    );
  },

  // Créer un contexte de description pour les lecteurs d'écran
  createDescriptionContext: (description: string) => {
    const id = accessibilityUtils.generateId("description");
    const descElement = document.createElement("div");
    descElement.id = id;
    descElement.className = "sr-only";
    descElement.textContent = description;
    document.body.appendChild(descElement);

    return {
      id,
      cleanup: () => {
        const elem = document.getElementById(id);
        if (elem) document.body.removeChild(elem);
      },
    };
  },
};

/**
 * Hook pour les micro-interactions avec feedback visuel
 */
export function useMicroInteractions() {
  const createRippleEffect = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      const ripple = document.createElement("span");
      ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      animation: ripple 0.6s linear;
      pointer-events: none;
    `;

      // Ajouter l'animation CSS si elle n'existe pas
      if (!document.querySelector("#ripple-styles")) {
        const style = document.createElement("style");
        style.id = "ripple-styles";
        style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `;
        document.head.appendChild(style);
      }

      button.style.position = "relative";
      button.style.overflow = "hidden";
      button.appendChild(ripple);

      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      }, 600);
    },
    []
  );

  return {
    createRippleEffect,
  };
}

/**
 * Hook pour les préférences d'accessibilité utilisateur
 */
export function useAccessibilityPreferences() {
  const [preferences, setPreferences] = React.useState({
    reducedMotion: false,
    highContrast: false,
    largeText: false,
  });

  React.useEffect(() => {
    // Détecter les préférences système
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const highContrast = window.matchMedia("(prefers-contrast: high)").matches;

    setPreferences((prev) => ({
      ...prev,
      reducedMotion,
      highContrast,
    }));

    // Écouter les changements
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const contrastQuery = window.matchMedia("(prefers-contrast: high)");

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPreferences((prev) => ({ ...prev, reducedMotion: e.matches }));
    };

    const handleContrastChange = (e: MediaQueryListEvent) => {
      setPreferences((prev) => ({ ...prev, highContrast: e.matches }));
    };

    motionQuery.addEventListener("change", handleMotionChange);
    contrastQuery.addEventListener("change", handleContrastChange);

    return () => {
      motionQuery.removeEventListener("change", handleMotionChange);
      contrastQuery.removeEventListener("change", handleContrastChange);
    };
  }, []);

  const updatePreference = React.useCallback(
    (key: keyof typeof preferences, value: boolean) => {
      setPreferences((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  return { preferences, updatePreference };
}

/**
 * Classes CSS conditionnelles basées sur l'accessibilité
 */
export function getAccessibilityClasses(
  preferences: ReturnType<typeof useAccessibilityPreferences>["preferences"]
) {
  return {
    motion: preferences.reducedMotion ? "motion-reduce" : "",
    contrast: preferences.highContrast ? "high-contrast" : "",
    text: preferences.largeText ? "text-lg" : "",
    animations: preferences.reducedMotion ? "animate-none" : "",
  };
}
