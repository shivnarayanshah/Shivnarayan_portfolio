import "./globals.css";
import RootLayoutWrapper from "./components/RootLayoutWrapper.jsx";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "The_Crazy_Dev Profile",
  description: "This is the profile of Shiv narayan shah",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="">
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <RootLayoutWrapper>{children}</RootLayoutWrapper>
      </body>
    </html>
  );
}
