import { createXMLConfig} from './xml-config';
import xml from 'xml';
const fs = require('fs');
import moment from 'moment';

export async function generatePressReleaseXmlFile(content, title, publicationDate) {
  const sentAt = moment
  .utc()
  .utcOffset('+02:00')
  .format('YYYYMMDDTHHmmssZZ');
  const identificationDate = moment(publicationDate).format('YYYYMMDD');
  const xmlConfig = createXMLConfig(content, sentAt, identificationDate, title);

  const xmlString = xml(xmlConfig, { declaration: true, indent: true });

  const name = `${identificationDate}-${title}.xml`;
  const path = `${__dirname}/../generated-xmls/${name}`;

  console.log("file path", path);

  const output = fs.createWriteStream(path);
  output.write(xmlString);
}
