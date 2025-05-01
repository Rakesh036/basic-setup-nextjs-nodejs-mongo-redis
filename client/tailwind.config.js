// tailwind.config.js
export const content = {
    content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
    theme: {
        extend: {
            animation: {
                progress: 'shrink linear forwards',
            },
            keyframes: {
                shrink: {
                    '0%': { width: '100%' },
                    '100%': { width: '0%' },
                },
            },
        },
    },
    plugins: [],
};
