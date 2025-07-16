import { Center, Container, Loader, Space, Table, TextInput, Title } from '@mantine/core';
import { useState } from 'react';
import { useListData } from './api';


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
  </Table.Tr>
}