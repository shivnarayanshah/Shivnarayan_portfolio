import "./globals.css";
import NavigationBar from "./components/NavigationBar.jsx";
import Footer from "./components/Footer.jsx";

export const metadata = {
  title: "The_Crazy_Dev Profile",
  description: "This is the profile of Shiv narayan shah",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="">
        <NavigationBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
