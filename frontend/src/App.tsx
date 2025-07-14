import { Container, Space, Table, TextInput, Title } from '@mantine/core';
import { useState } from 'react';

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
    "python-example-project-3",
    "git-server",
    "lua-project",
    "java-project",
    "some-other-cool-project",
    "even-cooler-project"
  ];

  const [search, setSearch] = useState<string>("");

  return <>
    <Title order={1} className={"page-title"}>git-server</Title>

    <Container size="md">

      <TextInput
        placeholder='Search'
        value={search} onChange={(e) => setSearch(e.currentTarget.value)}
      />

      <Space h="lg" />


      {/* TODO: if it becomes needed, implement pagination */}
      <Table stickyHeader withTableBorder highlightOnHover striped>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Description</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {repo_list.filter(repo => repo.toLowerCase().includes(search.toLowerCase())).map(repo =>
            <ListItem key={repo} repoURL={repo} />
          )}
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