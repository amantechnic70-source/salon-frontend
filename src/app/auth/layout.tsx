import type { Metadata } from "next";

export const metadata: Metadata = {

    title: "Authentication",

    description:
        "Salon Marketplace Authentication",

};


export default function AuthLayout({

    children,

}: Readonly<{

    children: React.ReactNode;

}>) {

    return (

        <main
            className="
            min-h-screen
            bg-gray-100
            dark:bg-gray-900
            transition-colors
            duration-300
            "
        >

            {children}

        </main>

    );

}