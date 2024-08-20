module.exports = {
	content: [
		"./resources/**/*.blade.php",
		"./resources/**/*.js",
		"./resources/**/*.svg",
	],
	theme: {
		extend: {
			colors: {
				"black": "#000",
				"white": "#fff",
				"active": "#0046fa",
			},
			typography: (theme) => ({
				DEFAULT: {
					css: {
						color: theme("colors.black"),
						a: {
							color: theme("colors.black"),
							"&:hover": {
								color: theme("colors.active"),
							},
						},
					},
				},
			}),
		},
	},
	plugins: [require("@tailwindcss/typography")],
	corePlugins: {
		container: false,
		float: false,
	},
};
