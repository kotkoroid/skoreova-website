import { browser } from "$app/environment";

let gsap: any = null;
let ScrollTrigger: any = null;

export const initGSAP = async () => {
	if (!browser || gsap) return { gsap, ScrollTrigger };

	// Dynamic imports for client-side only
	const gsapModule = await import("gsap");
	const scrollTriggerModule = await import("gsap/ScrollTrigger");

	gsap = gsapModule.gsap;
	ScrollTrigger = scrollTriggerModule.ScrollTrigger;

	// Register ScrollTrigger plugin
	gsap.registerPlugin(ScrollTrigger);

	return { gsap, ScrollTrigger };
};

// Animation presets
export const animations = {
	// Fade in from bottom
	fadeInUp: (element: string | Element, options: any = {}) => {
		if (!gsap) return;

		gsap.fromTo(
			element,
			{
				y: 60,
				opacity: 0,
			},
			{
				y: 0,
				opacity: 1,
				duration: 1,
				ease: "power2.out",
				scrollTrigger: {
					trigger: element,
					start: "top 85%",
					end: "bottom 20%",
					toggleActions: "play none none reverse",
					...options.scrollTrigger,
				},
				...options,
			},
		);
	},

	// Stagger animation for multiple elements
	staggerFadeInUp: (elements: string | NodeList, options: any = {}) => {
		if (!gsap) return;

		gsap.fromTo(
			elements,
			{
				y: 60,
				opacity: 0,
			},
			{
				y: 0,
				opacity: 1,
				duration: 0.8,
				ease: "power2.out",
				stagger: 0.2,
				scrollTrigger: {
					trigger: elements,
					start: "top 85%",
					toggleActions: "play none none reverse",
					...options.scrollTrigger,
				},
				...options,
			},
		);
	},

	// Parallax effect
	parallax: (element: string | Element, options: any = {}) => {
		if (!gsap) return;

		gsap.fromTo(
			element,
			{
				y: 0,
			},
			{
				y: options.distance || -100,
				ease: "none",
				scrollTrigger: {
					trigger: element,
					start: "top bottom",
					end: "bottom top",
					scrub: true,
					...options.scrollTrigger,
				},
			},
		);
	},

	// Scale on scroll
	scaleOnScroll: (element: string | Element, options: any = {}) => {
		if (!gsap) return;

		gsap.fromTo(
			element,
			{
				scale: 0.8,
				opacity: 0,
			},
			{
				scale: 1,
				opacity: 1,
				duration: 1.2,
				ease: "power2.out",
				scrollTrigger: {
					trigger: element,
					start: "top 80%",
					toggleActions: "play none none reverse",
					...options.scrollTrigger,
				},
				...options,
			},
		);
	},
};

// Utility to refresh ScrollTrigger (useful after dynamic content changes)
export const refreshScrollTrigger = () => {
	if (ScrollTrigger) {
		ScrollTrigger.refresh();
	}
};
