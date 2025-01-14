import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <Dependencies />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });
  let updatedAtText = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return <div>Última atualizaçao: {updatedAtText}</div>;
}

function Dependencies() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI);
  let dependencies = "Carregando...";

  if (!isLoading && data) {
    dependencies = data.dependencies;
  }

  return (
    <div>
      DEPENDENCIES:
      <ul>
        {Object.keys(dependencies).map((item, index) => (
          <li key={index}>
            {item.toUpperCase()}
            <div>&nbsp;&nbsp;Version: {dependencies[item].version}</div>
            <div>
              &nbsp;&nbsp;Max Connections: {dependencies[item].max_connections}
            </div>
            <div>
              &nbsp;&nbsp;Opened Connections:{" "}
              {dependencies[item].opened_connections}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
