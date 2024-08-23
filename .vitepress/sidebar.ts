import fs from "fs";

export const srcDir: string = "./docs";

const paths = (dirPath: string) => {
  return fs.readdirSync(`${srcDir}/${dirPath}`).map((fileName: string) => {
    return { text: fileName, link: `${dirPath}/${fileName}` };
  });
};

export const sidebar = [
  {
    text: "实用工具",
    collapsed: true,
    items: paths("tools"),
  },
  {
    text: "开发杂项",
    collapsed: true,
    items: paths("dev"),
  },
  {
    text: "vue",
    collapsed: true,
    items: paths("vue"),
  },
  // {
  //   text: "react",
  //   collapsed: true,
  //   items: paths("react"),
  // },
  {
    text: "android",
    collapsed: true,
    items: paths("android"),
  },
  {
    text: "angular",
    collapsed: true,
    items: paths("angular"),
  },
  {
    text: "css",
    collapsed: true,
    items: paths("css"),
  },
  {
    text: "javascript",
    collapsed: true,
    items: paths("javascript"),
  },
  {
    text: "sql",
    collapsed: true,
    items: paths("sql"),
  },
  {
    text: "root",
    collapsed: true,
    items: [
      { text: '技术导航', link: '/技术导航' },
      { text: '面试难题汇总', link: '/面试难题汇总' },
      { text: 'api-examples.md', link: '/api-examples.md' },
      { text: 'index.md', link: '/index.md' },
      { text: 'markdown-examples.md', link: '/markdown-examples.md' },
      { text: 'note.md', link: '/note.md' },
    ],
  },
];
