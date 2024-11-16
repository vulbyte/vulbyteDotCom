import Navbar from "@/components/navbar";

export default function Projects() {
  return (
    <div>
      <Navbar />
      <p>{`this is the projects page`}</p>
      <ul>
        <li>
          <a href="/projects/coding">art</a>
        </li>
        <li>
          <a href="/projects/coding">coding</a>
        </li>
        <li>
          <a href="/projects/music">music</a>
        </li>
        <li>
          <a href="/projects/scripts">scripts</a>
        </li>
        <li>
          <a href="/projects/scripts">videos</a>
        </li>
      </ul>
    </div>
  );
}
