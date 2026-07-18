import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.stage}>
      <div className={styles.frame}>
        <p className={styles.eyebrow}>Portfolio in progress</p>
        <h1 className={styles.name}>Zaid Frazao</h1>
        <p className={styles.positioning}>AI-accelerated product builder</p>
      </div>
    </main>
  );
}
