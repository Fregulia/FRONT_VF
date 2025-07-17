import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Sistema Esportivo. Todos os direitos reservados.</p>
    </footer>
  );
}
