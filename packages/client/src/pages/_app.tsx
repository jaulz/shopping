import { ApolloProvider } from "@apollo/client";
import apollo from "./../apollo";
import { AppProps } from "next/app";
import "antd/dist/reset.css";
import "./../styles/globals.scss";

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ApolloProvider client={apollo}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
};

export default App;
