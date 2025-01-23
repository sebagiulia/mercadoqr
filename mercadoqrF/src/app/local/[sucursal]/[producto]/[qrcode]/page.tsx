import styles from './qrpage.module.css';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import qrdefault from '@/public/qr-code-default.svg';
import { ErrorProvider } from 'errors/ErrorContext';
import QrService from 'services/qrService';
export default async function Page({
    params,
  }: {
    params: Promise<{ qrcode:string }>
  }) {
    const qrid = (await params).qrcode

    const response = await QrService.getQrById(qrid)
    if(!response.success || !response.data) { 
      notFound()
    } else {
      const qr = response.data
      return (
        <ErrorProvider>
    <div className={styles.page}>
      <div className={styles.thank}>Gracias por tu compra!</div>
      <div>Este es tu QR</div>
      <div className={styles.qr}>
      <Image  src={qrdefault} alt="QR"  width={250} height={250} />
      </div>
      <div>Codigo de compra: <div className={styles.buycode} >{qr.code}</div></div>
      <div className={styles.warning}>Ante cualquier problema, es recomendable guardar el codigo de compra
           para recuperar el qr desde la pagina en caso de perderlo. </div>
    </div>
    </ErrorProvider>
  );
}
}