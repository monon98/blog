import fs from "fs";
import path from "node:path";

interface Item {
  text: string,
  collapsed?: boolean,
  link?: string,
  items?: Array<Item>,
};

export const srcDir: string = "./docs";

// const mutiPaths = (dirPath: string) => {
//   return fs.readdirSync(`${srcDir}/${dirPath}`).map((fileName: string) => {
//     return { text: fileName, link: `${dirPath}/${fileName}` };
//   });
// };

/**
 * 生成嵌套的目录数据结构
 * @param dirPath 相对srcDir的目录路径
 * @returns
 */
const mutiPaths = (dirPath: string): Array<Item> => {
  const result: Array<Item> = [];

  // 获取目录的完整路径
  const fullPath = path.join(srcDir, dirPath);

  // 读取目录中的所有文件和文件夹
  const items = fs.readdirSync(fullPath);

  items.forEach((item: string) => {
    const itemPath = path.join(fullPath, item);
    // 处理文件名，去除扩展名
    const itemName = path.parse(item).name; // 使用 path.parse 来安全地提取文件名
    const currentItem: Item = {
      text: itemName,
      // collapsed: true,
      // items: [],
    };

    // 检查是否为文件夹
    if (fs.statSync(itemPath).isDirectory()) {
      currentItem.collapsed = true;
      currentItem.items = [];

      // 如果是文件夹，递归调用 paths 函数
      currentItem.items = mutiPaths(path.join(dirPath, item)); // 获取子文件夹内容
    } else {
      currentItem.link = `/${dirPath}/${item}`;
    }

    result.push(currentItem); // 将当前项添加到结果
  });

  return result;
};

export const sidebar = [
  {
    text: "个人收藏",
    collapsed: true,
    items: mutiPaths("user"),
  },
  {
    text: "转载收藏",
    collapsed: true,
    items: mutiPaths("转载收藏"),
  },
  {
    text: "面试难题",
    collapsed: true,
    items: mutiPaths("interview"),
  },
  // {
  //   text: "实用工具",
  //   collapsed: true,
  //   items: mutiPaths("tools"),
  // },
  {
    text: "开发杂项",
    collapsed: true,
    items: mutiPaths("dev"),
  },
  {
    text: "vue",
    collapsed: true,
    items: mutiPaths("vue"),
  },
  // {
  //   text: "react",
  //   collapsed: true,
  //   items: paths("react"),
  // },
  {
    text: "android",
    collapsed: true,
    items: mutiPaths("android"),
  },
  {
    text: "angular",
    collapsed: true,
    items: mutiPaths("angular"),
  },
  {
    text: "css",
    collapsed: true,
    items: mutiPaths("css"),
  },
  {
    text: "javascript",
    collapsed: true,
    items: mutiPaths("javascript"),
  },
  {
    text: "sql",
    collapsed: true,
    items: mutiPaths("sql"),
  },
  {
    text: "root",
    collapsed: true,
    items: [
      { text: '技术导航', link: '/技术导航' },
      // { text: 'api-examples.md', link: '/api-examples.md' },
      { text: 'index.md', link: '/index.md' },
      // { text: 'markdown-examples.md', link: '/markdown-examples.md' },
      { text: 'note.md', link: '/note.md' },
    ],
  },
];
