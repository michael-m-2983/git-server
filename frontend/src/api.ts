import { useEffect, useState } from "react";

export function useListData(): string[] | undefined {
    const URL = "/git/api/list.sh";

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

export function useReadme(repoName: string) {
    const url = `/git/api/readme.sh/${repoName}`;

    const [readme, setReadme] = useState<string | undefined>(undefined);

    useEffect(() => {
        fetch(url).then(r => r.text()).then(setReadme);
    }, []);

    return readme;
}

export function useFileList(repoName: string) {
    const url = `/git/api/files.sh/${repoName}`;

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
