import { useTheme } from "next-themes";

const ThemeSwitch = ({ onThemeChange }) => {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    if (onThemeChange) {
      onThemeChange(newTheme);
    }

    // Add or remove 'dark' class based on the theme
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("pink");
    } else if (newTheme === "pink") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("pink");
    } else {
      document.documentElement.classList.remove("dark", "pink");
    }
  };

  return (
    <div>
      The current theme is: {theme}
      <button onClick={() => handleThemeChange("light")}>Light Mode</button>
      <button onClick={() => handleThemeChange("dark")}>Dark Mode</button>
      <button onClick={() => handleThemeChange("pink")}>Pink Mode</button>
    </div>
  );
};

export default ThemeSwitch;
