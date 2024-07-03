import fs from 'fs';
import path from 'path';

export const emptyDirectory = (directory: string) => {
  const refinedDirPath = path.resolve(directory);
  fs.readdir(refinedDirPath, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(directory, file), (err) => {
        if (err) throw err;
      });
    }
  });
};
