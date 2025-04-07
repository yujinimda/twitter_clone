"use client"

import { doc, updateDoc } from "firebase/firestore";
import styles from "./Notification.module.scss";
import { useRouter } from "next/navigation";
import { db } from "@/app/firebaseApp";
import { NotificationProps } from 'pages/notifications';

export default function NotificationBox({
  notification,
}: {
  notification: NotificationProps;
}) {
  const router = useRouter();

  const onClickNotification = async (url: string) => {
    //isRead 업데이트
    const ref = doc(db, "notifications", notification.id);
    await updateDoc(ref, {
      isRead: true,
    });
    //url로 이동
    router.push(url);
  };

  return (
    <div key={notification.id} className={styles.notification}>
      <div onClick={() => onClickNotification(notification?.url)}>
        <div className={styles.notification__flex}>
          <div className={styles.notification__createdAt}>
            {notification?.createdAt}
          </div>
          {notification?.isRead === false && (
            <div className={styles.notification__unread} />
          )}
        </div>
        <div className="notification__content">{notification.content}</div>
      </div>
    </div>
  );
}