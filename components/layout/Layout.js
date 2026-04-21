import Header from "./Header";
import themes from "./themes";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import { useState, createContext } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = createContext();

const Layout = ({ children }) => {
  const [theme, setTheme] = useState("light");

  const changeTheme = () => {
    setTheme(theme == "light" ? "dark" : "light");
  };

  return (
    <App.Provider value={{ changeTheme, theme }}>
      <ThemeProvider theme={themes[theme]}>
        <ToastContainer />
        <LayoutWrapper>
          <GlobalStyle />
          <Header />
          {children}
        </LayoutWrapper>
      </ThemeProvider>
    </App.Provider>
  );
}

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    background-color: ${(props) => props.theme.bgColor};
    background-image: ${(props) => props.theme.bgImage};
    color: ${(props) => props.theme.color};
    min-height: 100vh;
    width: 100%;
    max-width: 100vw;
  }
`;

const LayoutWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.bgColor};
  background-image: ${(props) => props.theme.bgImage};
  color: ${(props) => props.theme.color};
  box-sizing: border-box;
  overflow-x: hidden;
`;

export default Layout;
export { App };