import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				// Semantic tokens based on new design system
				bg: {
					primary: '#0B0E0C',
					surface: '#131815',
				},
				stroke: '#1E2420',
				accent: {
					DEFAULT: '#A7D129',
					foreground: '#0B0E0C',
					soft: 'rgba(167, 209, 41, 0.1)', // #A7D1291A
				},
				success: '#3BA55C',
				destructive: '#E03131',
				txt: {
					primary: '#F1F5F9',
					muted: '#9CA3AF',
				},
				
				// Legacy color system (keep for backward compatibility)
				border: 'var(--stroke)',
				input: 'var(--stroke)',
				ring: 'var(--accent)',
				background: 'var(--bg-primary)',
				foreground: 'var(--txt-primary)',
				primary: {
					DEFAULT: 'var(--accent)',
					foreground: 'var(--bg-primary)'
				},
				secondary: {
					DEFAULT: 'var(--bg-surface)',
					foreground: 'var(--txt-primary)'
				},
				muted: {
					DEFAULT: 'var(--bg-surface)',
					foreground: 'var(--txt-muted)'
				},
				card: {
					DEFAULT: 'var(--bg-surface)',
					foreground: 'var(--txt-primary)'
				},
				popover: {
					DEFAULT: 'var(--bg-surface)',
					foreground: 'var(--txt-primary)'
				},
				// Custom sidebar colors
				sidebar: {
					DEFAULT: 'var(--bg-surface)',
					foreground: 'var(--txt-primary)',
					primary: 'var(--accent)',
					'primary-foreground': 'var(--bg-primary)',
					accent: 'var(--accent-soft)',
					'accent-foreground': 'var(--accent)',
					border: 'var(--stroke)',
					ring: 'var(--accent)'
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				soft: '0.75rem',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse-subtle': {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.85'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0)'
					},
					'50%': {
						transform: 'translateY(-5px)'
					}
				},
				'shimmer': {
					'100%': {
						transform: 'translateX(100%)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-subtle': 'pulse-subtle 3s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite',
				'shimmer': 'shimmer 2s infinite linear'
			},
			boxShadow: {
				// New flat design shadows
				card: '0 1px 2px rgb(0 0 0 / 0.18)',
				hover: '0 2px 4px rgb(0 0 0 / 0.2)',
				// Keep legacy shadows
				'neumorphic': '8px 8px 16px #2a2e23, -8px -8px 16px #4e5642',
				'neumorphic-sm': '4px 4px 8px #2a2e23, -4px -4px 8px #4e5642',
				'neumorphic-inset': 'inset 6px 6px 12px #2a2e23, inset -6px -6px 12px #4e5642',
				'neumorphic-md': '12px 12px 24px #2a2e23, -12px -12px 24px #4e5642',
			},
			backgroundImage: {
				// Simplified gradients for flat design
				'accent-gradient': 'linear-gradient(135deg, #A7D129 0%, #96BC25 100%)',
				'surface-gradient': 'linear-gradient(145deg, #131815 0%, #0F110F 100%)',
				// Keep legacy gradients
				'neumorphic-gradient': 'linear-gradient(145deg, #e6e6e6, #ffffff)',
				'brand-gradient': 'linear-gradient(135deg, #616F39 0%, #3E432E 100%)',
				'card-gradient-light': 'linear-gradient(145deg, #FFFFFF 0%, #F8F9FA 100%)',
				'card-gradient-dark': 'linear-gradient(145deg, #1E1E1E 0%, #000000 100%)',
				'primary-button-gradient': 'linear-gradient(to right, #A7D129, #C4F24B)',
				'secondary-button-gradient': 'linear-gradient(to right, #616F39, #7A8B48)',
				'page-gradient-light': 'linear-gradient(120deg, #F8F9FA 0%, rgba(248, 249, 250, 0.8) 100%)',
				'page-gradient-dark': 'linear-gradient(120deg, rgba(0, 0, 0, 0.9) 0%, #000000 100%)'
			},
			fontFamily: {
				sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
			},
			transitionTimingFunction: {
				spring: 'cubic-bezier(0.25, 0.1, 0.25, 1.0)',
			},
			transitionDuration: {
				'150': '150ms',
				'200': '200ms',
				'300': '300ms',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
