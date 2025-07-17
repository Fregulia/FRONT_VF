import { useParams } from "react-router-dom";
import projetos from "../mock/projetos.json";

export default function ProjetoDetalhe() {
  const { id } = useParams();
  const projeto = projetos.find((p) => p.id === parseInt(id));

  if (!projeto) return <p>Projeto não encontrado</p>;

  return (
    <div>
      <h2>{projeto.titulo}</h2>
      <p><strong>Ano:</strong> {projeto.ano}</p>
      <p><strong>Descrição:</strong> {projeto.descricao}</p>
    </div>
  );
}
