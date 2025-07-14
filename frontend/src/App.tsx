function ListPage() {
  let repo_list = [ //TODO: after UI is done, get this from the server instead
    "python-example-project-1",
    "python-example-project-2",
    "python-example-project-3"
  ];

  return <ul>
    {repo_list.map(repo => 
      <li key={repo}>{repo}</li>
    )}
  </ul>
}

function ViewPage() {
  //TODO
}

export default function App() {
  return  <ListPage />
}