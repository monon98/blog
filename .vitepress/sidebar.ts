import fs from "fs";
import path from "node:path";

interface Item {
  text: string;
  collapsed?: boolean;
  link?: string;
  base?: string;
  items?: Array<Item>;
}

export const srcDir: string = "./src";
export const docsDir: string = "docs";

/**
 * 生成嵌套的目录数据结构
 * @param dirPath 相对docsDir的目录路径
 * @returns
 */
const mutiPaths = (dirPath: string): Array<Item> => {
  const result: Array<Item> = [];

  // 获取目录的完整路径
  const fullPath = path.join(srcDir, docsDir, dirPath);

  // 读取目录中的所有文件和文件夹
  const items = fs.readdirSync(fullPath);

  items.forEach((item: string) => {
    const itemPath = path.join(fullPath, item);
    // 处理文件名，去除扩展名
    const itemName = path.parse(item).name; // 使用 path.parse 来安全地提取文件名
    const currentItem: Item = {
      text: itemName,
    };

    // 检查是否为文件夹
    if (fs.statSync(itemPath).isDirectory()) {
      currentItem.collapsed = true;
      currentItem.items = [];
      // currentItem.base = `/${docsDir}/${dirPath}/`;

      // 如果是文件夹，递归调用 paths 函数
      currentItem.items = mutiPaths(`${dirPath}/${item}`); // 获取子文件夹内容
    } else {
      currentItem.link = `/${docsDir}/${dirPath}/${item}`;
    }
    result.push(currentItem); // 将当前项添加到结果
  });

  return result;
};

export const sidebar = {
  '/docs/interview/': [
    {
      text: "面试难题",
      collapsed: false,
      // base: "/docs/interview/",
      items: mutiPaths("interview"),
    }
  ],
  '/docs/collection/': [
    {
      text: "个人收藏",
      collapsed: true,
      // base: "/docs/collection/user/",
      items: mutiPaths("collection/user"),
    },
    {
      text: "转载收藏",
      collapsed: true,
      // base: "/docs/collection/转载收藏/",
      items: mutiPaths("collection/转载收藏"),
    },
  ],
  "/docs/": [
    {
      text: "开发杂项",
      collapsed: true,
      // base: "/docs/develop/",
      items: mutiPaths("develop"),
    },
    {
      text: "root",
      collapsed: true,
      items: [
        { text: "技术导航", link: "/docs/技术导航" },
        // { text: 'api-examples.md', link: '/api-examples.md' },
        { text: "index.md", link: "/index.md" },
        // { text: 'markdown-examples.md', link: '/markdown-examples.md' },
        { text: "note.md", link: "/docs/note.md" },
      ],
    },
  ],
};
