import fs from "fs";

export const srcDir: string = "./docs";

const paths = (dirPath: string) => {
  return fs.readdirSync(`${srcDir}/${dirPath}`).map((fileName: string) => {
    return { text: fileName, link: `${dirPath}/${fileName}` };
  });
};

export const sidebar = [
  {
    text: "vue",
    collapsed: true,
    items: paths("/vue"),
  },
  {
    text: "react",
    collapsed: true,
    items: paths("/react"),
  },
  {
    text: "android",
    collapsed: true,
    items: paths("/android"),
  },
  {
    text: "angular",
    collapsed: true,
    items: paths("/angular"),
  },
  {
    text: "css",
    collapsed: true,
    items: paths("/css"),
  },
  {
    text: "git",
    collapsed: true,
    items: paths("/git"),
  },
  {
    text: "javascripts",
    collapsed: true,
    items: paths("/javascripts"),
  },
  {
    text: "markdown",
    collapsed: true,
    items: paths("/markdown"),
  },
  {
    text: "mirror",
    collapsed: true,
    items: paths("/mirror"),
  },
  {
    text: "sql",
    collapsed: true,
    items: paths("/sql"),
  },
  {
    text: "root",
    collapsed: true,
    items: [
      { text: 'api-examples.md', link: '/api-examples.md' },
      { text: 'index.md', link: '/index.md' },
      { text: 'interview.md', link: '/interview.md' },
      { text: 'markdown-examples.md', link: '/markdown-examples.md' },
      { text: 'note.md', link: '/note.md' },
      { text: 'readme.md', link: '/readme.md' },
      { text: 'tools.md', link: '/tools.md' },
    ],
  },
];
