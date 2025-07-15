import { ActionIcon, Container, Group, Space, Table, Tabs, TextInput, Timeline, TimelineItem, Title } from '@mantine/core';
import { CopyIcon, FileIcon, FolderIcon, InfoIcon, TagIcon } from 'lucide-react';
import {  useState } from 'react';
import Markdown from 'react-markdown';

function ListItem(props: {
  repoURL: string
}) {

  const repo = props.repoURL;

  return <Table.Tr style={{cursor: 'pointer'}} onClick={() => window.location.href = `/git/${repo}`}>
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

  return <Container size="md">

    <Title order={1} className={"page-title"}>git-server</Title>

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
}

function ViewPage() {
  //TODO: get this from the server
  const repo_name = "git-server";
  const readme_file_contents = "# git-server \n\nA truly lightweight git server.\n\n`git-server` is a simple combination of `lighttpd` with the builtin `git http-backend` stuffed into an alpine docker base image.\n\n## Features\n\n- Easy to set up\n- Low resource requirements\n- Trying to clone or push to a nonexistant repository will create it for you\n\n## Non-features\n- There is no web UI (yet)\n- It lacks many features that other setups have. If you want more features, check out [soft-serve](https://github.com/charmbracelet/soft-serve) or [ForgeJo](https://forgejo.org/).\n- It does not have any kind of user authentication\n\n## Usage\n\n### Setup\n\nThe first thing you need to do is create a folder for all the repositories to be stored in: `mkdir repos`.\n[...]";
  const file_list = [".github/", "frontend/", ".gitignore", "cgi.sh", "docker-compose.yml", "Dockerfile", "lighttpd.conf", "README.md"];
  const remote_url = `http://localhost:3000/git/${repo_name}.git`;
  const tags = [
    {
      name: "example-tag-2",
      timestamp: new Date().toISOString()
    },
    {
      name: "example-tag-1",
      timestamp: new Date().toISOString()
    }
  ];

  const tabs = [
    {
      name: "README",
      icon: <InfoIcon />,
      content: <Markdown>
        {readme_file_contents}
      </Markdown>
    },
    {
      name: "Files",
      icon: <FolderIcon />,
      content: <Table highlightOnHover withTableBorder withRowBorders withColumnBorders>
        <Table.Tbody>
          {file_list.map(file =>
            <Table.Tr key={file} style={{ cursor: 'pointer' }}>
              <Table.Td>
                <Group>
                  {file.endsWith("/") ? <FolderIcon /> : <FileIcon />}
                  {file}
                </Group>

              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    },
    {
      name: "Tags",
      icon: <TagIcon />,
      content: <Timeline>
        {tags.map(tag => <TimelineItem title={tag.name}>
          {tag.timestamp}
        </TimelineItem>
        )}
      </Timeline>
    }
  ];

  return <Container fluid>
    <Group justify='space-between' style={{ background: "#232323" }} p="md">
      <Title order={3}>{repo_name}</Title>
      <TextInput value={remote_url} rightSection={<ActionIcon color="gray" variant='transparent'>
        <CopyIcon />
      </ActionIcon>} />
    </Group>


    <Space h="lg" />

    <Tabs orientation='vertical' defaultValue="README" variant='pills'>
      <Tabs.List>
        {tabs.map(tab =>
          <Tabs.Tab key={tab.name} value={tab.name}>
            <ActionIcon variant='transparent' color="gray">
              {tab.icon}
            </ActionIcon>
          </Tabs.Tab>
        )}
      </Tabs.List>

      {tabs.map(tab =>
        <Tabs.Panel value={tab.name} key={tab.name}>
          <Container size="sm">
            {tab.content}
          </Container>
        </Tabs.Panel>
      )}
    </Tabs>

  </Container>
}

export default function App() {
  let repo_name = window.location.pathname;
  repo_name = repo_name.replace("/git/", "");
  if(repo_name == "/git") repo_name = ""; // Edge case with some servers not appending a trailing slash

  if(repo_name.length == 0) {
    return <ListPage />
  } else {
    return <ViewPage />
  }
}