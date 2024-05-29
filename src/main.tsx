import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {BrowserRouter} from "react-router-dom";
import {ChakraProvider} from "@chakra-ui/react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Provider} from "react-redux";
import store from "./store/store.ts";
import HowlerProvider from "./services/HowlManager.tsx";

const rootElement = document.getElementById('root');
ReactDOM.createRoot(rootElement!).render(
    <React.StrictMode>
        <ChakraProvider>
            <Provider store={store}>
                <HowlerProvider>
                    <BrowserRouter>
                        <App/>
                    </BrowserRouter>
                </HowlerProvider>
            </Provider>
        </ChakraProvider>
    </React.StrictMode>
);
