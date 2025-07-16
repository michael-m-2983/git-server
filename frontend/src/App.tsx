import ListPage from "./list";
import RepoPage from "./repo";

/**
 * The app component.
 * 
 * This just handles routing.
 */
export default function App() {
  let repo_name = window.location.pathname;
  repo_name = repo_name.replace("/git/", "");
  if (repo_name == "/git") repo_name = ""; // Edge case with some servers not appending a trailing slash

  if (repo_name.length <= 1) {
    return <ListPage />
  } else {
    return <RepoPage repoName={repo_name} />
  }
}