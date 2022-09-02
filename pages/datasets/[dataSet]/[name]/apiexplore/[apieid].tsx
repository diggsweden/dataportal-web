import { DataSetExploreApiPage } from '../../../../../components/pages/DatasetExploreApiPage';
// export default DataSetExploreApiPage;
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { useScript } from '../../../../../hooks/useScript';
import { ApiIndexProvider, EntrystoreProvider, SettingsContext } from '../../../../../components';

export default function ExploreApiPage() {
  const { env } = useContext(SettingsContext);

  const { query } = useRouter() || {};
  const { dataSet, apieid } = query || {};
  const ids = (typeof dataSet === 'string' && dataSet.split('_')) || [];
  const cid = ids[0];
  const eid = ids[1];
  const postscribeStatus = useScript(
    'https://dataportal.azureedge.net/cdn/postscribe.min.js',
    'sha384-1nPAWyZS0cvGLWSoWOrkTZAy8Xq8g6llEe985qo5NRPAeDi+F9h9U+0R8v56XWCM',
    'anonymous'
  );
  return postscribeStatus === 'ready' ? (
    <ApiIndexProvider apiIndexFileUrl={env.API_DETECTION_PATH}>
      <EntrystoreProvider
        env={env}
        cid={cid}
        eid={eid}
        entrystoreUrl={env.ENTRYSCAPE_DATASETS_PATH}
        fetchMore={true}
      >
        <DataSetExploreApiPage
          dataSet={dataSet}
          apieid={apieid}
        />
      </EntrystoreProvider>
    </ApiIndexProvider>
  ) : (
    <></>
  );
}
