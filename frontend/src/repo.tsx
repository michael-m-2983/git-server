import { ActionIcon, Anchor, AppShell, Breadcrumbs, Button, Container, Group, Loader, Space, Table, Tabs, TextInput, Title } from '@mantine/core';
import { CopyIcon, DownloadIcon, FileIcon, FolderIcon, InfoIcon } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import copy from 'copy-to-clipboard';
import { useEffect, useState, type ImgHTMLAttributes } from 'react';

function useReadme(repoName: string) {
  const url = `/api/readme.sh/${repoName}`;

  const [readme, setReadme] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetch(url).then(r => r.text()).then(setReadme);
  }, []);

  return readme;
}

function useFileList(repoName: string) {
  const url = `/api/files.sh/${repoName}`;

  const [files, setFiles] = useState<string[] | undefined>(undefined);

  useEffect(() => {
    fetch(url)
      .then(r => r.text())
      .then(text => text.split("\n"))
      .then(lines => lines.filter(line => line.length != 0))
      .then(lines => lines.map(line => "/" + line)) // Append a leading slash to each item
      .then(setFiles);
  }, []);

  return files;
}

function FileBrowserItem(props: {
  name: string,
  location?: string,
  repo?: string,
  onClick: () => void,
}) {
  return <Table.Tr>
    <Table.Td style={{ cursor: 'pointer' }} onClick={props.onClick}>
      <Group>
        {props.name.endsWith("/") ? <FolderIcon /> : <FileIcon />}
        {props.name}
      </Group>
    </Table.Td>
    <Table.Td>
      {props.location && props.repo && <Group>
        <Button size="sm" onClick={() => window.location.href = `/api/raw.sh/${props.repo}${props.location}${props.name}`}>Raw</Button>

        {!props.name.endsWith("/") &&
          <a href={`/api/raw.sh/${props.repo}${props.location}${props.name}`} target='_blank' download={true}>
            <ActionIcon>
              <DownloadIcon />
            </ActionIcon>
          </a>
        }
      </Group>
      }
    </Table.Td>
  </Table.Tr>

}

function FileBrowser(props: {
  repoName: string
}) {

  // The list of all files in the repository
  let file_list = useFileList(props.repoName);


  let [location, setLocation] = useState<string>("/");

  useEffect(() => {
    if (!location.endsWith("/")) setLocation(location + "/");
  }, [location]);

  let local_files = [...new Set(file_list
    ?.filter(file => file.startsWith(location))
    .map(file => file.replace(location, ""))
    .map(file => file.includes("/") ? file.split("/")[0] + "/" : file))];

  //TODO: file viewer, download files, ../

  return <>
    <Breadcrumbs>
      <Anchor onClick={() => setLocation("/")}>{props.repoName}.git</Anchor>

      {location.substring(1).split("/").filter(s => s.length != 0).map((segment, index) => <Anchor onClick={() => {
        let reconstructedLocation = "/" + location.substring(1).split("/").slice(0, index + 1).join("/");

        setLocation(reconstructedLocation);
      }}>
        {segment}
      </Anchor>)}
    </Breadcrumbs>

    <Space h="md" />

    <Table highlightOnHover withTableBorder withRowBorders withColumnBorders>
      <Table.Tbody>

        {location != "/" && <FileBrowserItem name=".." onClick={() => setLocation(location.split("/").slice(0, -2).join("/"))} />}

        {local_files ? local_files.map(file =>
          <FileBrowserItem name={file} location={location} repo={props.repoName} onClick={() => {
            if (file.endsWith("/")) {
              setLocation(location + file);
            }
          }} />
        ) : <Loader />}
      </Table.Tbody>
    </Table>
  </>
}

export default function RepoPage(props: {
  repoName: string
}) {
  //TODO: get this from the server
  const repo_name = props.repoName;
  const readme_file_contents = useReadme(repo_name);
  // const file_list = [".github/", "frontend/", ".gitignore", "cgi.sh", "docker-compose.yml", "Dockerfile", "lighttpd.conf", "README.md"];
  const remote_url = `http://localhost:3000/git/${repo_name}.git`;
  // const tags = [
  //   {
  //     name: "example-tag-2",
  //     timestamp: new Date().toISOString()
  //   },
  //   {
  //     name: "example-tag-1",
  //     timestamp: new Date().toISOString()
  //   }
  // ];

  const imageRenderer = (props: ImgHTMLAttributes<HTMLImageElement>) => {
    const baseURL = `/api/raw.sh/${repo_name}/`;
    const src = props.src!.startsWith('./') ? baseURL + props.src!.slice(2) : props.src;

    return <img {...props} src={src} />
  };

  const tabs = [
    {
      name: "README",
      icon: <InfoIcon />,
      content: <>
        {readme_file_contents ? <Markdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]} components={{ img: imageRenderer }}>
          {readme_file_contents}
        </Markdown> : <Loader />}</>
    },
    {
      name: "Files",
      icon: <FolderIcon />,
      content: <FileBrowser repoName={repo_name} />
    }
    // {
    //   name: "Tags",
    //   icon: <TagIcon />,
    //   content: <Timeline>
    //     {tags.map(tag => <TimelineItem title={tag.name}>
    //       {tag.timestamp}
    //     </TimelineItem>
    //     )}
    //   </Timeline>
    // }
  ];

  return <Tabs orientation='vertical' defaultValue="README" variant='pills'>
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 60, breakpoint: 'lg', collapsed: { desktop: false, mobile: true } }}
      withBorder
    >
      <AppShell.Header>
        <Group justify='space-between' h={"100%"} m="0" pl="md" pr="md">
          <Title order={3} style={{ cursor: 'pointer' }} onClick={() => window.location.pathname = "/git"}>Git Server</Title>
          <Title order={3}>{repo_name}.git</Title>

          <Group>
            <TextInput value={remote_url} size='sm' />
            <ActionIcon color="gray" variant='transparent' onClick={() => copy(remote_url)} size='sm'>
              <CopyIcon />
            </ActionIcon>
          </Group>
        </Group>

      </AppShell.Header>
      <AppShell.Navbar>
        <Tabs.List>
          {tabs.map(tab =>
            <Tabs.Tab key={tab.name} value={tab.name}>
              <ActionIcon variant='transparent' color="gray">
                {tab.icon}
              </ActionIcon>
            </Tabs.Tab>
          )}
        </Tabs.List>
      </AppShell.Navbar>
      <AppShell.Main>
        {tabs.map(tab =>
          <Tabs.Panel value={tab.name} key={tab.name}>
            <Container fluid p="md">
              {tab.content}
            </Container>
          </Tabs.Panel>
        )}
      </AppShell.Main>
    </AppShell>
  </Tabs>
}