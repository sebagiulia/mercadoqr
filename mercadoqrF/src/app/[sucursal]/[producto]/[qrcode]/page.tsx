import QrService from '@/servicios/qrServiceJSONImp';
import styles from './qrpage.module.css';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import qrdefault from '@/public/qr-code-default.svg';
import { ErrorProvider } from 'errors/ErrorContext';
export default async function Page({
    params,
  }: {
    params: Promise<{ qrcode:string }>
  }) {
    const qrService = new QrService()
    const qrcode = (await params).qrcode
    const qr = await qrService.getQrByCode(qrcode)
    if(!qr) { notFound() }

    return (
      <ErrorProvider>
    <div className={styles.page}>
      <div className={styles.thank}>Gracias por tu compra!</div>
      <div>Este es tu QR</div>
      <div className={styles.qr}>
      <Image  src={qrdefault} alt="QR"  width={250} height={250} />
      </div>
      <div>Codigo de compra: <div className={styles.buycode} >{qrcode}</div></div>
      <div className={styles.warning}>Ante cualquier problema, es recomendable guardar el codigo de compra
           para recuperar el qr desde la pagina en caso de perderlo. </div>
    </div>
    </ErrorProvider>
  );
}