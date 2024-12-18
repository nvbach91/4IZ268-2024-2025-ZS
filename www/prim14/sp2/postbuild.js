"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var outDir = path.resolve(__dirname, "out");
// Function to process HTML files recursively
function processHtmlFiles(dir) {
    fs.readdir(dir, { withFileTypes: true }, function (err, entries) {
        if (err) {
            console.error("Error reading directory:", err);
            return;
        }
        entries.forEach(function (entry) {
            var entryPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                processHtmlFiles(entryPath);
            }
            else if (entry.isFile() &&
                entry.name.endsWith(".html") &&
                entry.name !== "index.html") {
                var fileNameWithoutExt_1 = path.basename(entry.name, ".html");
                var newFolderPath_1 = path.join(dir, fileNameWithoutExt_1);
                fs.mkdir(newFolderPath_1, { recursive: true }, function (mkdirErr) {
                    if (mkdirErr) {
                        console.error("Error creating folder \"".concat(newFolderPath_1, "\":"), mkdirErr);
                        return;
                    }
                    var newFilePath = path.join(newFolderPath_1, "index.html");
                    fs.rename(entryPath, newFilePath, function (renameErr) {
                        if (renameErr) {
                            console.error("Error moving file \"".concat(entryPath, "\":"), renameErr);
                        }
                        else {
                            console.log("Processed \"".concat(entryPath, "\" -> \"").concat(newFilePath, "\""));
                        }
                    });
                    var txtFilePath = path.join(dir, "".concat(fileNameWithoutExt_1, ".txt"));
                    var newTxtFilePath = path.join(newFolderPath_1, "index.txt");
                    fs.access(txtFilePath, fs.constants.F_OK, function (accessErr) {
                        if (!accessErr) {
                            fs.rename(txtFilePath, newTxtFilePath, function (renameTxtErr) {
                                if (renameTxtErr) {
                                    console.error("Error moving file \"".concat(txtFilePath, "\":"), renameTxtErr);
                                }
                                else {
                                    console.log("Processed \"".concat(txtFilePath, "\" -> \"").concat(newTxtFilePath, "\""));
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
