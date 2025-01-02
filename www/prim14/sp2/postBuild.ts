import * as fs from "fs";
import * as path from "path";

const outDir: string = path.resolve(__dirname, "out");

// Function to process HTML files recursively
function processHtmlFiles(dir: string): void {
  fs.readdir(dir, { withFileTypes: true }, (err, entries) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    entries.forEach((entry) => {
      const entryPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        processHtmlFiles(entryPath);
      } else if (
        entry.isFile() &&
        entry.name.endsWith(".html") &&
        entry.name !== "index.html"
      ) {
        const fileNameWithoutExt = path.basename(entry.name, ".html");
        const newFolderPath = path.join(dir, fileNameWithoutExt);

        fs.mkdir(newFolderPath, { recursive: true }, (mkdirErr) => {
          if (mkdirErr) {
            console.error(
              `Error creating folder "${newFolderPath}":`,
              mkdirErr
            );
            return;
          }

          const newFilePath = path.join(newFolderPath, "index.html");

          fs.rename(entryPath, newFilePath, (renameErr) => {
            if (renameErr) {
              console.error(`Error moving file "${entryPath}":`, renameErr);
            } else {
              console.log(`Processed "${entryPath}" -> "${newFilePath}"`);
            }
          });

          const txtFilePath = path.join(dir, `${fileNameWithoutExt}.txt`);
          const newTxtFilePath = path.join(newFolderPath, "index.txt");

          fs.access(txtFilePath, fs.constants.F_OK, (accessErr) => {
            if (!accessErr) {
              fs.rename(txtFilePath, newTxtFilePath, (renameTxtErr) => {
                if (renameTxtErr) {
                  console.error(
                    `Error moving file "${txtFilePath}":`,
                    renameTxtErr
                  );
                } else {
                  console.log(
                    `Processed "${txtFilePath}" -> "${newTxtFilePath}"`
                  );
                }
              });
            }
          });
        });
      }
    });
  });
}

processHtmlFiles(outDir);
