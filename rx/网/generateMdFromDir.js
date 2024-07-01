const fs = require("fs");
const path = require("path");

function generateMarkdownForDirectory(dirPath, level = 0) {
  let markdown = "";

  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      markdown += `${"  ".repeat(level)}- ${file}/\n`;
      markdown += generateMarkdownForDirectory(filePath, level + 1);
    } else {
      markdown += `${"  ".repeat(level)}- ${file}\n`;
    }
  });

  return markdown;
}

function generateMarkdownFile(dirPath, outputFilePath) {
  const markdown = generateMarkdownForDirectory(dirPath);
  fs.writeFileSync(outputFilePath, markdown, "utf8");
  console.log(`Markdown file generated at: ${outputFilePath}`);
}

// 使用示例
const directoryPath = "../网/"; // 替换为目标目录路径
const outputMarkdownFilePath = "./directory-structure.md"; // 输出的Markdown文件路径

generateMarkdownFile(directoryPath, outputMarkdownFilePath);
