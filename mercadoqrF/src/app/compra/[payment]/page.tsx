'use client'
import { use, useEffect, useState } from "react";
import styles from "./page.module.css";
import QrService from "services/qrService";
import Qr from "@/models/qr";
import { QRCodeSVG } from "qrcode.react";

export default function Page({ params }: { params: Promise<{ payment: string }> }) {
  const { payment } = use(params); 
  const [status, setStatus] = useState<string>('pending');
  const [qrData, setQrData] = useState<Qr | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (payment === 'failure') {
        setStatus('failure');
      } else {
        try {
          const response = await QrService.getQrById(payment);
          if (response.success) {
            const qr = response.data as Qr;
            setStatus('success');
            setQrData(qr);
          } else {
            setStatus('failure');
          }
        } catch (error) {
          console.error(error);
          setStatus('failure');
        }
      }
    };

    fetchData();
  }, [params]);

  return (
    <div className={styles.page}>
      {status === 'pending' ? (
        <div className={styles.loader_overlay}>
          {/* <GridLoader color="#ffffff" size={15} /> */}
        </div>
      ) : status === 'success' ? (
        <SuccessPage qr={qrData as Qr} />
      ) : (
        <FailurePage />
      )}
    </div>
  );
}

function FailurePage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Hubo un error en la compra</h1>
      <p className={styles.msg_failure}>El pago no se pudo procesar</p>
    </div>
  )
}

function SuccessPage({qr}: {qr: Qr}) {

  return (
    <div className={styles.page}>
      <div className={styles.imgs_product_place}>
        <img className={styles.src_img_place} src={qr.place_img} alt="qr" height={200} width={200} />
        <img className={styles.src_img_place} src={qr.prod_img} alt="qr" height={200} width={200} />
      </div>
      <h1 className={styles.title}>Gracias por su compra!</h1>
      <span className={styles.msg_success}>Su compra se procesó correctamente</span>
      <p className={styles.msg_advice}>Su QR también fue enviado a los destinos indicados, porfavor asegurese de revisar la casilla de spam</p>
      <div className={styles.qr_container}>
        <QRCodeSVG value={qr.id} size={200}  />
      </div>
      <div className={styles.qr_data}>Recuerde que su QR tendrá validéz {qr.start_date !== qr.end_date && "desde " + qr.start_date} hasta {qr.end_date}</div>  
    </div>
  )
}