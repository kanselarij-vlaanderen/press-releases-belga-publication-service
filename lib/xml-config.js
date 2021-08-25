import mu from 'mu';

const xmlns_xsi = 'http://www.w3.org/2001/XLSSchema-instance';
const noNamespaceLocation = 'NewsMLv1.1.xsd';
const version = '1.1';
const VO = 'Vo';
const formalName = 'webserviceurl';
const flanders_url = 'webserviceurl.vlaanderen.be';
const belga_url = 'webserviceurl.belga.be';

const createXMLConfig = (htmlContent, sentAt, identificationDate, title) => {
  const uuid = mu.uuid();
  return [
    {
      NewsML: [
        {
          _attr: {
            'xmlns:xsi': xmlns_xsi,
            'xsi:noNamespaceSchemaLocation': noNamespaceLocation,
            Version: version,
          },
        },
        {
          NewsEnvelope: [
            {
              TransmissionID: [
                {
                  _attr: {
                    Repeat: '0',
                  },
                },
                uuid,
              ],
            },
            {
              SentFrom: [
                {
                  Party: [
                    {
                      _attr: {
                        FormalName: VO,
                      },
                    },
                    {
                      Property: [
                        {
                          _attr: {
                            FormalName: formalName,
                            Value: flanders_url,
                          },
                        },
                      ],
                    },
                    {
                      Property: [
                        {
                          _attr: {
                            FormalName: 'notify',
                            Value: flanders_url,
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              SentTo: [
                {
                  Party: [
                    {
                      _attr: {
                        FormalName: 'BELGA',
                      },
                    },
                    {
                      Property: [
                        {
                          _attr: {
                            FormalName: formalName,
                            Value: belga_url,
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            { DateAndTime: sentAt },
          ],
        },
        {
          NewsItem: [
            {
              Identification: [
                {
                  NewsIdentifier: [
                    {
                      ProviderId: 'nieuws.vlaanderen.be',
                    },
                    { DateId: identificationDate },
                    { NewsItemId: uuid },
                    {
                      RevisionId: [
                        {
                          _attr: {
                            PreviousRevision: '0',
                            Update: 'N',
                          },
                        },
                        '1',
                      ],
                    },
                    {
                      PublicIdentifier:
                        `urn:newsml:nieuws.vlaanderen.be:${identificationDate}:${uuid}:11N`,
                    },
                  ],
                },
              ],
            },
            {
              NewsManagement: [
                {
                  NewsItemType: {
                    _attr: {
                      FormalName: 'news',
                      Scheme: 'IptcNewsItemType',
                    },
                  },
                },
                {
                  FirstCreated: sentAt,
                },
                {
                  ThisRevisionCreated: sentAt,
                },
                {
                  Status: {
                    _attr: {
                      FormalName: 'Usable',
                      Scheme: 'IptcStatus',
                    },
                  },
                },
              ],
            },
            {
              NewsComponent: [
                {
                  NewsLines: [
                    {
                      HeadLine: {
                        _cdata: `${title}`,
                      },
                    },
                    {
                      SubHeadLine: [
                        {
                          DateLine: ``,
                        },
                      ],
                    },
                  ],
                },
                {
                  DescriptiveMetadata: [
                    {
                      Language: {
                        _attr: {
                          FormalName: 'nl',
                        },
                      },
                    },
                    {
                      Genre: {
                        _attr: {
                          FormalName: 'nieuws.vlaanderen.be',
                          Scheme: 'IptcGenre',
                        },
                      },
                    },
                  ],
                },
                {
                  NewsComponent: [
                    {
                      Comment: uuid,
                    },
                    {
                      Role: {
                        _attr: {
                          FormalName: 'Main',
                          Scheme: 'IptcRole',
                        },
                      },
                    },
                    {
                      ContentItem: [
                        { Comment: uuid },
                        { DataContent: {
                            _cdata: htmlContent
                          }
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ];
};

export { createXMLConfig };