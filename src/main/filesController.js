var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var fs = require('fs');
var path = require('path');
// Traverse directory structure and return an array of file paths for all files
// Optionally, may provide an array of extensions to match. Only files with extensions matching those provided will be placed on the output array.
//   e.g. ['.js', '.jsx', '.ts', '.tsx']
// Returns an array of full path referenced files inside the directory
var filesController = {
    dirRecursiveContents: function (dirToParse, outArray, extFilter) {
        if (outArray === void 0) { outArray = []; }
        var allowedExtensions = null;
        fs.readdirSync(path.resolve(__dirname, dirToParse)).forEach(
        // For each file in the directory, generate an AST
        function (file) {
            var pathAndFile = path.resolve(__dirname, dirToParse, file);
            // Create allowed extensions to prevent pushing non javascript files.
            if (extFilter) {
                allowedExtensions = extFilter.reduce(function (acc, ext) {
                    var _a;
                    return __assign(__assign({}, acc), (_a = {}, _a[ext] = true, _a));
                }, {});
            }
            // If the subject file is actually a directory, then call this function recursively
            if (fs.lstatSync(pathAndFile).isDirectory()) {
                outArray.concat(filesController.dirRecursiveContents(pathAndFile, outArray, extFilter));
                // Prevent pushing files not in allowedExtensions
            }
            else if (!allowedExtensions || path.extname(pathAndFile) in allowedExtensions) {
                outArray.push(pathAndFile); // Push full path to output array
            }
        });
        return outArray;
    },
    cloneRecursive: function (dirToClone, targetDir) {
        var filesArray = filesController.dirRecursiveContents(dirToClone);
        fs.rmSync(targetDir, { force: true, recursive: true });
        if (!fs.existsSync(targetDir))
            fs.mkdirSync(targetDir); // Create targetDir if needed
        // Build out directory structure before copying files to improve efficiency
        var accumulator = { prev: '', next: '' };
        // dirs will be a list of unique directory names
        var dirs = filesArray.reduce(function (acc, curr) {
            var _a;
            var relFilePath = path.relative(dirToClone, curr); // ./frontend/myFile.js
            var targetFilePath = path.resolve(targetDir, relFilePath); // /home/nancy/cloned-project/frontend/myFile.js
            acc.next = path.dirname(targetFilePath);
            if (acc.prev !== '') {
                var prevCount = 0;
                var nextCount = 0;
                for (var i = 0; i < acc.prev.length; i++) {
                    if (acc.prev.charAt(i) === path.sep)
                        prevCount++;
                }
                for (var i = 0; i < acc.next.length; i++) {
                    if (acc.next.charAt(i) === path.sep)
                        nextCount++;
                }
                // If the directory depth of this item is two or more than the last
                if (nextCount > prevCount + 1) {
                    // Store parent directory
                    var newPath_1 = path.dirname(acc.next);
                    var pathsToAdd_3 = [];
                    do {
                        pathsToAdd_3.push(newPath_1);
                        newPath_1 = path.dirname(newPath_1);
                    } while (!fs.existsSync(newPath_1));
                    // Push all the additional paths to the object
                    for (var _i = 0, pathsToAdd_1 = pathsToAdd_3; _i < pathsToAdd_1.length; _i++) {
                        var pathToAdd = pathsToAdd_1[_i];
                        acc[pathToAdd] = 'true';
                    }
                }
            }
            acc.prev = acc.next;
            var newPath = path.dirname(acc.next);
            var pathsToAdd = [];
            do {
                pathsToAdd.push(newPath);
                newPath = path.dirname(newPath);
            } while (!fs.existsSync(newPath));
            // Push all the additional paths to the object
            for (var _b = 0, pathsToAdd_2 = pathsToAdd; _b < pathsToAdd_2.length; _b++) {
                var pathToAdd = pathsToAdd_2[_b];
                acc[pathToAdd] = 'true';
            }
            return __assign(__assign({}, acc), (_a = {}, _a[path.dirname(targetFilePath)] = 'true', _a));
        }, accumulator);
        // This approach will ensure that keys are arranged alphabetically and therefore we will be creating parent directories first as-needed
        Object.keys(dirs).forEach(function (dir) {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
        });
        filesArray.forEach(function (filePath) {
            // The following example is used to illustrate how this function works
            // e.g. if dirToClone is /home/user/project
            //   and targetDir /home/nancy/cloned-project
            //   and filePath is /home/user/project/frontend/myFile.js
            var relFilePath = path.relative(dirToClone, filePath); // ./frontend/myFile.js
            var targetFilePath = path.resolve(targetDir, relFilePath); // /home/nancy/cloned-project/frontend/myFile.js
            // Check if target directory exists, if not, create it
            // if (!fs.existsSync(path.dirname(targetFilePath))) fs.mkdirSync(path.dirname(targetFilePath))
            // Copy file to new directory
            fs.copyFile(filePath, targetFilePath, function (err) {
                if (err) {
                    console.log('source was not copied to destination: ', err);
                }
            });
        });
    }
};
// filesController.cloneRecursive('/Users/jason/Projects/Codesmith/precourse-assessment', '/Users/jason/Projects/Codesmith/test')
module.exports = filesController;
