/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      sm: "480px",
      md: "712px",
      lg: "976px",
      xl: "1440px"
    },
    extend: {
      colors: {
        mainBlue: "#574AE2",
        accentBlue: "#4A45DB",
        notBlue: "#04537d",
        accentPurple: "#828BD4",
        mainGray: "#212224",
        secondaryGray: "#6A706E",
        accentGray: "#383E3C",
        group1: "#E7749A",
        group2: "#D5C6E0",
        group3: "#EF8354",
        group4: "#95D9DA",
        group5: "#FFDF64",
        group6: "#BFFFBC",
        group7: "#E0C867",
        group8: "#60B2E5",
        group9: "#EAAC8B",
        group10: "#EFABFF"
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"]
      },
      backgroundImage: {
        onboardMobile: "url('./images/logo_mobile.svg')",
        onboardDesktop: "url('./images/logo_desktop.svg')",
        authMobile: "url('./images/auth_mobile.png')",
        authDesk: "url('./images/auth_desk.png')"
      }
    },
  },
  plugins: [],
  safelist: [{ pattern: /text-.*/ }]
};
