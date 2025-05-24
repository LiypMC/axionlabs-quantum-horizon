
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
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				quantum: {
					purple: '#8B5CF6',
					cyan: '#06B6D4',
					magenta: '#EC4899',
					emerald: '#10B981',
					amber: '#F59E0B',
					indigo: '#6366F1',
					rose: '#F43F5E',
					teal: '#14B8A6',
					blue: '#3B82F6',
					violet: '#7C3AED'
				},
				neural: {
					dark: '#0A0A0F',
					space: '#1A1A2E',
					matrix: '#16213E',
					glow: '#0F3460',
					accent: '#E94560'
				},
				// Add axion colors for backward compatibility
				axion: {
					blue: '#06B6D4',
					white: '#FFFFFF',
					gray: '#9CA3AF'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'quantum-pulse': {
					'0%, 100%': { 
						boxShadow: '0 0 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(6, 182, 212, 0.3)',
						transform: 'scale(1)'
					},
					'50%': { 
						boxShadow: '0 0 30px rgba(139, 92, 246, 0.8), 0 0 60px rgba(6, 182, 212, 0.5)',
						transform: 'scale(1.02)'
					}
				},
				'neural-flow': {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' }
				},
				'matrix-rain': {
					'0%': { transform: 'translateY(-100%)' },
					'100%': { transform: 'translateY(100vh)' }
				},
				'hologram': {
					'0%, 100%': { 
						textShadow: '0 0 10px rgba(139, 92, 246, 0.8), 0 0 20px rgba(6, 182, 212, 0.5)',
						opacity: '1'
					},
					'50%': { 
						textShadow: '0 0 20px rgba(139, 92, 246, 1), 0 0 30px rgba(6, 182, 212, 0.8)',
						opacity: '0.9'
					}
				},
				'particle-float': {
					'0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
					'33%': { transform: 'translateY(-20px) rotate(120deg)' },
					'66%': { transform: 'translateY(10px) rotate(240deg)' }
				},
				'energy-wave': {
					'0%': { transform: 'translateX(-100%) scaleY(1)' },
					'50%': { transform: 'translateX(0%) scaleY(1.2)' },
					'100%': { transform: 'translateX(100%) scaleY(1)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'quantum-pulse': 'quantum-pulse 3s infinite',
				'neural-flow': 'neural-flow 8s ease-in-out infinite',
				'matrix-rain': 'matrix-rain 3s linear infinite',
				'hologram': 'hologram 2s ease-in-out infinite',
				'particle-float': 'particle-float 6s ease-in-out infinite',
				'energy-wave': 'energy-wave 2s ease-in-out infinite'
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
				display: ['Orbitron', 'Exo 2', 'sans-serif']
			},
			backgroundImage: {
				'quantum-gradient': 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 50%, #EC4899 100%)',
				'neural-grid': `
					linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
					linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
				`,
				'energy-field': `
					radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.2) 0%, transparent 50%),
					radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.2) 0%, transparent 50%),
					radial-gradient(circle at 40% 40%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)
				`,
				'matrix-code': "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDEzOSw5MiwyNDYsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')",
				'holographic': `
					linear-gradient(45deg, transparent 30%, rgba(139, 92, 246, 0.1) 50%, transparent 70%),
					linear-gradient(-45deg, transparent 30%, rgba(6, 182, 212, 0.1) 50%, transparent 70%)
				`
			},
			backgroundSize: {
				'grid': '60px 60px',
				'energy': '400% 400%'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
