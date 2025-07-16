import { Center, Container, Loader, Space, Table, TextInput, Title } from '@mantine/core';
import { useEffect, useState } from 'react';


function useListData(): string[] | undefined {
  const URL = "/api/list.sh";

  const [list, setList] = useState<string[] | undefined>(undefined);

  useEffect(() => {
    fetch(URL)
      .then(r => r.text())
      .then(text => text.split("\n"))
      .then(list => list.filter(repo => repo.length != 0))
      .then(list => list.map(repo => repo
        .replace("/repos/", "")
        .replace(".git", "")))
      .then(setList);
  }, []);

  return list;
}

export default function ListPage() {

  let repo_list = useListData();
  const [search, setSearch] = useState<string>("");

  return <Container size="md">

    <Title order={1} className={"page-title"}>git-server</Title>

    <TextInput
      placeholder='Search'
      value={search} onChange={(e) => setSearch(e.currentTarget.value)}
    />

    <Space h="lg" />


    {repo_list ? <Table stickyHeader withTableBorder highlightOnHover striped>
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
    </Table> : <Center><Loader /></Center>}
  </Container>
}


function ListItem(props: {
  repoURL: string
}) {

  const repo = props.repoURL;

  return <Table.Tr style={{ cursor: 'pointer' }} onClick={() => window.location.href = `/git/${repo}`}>
    <Table.Td>{repo}</Table.Td>
    <Table.Td>Description will go here.</Table.Td>
  </Table.Tr>
}