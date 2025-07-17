import projetos from "../mock/projetos.json";
import { Link } from "react-router-dom";

export default function Projetos() {
  return (
    <div>
      <h2>Projetos</h2>
      <ul>
        {projetos.map((proj) => (
          <li key={proj.id}>
            <Link to={`/projetos/${proj.id}`}>{proj.titulo}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
