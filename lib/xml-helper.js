import { createXMLConfig } from './xml-config';
import xml from 'xml';
import fs from 'fs';
import moment from 'moment';

export async function generatePressReleaseXmlFile(content, title, publicationDate, uuid) {
  const sentAt = moment.utc().utcOffset('+02:00').format('YYYYMMDDTHHmmssZZ');
  const identificationDate = moment(publicationDate).format('YYYYMMDD');
  const xmlConfig = createXMLConfig(content, sentAt, identificationDate, title);

  const xmlString = xml(xmlConfig, { declaration: true, indent: true });

  const name = `persbericht-${moment(publicationDate).format('YYYYMMDDHHmmss')}-${uuid}.xml`;
  const path = `/share/${name}`;

  const output = fs.createWriteStream(path);
  output.write(xmlString);

  console.log(`Generated xml file ${path}`);

  return { localPath: path, name: name };

}
