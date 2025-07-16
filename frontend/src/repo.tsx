import { ActionIcon, AppShell, Container, Group, Loader, Tabs, TextInput, Title } from '@mantine/core';
import { CopyIcon, InfoIcon } from 'lucide-react';
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
        {readme_file_contents ? <Markdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]} components={{img: imageRenderer}}>
          {readme_file_contents}
        </Markdown> : <Loader />}</>
    }
    // {
    //   name: "Files",
    //   icon: <FolderIcon />,
    //   content: <Table highlightOnHover withTableBorder withRowBorders withColumnBorders>
    //     <Table.Tbody>
    //       {file_list.map(file =>
    //         <Table.Tr key={file} style={{ cursor: 'pointer' }}>
    //           <Table.Td>
    //             <Group>
    //               {file.endsWith("/") ? <FolderIcon /> : <FileIcon />}
    //               {file}
    //             </Group>

    //           </Table.Td>
    //         </Table.Tr>
    //       )}
    //     </Table.Tbody>
    //   </Table>
    // },
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
            <Container size="sm" p="md">
              {tab.content}
            </Container>
          </Tabs.Panel>
        )}
      </AppShell.Main>
    </AppShell>
  </Tabs>
}