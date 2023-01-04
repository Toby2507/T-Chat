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
        accentGray: "#383E3C"
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
};
