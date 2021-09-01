import { getPressReleaseContent, getPressReleaseSources, savePressReleaseText } from './query-helper';
import { generatePressReleaseXmlFile } from './xml-helper';

export async function createPressReleaseXmlFile(publicationTask) {
  const content = await getPressReleaseContent(publicationTask.graph, publicationTask.pressRelease);
  const sources = await getPressReleaseSources(publicationTask.graph, publicationTask.pressRelease);

  const htmlContent = generateHtmlContent(content, sources);
  await savePressReleaseText(publicationTask.graph, publicationTask.uri, htmlContent);

  const filePath = await generatePressReleaseXmlFile(htmlContent, content.title, publicationTask.publicationDate, content.pressReleaseUuid);

  return filePath;
}

function generateHtmlContent(content, sources) {
  let html = `<p>${content.title}</p>`;

  if (sources && sources.length) {
    html += `<p>Bron:</p>`;
    for (const source of sources) {
      html += `<p>${source.organization}</p>`;
      html += `<p>${source.fullName}, ${source.function}`;
      if (source.telephone) html += `, telefoon: <a href="${source.telephone}">${source.telephone.replace('tel:', '')}</a>`;
      if (source.mobile) html += `, GSM: <a href="${source.mobile}">${source.mobile.replace('tel:', '')}</a>`;
      if (source.email) html += `, e-mail: <a href="${source.email}">${source.email.replace('mailto:', '')}</a>`;
      html += `</p>`;
    }
  }

  html += `<p>${content.htmlText}</p>`;

  return html;
}
