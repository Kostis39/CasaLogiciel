
export default async function Admin() {
  const res = await fetch("http://localhost:5000/users", { cache: "no-store" });
  const data = await res.json();

  return (
    <main>
      <h1>Liste des utilisateurs :</h1>
      <ul>
        {data.users.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>
    </main>
    );
}
