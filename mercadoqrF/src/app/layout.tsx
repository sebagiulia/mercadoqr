import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto_Condensed } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/qrcodelogo.svg";
import styles from "./layout.module.css";
import InstagramIcon from "@/public/instagram.svg";
import WhatsappIcon from "@/public/whatsapp.svg";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto_Condensed({
  weight: '400',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "mercadoqr",
  description: "comprá ahora, retirá después",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (  
    <html lang="en" className={roboto.className} >
      <body >
        <header>
          <Link href="/" >
            <Image
              src={Logo}
              alt="MercadoQR logo"
              width={50}
              height={50}
              style={{ objectFit: "contain" }}
            />
          </Link>
        </header>
        <main className={`${roboto.className}`} >{children}</main>
        <footer>
          <div className={styles.footer_social_media}>
          <Image
              src={InstagramIcon}
              alt="Instagram logo"
              width={20}
              height={20}
            />
            <Image
              src={WhatsappIcon}
              alt="Whatsapp logo"
              width={20}
              height={20}
            />
          </div>
          <div className={`${styles.footer_options} ${roboto.className} `}>
            <Link href="/">Preguntas frecuentes</Link>
            <Link href="/">Términos y condiciones</Link>
            <Link href="/">Ingreso vendedores</Link>
            <Link href="/">Contacto</Link>
          <p>© 2021 MercadoQR</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
