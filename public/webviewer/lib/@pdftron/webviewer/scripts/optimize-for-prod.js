const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');
const commandLineArgs = require('command-line-args');
const { optimizeFileManagement } = require('./optimize-script-helper.js');

/* first - parse the main command */
const mainDefinitions = [
  { name: 'command', defaultOption: true }
];
const mainOptions = commandLineArgs(mainDefinitions, { stopAtFirstUnknown: true });
const argv = mainOptions._unknown || [];
/* second - parse the merge command options */
let optimizeOptions = {};
if (mainOptions.command === 'auto') {
  const mergeDefinitions = [
    { name: 'backupFiles', type: Boolean, defaultValue: false },
    { name: 'usingWebViewerServer', type: Boolean, defaultValue: false },
    { name: 'willConvertToXod', type: Boolean, defaultValue: false },
    { name: 'needClientSideOfficeSupport', type: Boolean, defaultValue: false },
    { name: 'useLegacyOffice', type: Boolean, defaultValue: false },
    { name: 'useLeanPDF', type: Boolean, defaultValue: false },
    { name: 'useFullAPI', type: Boolean, defaultValue: false },
    { name: 'useContentEdit', type: Boolean, defaultValue: false },
    { name: 'useOfficeEditor', type: Boolean, defaultValue: false },
    { name: 'salesforceSupport', type: Boolean, defaultValue: false },
    { name: 'useSourceMap', type: Boolean, defaultValue: false },
    { name: 'excludeOptimizedWorkers', type: Boolean, defaultValue: false },
    { name: 'useWebComponent', type: Boolean, defaultValue: false },
    { name: 'deleteUnused', type: Boolean, defaultValue: true },
  ];
  optimizeOptions = commandLineArgs(mergeDefinitions, { argv });
}

// eslint-disable-next-line spaced-comment
//============== Command Arg End ============

const GREEN = '\x1b[32m';
const CYAN = '\x1b[36m';
const MAGENTA = '\x1b[35m';
const RESET = '\x1b[0m';
const DIM = '\x1b[2m';
const RED = '\x1b[31m';
const BLINK = '\x1b[5m';
const UNDER = '\x1b[4m';

const resourceDir = path.resolve(__dirname, '../webviewer-salesforce/');
const globalPrompt = {
  message: "Answer must be 'y' or 'n'",
  pattern: /^[yn]$/,
  required: true,
  type: 'string',
};

(async () => {
  try {
    require.resolve('prompt');
    require.resolve('fs-extra');
    require.resolve('archiver');
  } catch (e) {
    console.log(CYAN, 'Installing required dependencies...', RESET);
    await exec('npm i prompt --save-dev && npm i fs-extra --save-dev && npm i archiver --save-dev');
  }

  const prompt = require('prompt');
  const fs = require('fs-extra');
  const archiver = require('archiver');

  let wvFolder = 'lib';
  let isNPMPackage = false;
  const packageJsonExists = await fs.pathExists(path.resolve(__dirname, '../package.json'));
  if (packageJsonExists) {
    // if this is npm package use "public" instead of "lib"
    const rawdata = fs.readFileSync(path.resolve(__dirname, '../package.json'));
    const packageJson = JSON.parse(rawdata);
    if (packageJson.name === '@pdftron/webviewer') {
      wvFolder = 'public';
      isNPMPackage = true;
    }
  }

  console.log(CYAN, `\nThis script will delete any files you won\'t be using in your ${wvFolder} folder. Please use with caution!`);
  console.log(CYAN, `\nPress CTRL + C at any time to safely cancel this process. If you are unsure of any answer, ${UNDER}please clarify${RESET}${CYAN} before answering them.`, RESET);

  prompt.start();
  prompt.message = `${MAGENTA}\nOptimize`;
  prompt.delimiter = `: ${RESET}`;

  const backupExists = await fs.pathExists(path.resolve(__dirname, `../${wvFolder}-backup`));
  if (backupExists) {
    console.log(CYAN, '\nA backup will not be created because a backup already exists!');
  }

  const schema = {
    properties: {
      backup: {
        description: `Do you want us to backup your files before optimizing? [y/n]${RESET}`,
        ...globalPrompt,
        ask: () => {
          if (optimizeOptions.hasOwnProperty('backupFiles')) {
            return false;
          }
          return !backupExists;
        },
      },
      webViewerServer: {
        description: `Will you be using WebViewer Server? See ${CYAN}https://docs.apryse.com/documentation/web/guides/wv-server/${RESET}${DIM} for more info. [y/n]${RESET}`,
        ...globalPrompt,
        ask: () => {
          return !optimizeOptions.hasOwnProperty('usingWebViewerServer');
        },
      },
      xod: {
        description: `Will you be converting all your documents to XOD? See ${CYAN}https://docs.apryse.com/documentation/web/guides/optimize-lib-folder${RESET}${DIM} for more info. [y/n]${RESET}`,
        ...globalPrompt,
        ask: () => {
          // NOTE: https://apryse.atlassian.net/browse/WVR-5344
          // We want to prompt this regardless if they are using WebViewer Server/XOD or not
          return !optimizeOptions.hasOwnProperty('willConvertToXod');
        },
      },
      office: {
        description: `Do you need client side office support (docx, pptx, xlsx)? [y/n]${RESET}`,
        ...globalPrompt,
        ask: () => {
          if (optimizeOptions.hasOwnProperty('needClientSideOfficeSupport')) {
            return false;
          }
          return prompt.history('xod') && prompt.history('xod').value === 'n' && prompt.history('webViewerServer').value === 'n';
        },
      },
      useLegacyOffice: {
        description: `Do you need client side office support for legacy office files (doc, ppt, xls)? [y/n]${RESET}`,
        ...globalPrompt,
        ask: () => prompt.history('office') && prompt.history('office').value === 'y',
      },
      useFullAPI: {
        description: `Do you need the full PDF API? See ${CYAN}https://docs.apryse.com/documentation/web/guides/optimize-lib-folder${RESET}${DIM} for more info (most users dont need this option). [y/n]${RESET}`,
        ...globalPrompt,
        ask: () => {
          // NOTE: https://apryse.atlassian.net/browse/WVR-5344
          // We want to prompt this regardless if they are using WebViewer Server/XOD or not
          return !optimizeOptions.hasOwnProperty('useFullAPI') && !optimizeOptions.hasOwnProperty('useLeanPDF');
        },
      },
      pdfnetProd: {
        description: `Do you want to use the production version of PDFNet.js? The production version does not have type checking and console messages, but is much smaller than the development version. [y/n]${RESET}`,
        ...globalPrompt,
        ask: () => prompt.history('useFullAPI') && prompt.history('useFullAPI').value === 'y',
      },
      useContentEdit: {
        description: `Do you need to use the content editing feature? (This is for editing content on the page in the viewer) [y/n]${RESET}`,
        ...globalPrompt,
        ask: () => prompt.history('xod') && prompt.history('xod').value === 'n' && prompt.history('webViewerServer').value === 'n',
      },
      useOfficeEditor: {
        description: `Do you need to use the office editing feature? (This is for editing docx files in the viewer) [y/n]${RESET}`,
        ...globalPrompt,
        ask: () => prompt.history('xod') && prompt.history('xod').value === 'n' && prompt.history('webViewerServer').value === 'n',
      },
      salesforceSupport: {
        description: `Do you need to deploy to Salesforce? See ${CYAN}https://docs.apryse.com/documentation/web/guides/optimize-lib-folder${RESET}${DIM} for more info (most users dont need this option). [y/n]${RESET}`,
        ...globalPrompt,
        ask: () => prompt.history('xod') && prompt.history('xod').value === 'n' && prompt.history('webViewerServer').value === 'n',
      },
      excludeOptimizedWorkers: {
        description: `Do you want to exclude the use of optimized worker files? If you exclude them make sure that you pass 'enableOptimizedWorkers: false' to the WebViewer constructor. [y/n]${RESET}`,
        ...globalPrompt,
        ask: () => {
          if (optimizeOptions.hasOwnProperty('excludeOptimizedWorkers')) {
            return false;
          }
          return prompt.history('salesforceSupport') && prompt.history('salesforceSupport').value === 'n';
        },
      },
      useSourceMap: {
        description: `Do you need the source map for WebViewer's UI? The source map allows you to debug WebViewer's UI on your site using unminified code. [y/n]${RESET}`,
        ...globalPrompt,
        ask: () => {
          if (optimizeOptions.hasOwnProperty('useSourceMap')) {
            return false;
          }
          return prompt.history('salesforceSupport') && prompt.history('salesforceSupport').value === 'n';
        }
      },
      useWebComponent: {
        description: `Would you like to use the web component version of WebViewer (instead of the iframe)? [y/n]${RESET}`,
        ...globalPrompt,
        ask: () => {
          if (optimizeOptions.hasOwnProperty('useWebComponent')) {
            return false;
          }
          return true;
        }
      }
    },
  };

  prompt.get(schema, (err, result) => {
    if (err) {
      console.log(`\n\n${RED}Process exited. No action will be taken.${RESET}\n`);
      return;
    }

    let {
      excludeOptimizedWorkers = 'n',
      xod = 'n',
      office = 'n',
      useLegacyOffice = 'n',
      useFullAPI = 'n',
      useLeanPDF = 'n',
      pdfnetProd = 'n',
      backup = 'n',
      salesforceSupport = 'n',
      webViewerServer = 'n',
      useContentEdit = 'n',
      useOfficeEditor = 'n',
      useSourceMap = 'n',
      useWebComponent = 'n',
    } = result;

    if (mainOptions.command === 'auto') {
      backup = optimizeOptions.backupFiles ? 'y' : 'n';
      webViewerServer = optimizeOptions.usingWebViewerServer ? 'y' : 'n';
      xod = optimizeOptions.willConvertToXod ? 'y' : 'n';
      office = optimizeOptions.needClientSideOfficeSupport ? 'y' : 'n';
      useLegacyOffice = optimizeOptions.useLegacyOffice ? 'y' : 'n';
      useFullAPI = optimizeOptions.useFullAPI ? 'y' : 'n';
      useLeanPDF = optimizeOptions.useLeanPDF ? 'y' : 'n';
      salesforceSupport = optimizeOptions.salesforceSupport ? 'y' : 'n';
      excludeOptimizedWorkers = optimizeOptions.excludeOptimizedWorkers ? 'y' : 'n';
      useContentEdit = optimizeOptions.useContentEdit ? 'y' : 'n';
      useOfficeEditor = optimizeOptions.useOfficeEditor ? 'y' : 'n';
      useSourceMap = optimizeOptions.useSourceMap ? 'y' : 'n';
      useWebComponent = optimizeOptions.useWebComponent ? 'y' : 'n';
    }

    // NOTE: useLeanPDF is a legacy option that is no longer used
    // It was named in a confusing way and was replaced with useFullAPI
    if (useLeanPDF === 'y') {
      useFullAPI = 'y';
    }

    const options = {
      excludeOptimizedWorkers,
      isNPMPackage,
      office,
      pdfnetProd,
      salesforceSupport,
      useContentEdit,
      useFullAPI,
      useLegacyOffice,
      useOfficeEditor,
      useSourceMap,
      useWebComponent,
      webViewerServer,
      xod,
    }

    const {
      filesToDelete,
      filesToDeleteAfterMoving,
      filesToDeleteAsWildcard,
      filesToRelocate,
      filesToRemoveSync,
      filesToRename,
      resourcesForZip,
    } = optimizeFileManagement(
      options,
      resourceDir,
      wvFolder,
    );

    filesToRelocate.push(
      [path.resolve(__dirname, `../${wvFolder}/core/pdf/pdfnet.res`), `${resourceDir}/resource`],
      [path.resolve(__dirname, `../${wvFolder}/core/pdf/PDFworker.js`), `${resourceDir}/resource`],
      [path.resolve(__dirname, `../${wvFolder}/core/external/`), `${resourceDir}/`, true],
      [path.resolve(__dirname, `../${wvFolder}/core/assets`), `${resourceDir}/${wvFolder}/core/`, true],
      [path.resolve(__dirname, `../${wvFolder}/core/pdf/PDFNet.js`), `${resourceDir}/${wvFolder}/core/pdf/`, true],
      [path.resolve(__dirname, `../${wvFolder}/core/webviewer-core.min.js`), `${resourceDir}/${wvFolder}/core/`, true],
      [path.resolve(__dirname, `../${wvFolder}/core/CORSWorker.js`), `${resourceDir}/${wvFolder}/core/`, true],
      [path.resolve(__dirname, `../${wvFolder}/core/DecryptWorker.js`), `${resourceDir}/${wvFolder}/core/`, true],
      [path.resolve(__dirname, `../${wvFolder}/core/Worker.js`), `${resourceDir}/${wvFolder}/core/`, true],
      [path.resolve(__dirname, `../${wvFolder}/ui`), `${resourceDir}/${wvFolder}/`, true],
    );

    // Add chunk files to filesToRelocate
    let files = fs.readdirSync(path.resolve(__dirname, `../${wvFolder}/core`));
    files = files.filter((file) => file.indexOf('.chunk.') > -1);
    files.forEach((file) => {
      filesToRelocate.push([path.resolve(__dirname, `../${wvFolder}/core/${file}`), `${resourceDir}/${wvFolder}/core/`, true]);
    });

    resourcesForZip.push(
      [`${resourceDir}/resource`],
      [`${resourceDir}/external`],
    );

    filesToRemoveSync.forEach((file) => {
      fs.removeSync(file);
    });

    filesToRename.forEach(([oldPath, newPath]) => {
      fs.renameSync(oldPath, newPath);
    });

    console.log(`\n==== ${RED}${BLINK + UNDER}FILES & FOLDERS TO DELETE${RESET} ====\n`);

    filesToDelete.forEach((f) => {
      console.log(`${RED}${f}${RESET}`);
    });

    console.log('\n===================================');

    prompt.get({
      properties: {
        delete: {
          description: `The above files will be permanently deleted. Is this okay? ${backup === 'y' ? `(A backup will be created in './${wvFolder}-backup')` : '(A backup will NOT be created)'} [y|n]${RESET}`,
          ...globalPrompt,
          ask: () => {
            if (mainOptions.command === 'auto') {
              return false;
            }
            return true;
          }
        },
      },
    }, async (err, result) => {
      if (err) {
        console.log(`\n\n${RED}Process exited. No action will be taken.${RESET}\n`);
        return;
      }
      if (mainOptions.command === 'auto') {
        result.delete = optimizeOptions.deleteUnused ? 'y' : 'n';
      }
      if (result.delete === 'y') {
        if (backup === 'y') {
          console.log(`\n${GREEN}Creating backup...${RESET}`);
          await fs.copy(
            path.resolve(__dirname, `../${wvFolder}`),
            path.resolve(__dirname, `../${wvFolder}-backup`),
          );
        }

        console.log(`\n${GREEN}Deleting files...${RESET}`);

        const promises = filesToDelete.map((file) => fs.remove(file));

        await Promise.all(promises);

        filesToDeleteAsWildcard.map(({ pattern, path }) => {
          deleteDirFilesUsingPattern(pattern, path);
        });

        if (salesforceSupport === 'y') {
          console.log(`\n${GREEN}Extracting files for salesforce build...${RESET}`);
          const relocatePromises = filesToRelocate.map(([file, dest, isCopy]) => {
            const f = path.basename(file);
            dest = path.resolve(dest, f);
            const func = (isCopy) ? fs.copy : fs.copy;
            return func(file, dest);
          });

          try {
            await Promise.all(relocatePromises);
          } catch (error) {
            console.log(error);
          }

          filesToDeleteAfterMoving.map(({ pattern, path }) => {
            deleteDirFilesUsingPattern(pattern, path);
          });

          console.log(`\n${GREEN}Compressing files...${RESET}`);

          const sfXmlContent = `<?xml version="1.0" encoding="UTF-8"?>
        <StaticResource xmlns="http://soap.sforce.com/2006/04/metadata">
            <cacheControl>Public</cacheControl>
            <contentType>application/zip</contentType>
        </StaticResource>`;

          const zipPromises = resourcesForZip.map((item) => {
            const [source, tmp = ''] = item;
            return new Promise(function (resolve, reject) {
              const output = fs.createWriteStream(`${source}.zip`);
              try {
                fs.appendFileSync(`${source}.resource-meta.xml`, sfXmlContent);
              } catch (err) {
                throw err;
              }
              const archive = archiver('zip', {
                zlib: {
                  level: 9,
                }, // Sets the compression level.
              });
              output.on('close', () => {
                const fi = path.basename(source);
                console.log(`${fi}.zip`);
                // fs.remove(source);
                resolve();
              });
              archive.on('error', reject);
              archive.pipe(output);
              archive.directory(source, tmp);
              archive.finalize();
            });
          });
          await Promise.all(zipPromises);
          console.log(`\n${GREEN}${UNDER}Done! Copy above zipped files and all ".resource-meta.xml" files into "staticresources" folder of your salesforce app.${RESET}\n`);
          return;
        }
      } else {
        console.log(`\n${RED}Process exited. No action will be taken.${RESET}\n`);
        return;
      }

      console.log(`\n${GREEN}${UNDER}Done! Your ${wvFolder} folder is now optimized for production use.${RESET}\n\n`);
    });
  });

  const deleteDirFilesUsingPattern = (pattern, dirPath) => {
    // default directory is the current directory
    // console.log(pattern, dirPath);
    // get all file names in directory
    fs.readdir(path.resolve(dirPath), (err, fileNames) => {
      if (err) {
        throw err;
      }
      // console.log(fileNames);
      // iterate through the found file names
      for (const name of fileNames) {
        // if file name matches the pattern
        if (pattern.test(name)) {
          const src = path.resolve(`${dirPath}/${name}`);
          // console.log(src);
          // try to remove the file and log the result
          fs.unlink(src, (err) => {
            if (err) {
              throw err;
            }
            console.log(`Deleted ${name}`);
          });
        }
      }
    });
  };
})();
