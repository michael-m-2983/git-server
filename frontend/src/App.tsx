import { Card, Container, CopyButton, List, Stack, Table, Title } from '@mantine/core';

function ListItem(props: {
  repoURL: string
}) {

  const repo = props.repoURL;

  return <Table.Tr>
    <Table.Td>{repo}</Table.Td>
    <Table.Td>Description will go here.</Table.Td>
  </Table.Tr>
}

function ListPage() {
  let repo_list = [ //TODO: after UI is done, get this from the server instead
    "python-example-project-1",
    "python-example-project-2",
    "python-example-project-3"
  ];

  let list = repo_list.map(repo =>
    <ListItem key={repo} repoURL={repo} />
  );

  return <>
    <Title order={1} className={"page-title"}>git-server</Title>

    <Container size="md">
      <Table stickyHeader withTableBorder highlightOnHover striped>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Description</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {list}
        </Table.Tbody>
      </Table>
    </Container>
  </>
}

function ViewPage() {
  //TODO
}

export default function App() {
  return <ListPage />
}