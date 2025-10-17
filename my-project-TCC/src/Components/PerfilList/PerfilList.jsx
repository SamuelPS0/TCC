export default function PerfilList({ perfis }) {
  if (!perfis || perfis.length === 0) {
    return <p className="no-profile">Nenhum perfil encontrado.</p>;
  }

  return (
    <div className="cards-container">
      {perfis.map(perfil => (
        <Card key={perfil.prestadorId} data={perfil} />
      ))}
    </div>
  );
}
