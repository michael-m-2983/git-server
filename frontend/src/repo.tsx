import { ActionIcon, Anchor, AppShell, Breadcrumbs, Button, Container, Group, HoverCard, Loader, Space, Table, Tabs, TextInput, Title } from '@mantine/core';
import { CopyIcon, DownloadIcon, FileIcon, FolderIcon, InfoIcon } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import copy from 'copy-to-clipboard';
import { useEffect, useState, type ImgHTMLAttributes } from 'react';
import { useFileList, useReadme } from './api';
import { modals } from '@mantine/modals';


export default function RepoPage(props: {
  repoName: string
}) {
  const repo_name = props.repoName;
  const remote_url = `http://${window.location.hostname}/git/${repo_name}.git`;


  const tabs = [
    {
      name: "README",
      icon: <InfoIcon />,
      content: <Readme repo={repo_name} />
    },
    {
      name: "Files",
      icon: <FolderIcon />,
      content: <FileBrowser repoName={repo_name} />
    }
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

function Readme(props: { repo: string }) {

  let repo_name = props.repo;

  const contents = useReadme(repo_name);

  const imageRenderer = (props: ImgHTMLAttributes<HTMLImageElement>) => {
    const baseURL = `/git/api/raw.sh/${repo_name}/`;
    const src = props.src!.startsWith('./') ? baseURL + props.src!.slice(2) : props.src;

    return <img {...props} src={src} />
  };

  return contents
    ? <Markdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{ img: imageRenderer }}>
      {contents}
    </Markdown>
    : <Loader />
}

function FileBrowser(props: {
  repoName: string
}) {

  // The list of all files in the repository
  let file_list = useFileList(props.repoName);

  // The current location that the user is browsing
  let [location, setLocation] = useState<string>("/");

  // Keep the location valid
  useEffect(() => {
    if (!location.endsWith("/")) setLocation(location + "/");
  }, [location]);

  // The list of files in the location that the user is browsing
  let local_files = [...new Set(file_list
    ?.filter(file => file.startsWith(location))
    .map(file => file.replace(location, ""))
    .map(file => file.includes("/") ? file.split("/")[0] + "/" : file))];

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

        {location != "/" && <FileBrowserItem repo={props.repoName} name=".." onClick={() => setLocation(location.split("/").slice(0, -2).join("/"))} />}

        {local_files ? local_files.map(file =>
          <FileBrowserItem name={file} location={location} repo={props.repoName} onClick={() => {
            if (file.endsWith("/")) {
              setLocation(location + file);
            } else {
              modals.open({
                title: file,
                size: "xl",
                children: <FileBrowserPreview repo={props.repoName} location={location} file={file} />
              });
            }
          }} />
        ) : <Loader />}
      </Table.Tbody>
    </Table>
  </>
}

function FileBrowserPreview(props: {
  repo: string,
  location: string,
  file: string
}) {
  let url = `/git/api/raw.sh/${props.repo}${props.location}${props.file}`;
  let fileExtension = props.file.split(".").at(-1);

  const baseProps = {
    width: "100%"
  }

  if (["png", "jpeg", "jpg", "gif", "bmp", "svg", "webp", "jfif", "pjpeg", "pjp"].includes(fileExtension!)) {
    return <img src={url} {...baseProps} />
  } else {
    return <iframe src={url} {...baseProps} />
  }
}

function FileBrowserItem(props: {
  name: string,
  location?: string,
  repo: string,
  onClick: () => void,
}) {

  let nameCell = <Table.Td style={{ cursor: 'pointer' }} onClick={props.onClick}>
    <Group>
      {props.name.endsWith("/") ? <FolderIcon /> : <FileIcon />}
      {props.name}
    </Group>
  </Table.Td>;

  return <Table.Tr>
    <HoverCard position='right'>
      <HoverCard.Target>
        {nameCell}
      </HoverCard.Target>
      <HoverCard.Dropdown>
        {props.location && <FileBrowserPreview repo={props.repo!} location={props.location} file={props.name} />}
      </HoverCard.Dropdown>
    </HoverCard>

    <Table.Td>
      {props.location && props.repo && <Group>
        <Button size="sm" onClick={() => window.location.href = `/git/api/raw.sh/${props.repo}${props.location}${props.name}`}>Raw</Button>

        {!props.name.endsWith("/") &&
          <a href={`/git/api/raw.sh/${props.repo}${props.location}${props.name}`} target='_blank' download={true}>
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
