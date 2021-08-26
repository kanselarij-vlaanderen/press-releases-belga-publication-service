const ftpClient = require('ftp');


const user = process.env.BELGA_FTP_USERNAME ;
const password = process.env.BELGA_FTP_PASSWORD ;
const host = process.env.BELGA_FTP_HOST ;

const belgaConfig = {
  user,
  password,
  host
};

export async function publishToBelga(filePath) {
  console.log("Publishing xml to Belga...");

  const client = new ftpClient();

  await openConnection(client);
  await moveFileToFTP(client, filePath);
  await closeConnection(client);
  console.log("Publishing xml to Belga done.");
}

function openConnection(client) {
  console.log('OPEN Belga FTP connection');
  return new Promise((resolve, reject) => {
    client.on('ready', (err) => {
      if (err) return reject(new Error(`Error opening the ftp connection.`));
      console.log('Belga FTP connection opened.');
      resolve('connection opened');
    });
    client.connect(belgaConfig);
  });
}

function closeConnection(client) {
  console.log('CLOSE Belga FTP connection');
  return new Promise((resolve, reject) => {
    client.on('end', (err) => {
      if (err) return reject(new Error(`Error closing the ftp connection`));
      console.log('Belga FTP connection closed.');
      resolve();
    });
    client.end();
  });
}

function moveFileToFTP(client, filePath) {
  console.log(`Moving file to FTP ${filePath.localPath}`);
  return new Promise((resolve, reject) => {
    client.put(filePath.localPath, filePath.name, (err) => {
      if (err) {
        return reject(new Error(`Error moving the file from directory.`));
      }
      resolve(filePath.name);
    });
  })
    .then((result) => {
      console.log(`XML has successfully been uploaded to Belga - ${result}`);
      return result;
    })
    .catch((error) => {
      console.log(`XML has not been uploaded to Belga - ${filePath.localPath}`);
      return error;
    });
}