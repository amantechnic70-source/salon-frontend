

import QueryProvider from "../providers/QueryProvider";
import ReduxProvider from "../providers/ReduxProvider";
import { ThemeProvider } from "../providers/ThemeProvider";
import ToastProvider from "../providers/ToastProvider";
import "./globals.css";

export default function RootLayout({

    children,

}: Readonly<{

    children:
    React.ReactNode;

}>) {

    return (

        <html
            lang="en"
            suppressHydrationWarning
        >

            <body>

                <ThemeProvider>

                    <ReduxProvider>

                        <QueryProvider>

                            {children}

                            <ToastProvider />

                        </QueryProvider>

                    </ReduxProvider>

                </ThemeProvider>

            </body>

        </html>

    );

}