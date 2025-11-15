import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface AccessibilityOptions {
	highContrast: boolean;
	dyslexiaFont: boolean;
	underlineLinks: boolean;
	extraSpacing: boolean;
}

interface AccessibilityContextType extends AccessibilityOptions {
	isEnabled: boolean;
	toggle: () => void;
	enable: () => void;
	disable: () => void;
	setOption: <K extends keyof AccessibilityOptions>(key: K, value: AccessibilityOptions[K]) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
	const ctx = useContext(AccessibilityContext);
	if (!ctx) throw new Error("useAccessibility must be used within AccessibilityProvider");
	return ctx;
};

export const AccessibilityProvider = ({ children }: { children: React.ReactNode }) => {
	const [isEnabled, setIsEnabled] = useState<boolean>(() => {
		try {
			const saved = localStorage.getItem("a11y:enabled");
			return saved === "true";
		} catch {
			return false;
		}
	});

	const [options, setOptions] = useState<AccessibilityOptions>(() => {
		try {
			const raw = localStorage.getItem("a11y:opts");
			if (raw) return JSON.parse(raw) as AccessibilityOptions;
		} catch {}
		return {
			highContrast: false,
			dyslexiaFont: false,
			underlineLinks: false,
			extraSpacing: false,
		};
	});

	useEffect(() => {
		try {
			localStorage.setItem("a11y:enabled", String(isEnabled));
		} catch {}
		document.body.classList.toggle("a11y-mode", isEnabled);
	}, [isEnabled]);

	useEffect(() => {
		try {
			localStorage.setItem("a11y:opts", JSON.stringify(options));
		} catch {}
		const cls = document.body.classList;
		cls.toggle("a11y-contrast", isEnabled && options.highContrast);
		cls.toggle("a11y-dyslexia", isEnabled && options.dyslexiaFont);
		cls.toggle("a11y-underline", isEnabled && options.underlineLinks);
		cls.toggle("a11y-spacing", isEnabled && options.extraSpacing);
	}, [options, isEnabled]);

	const value = useMemo<AccessibilityContextType>(() => {
		return {
			isEnabled,
			toggle: () => setIsEnabled((v) => !v),
			enable: () => setIsEnabled(true),
			disable: () => setIsEnabled(false),
			highContrast: options.highContrast,
			dyslexiaFont: options.dyslexiaFont,
			underlineLinks: options.underlineLinks,
			extraSpacing: options.extraSpacing,
			setOption: (key, value) =>
				setOptions((prev) => ({
					...prev,
					[key]: value,
				})),
		};
	}, [isEnabled, options]);

	return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
};


