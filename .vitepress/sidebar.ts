import fs from "fs";
import path from "node:path";

interface Item {
  text: string;
  collapsed?: boolean;
  link?: string;
  items?: Array<Item>;
}

/**
 * 处理文件名，去掉前面的数字前缀
 * @param name 原始文件名或目录名
 * @returns 处理后的名称
 */
const cleanName = (name: string): string => {
  return name.replace(/^\d+\.?\s*/, '');
};

/**
 * 生成嵌套的目录数据结构
 * @param dirPath 相对src/docs的目录路径
 * @returns
 */
const generateSidebar = (dirPath: string): Array<Item> => {
  const result: Array<Item> = [];
  const fullPath = path.join('./src/docs', dirPath);

  try {
    const items = fs.readdirSync(fullPath);
    items.forEach((item: string) => {
      const itemPath = path.join(fullPath, item);
      let itemName = item;
      if (!fs.statSync(itemPath).isDirectory()) {
        itemName = path.parse(item).name;
      }
      itemName = cleanName(itemName);
      const currentItem: Item = {
        text: itemName,
      };

      if (fs.statSync(itemPath).isDirectory()) {
        currentItem.collapsed = true;
        currentItem.items = generateSidebar(`${dirPath}/${item}`);
      } else {
        // 移除 .md 扩展名，确保链接能够正确跳转
        const itemWithoutExt = item.replace(/\.md$/, '');
        currentItem.link = `/docs/${dirPath}/${itemWithoutExt}`;
      }
      result.push(currentItem);
    });
  } catch (error) {
    console.warn(`Directory not found: ${fullPath}`);
  }

  return result;
};

export const sidebar = {
  '/docs/collection/': [
    {
      text: "个人收藏",
      collapsed: true,
      items: generateSidebar("collection/personal"),
    },
    {
      text: "转载收藏",
      collapsed: true,
      items: generateSidebar("collection/reposts"),
    },
  ],
  '/docs/interview/': [
    {
      text: "面试题",
      collapsed: false,
      items: generateSidebar("interview"),
    },
  ],
  '/docs/guide/': [
    {
      text: "技术导航",
      collapsed: false,
      items: generateSidebar("guide"),
    },
  ],
  '/docs/develop/': [
    {
      text: "开发笔记",
      collapsed: true,
      items: generateSidebar("develop"),
    },
  ],
};

