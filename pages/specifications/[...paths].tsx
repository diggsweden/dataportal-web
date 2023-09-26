import { useRouter } from 'next/router';
import { useContext } from 'react';
import { EntrystoreProvider, SettingsContext } from '../../components';
import { SpecificationPage } from '../../components/pages/SpecificationPage';
import { useScript } from '../../hooks/useScript';
export default function Concept() {
  const { env } = useContext(SettingsContext);
  const { query } = useRouter() || {};
  const { paths } = query || {};
  const curi = (paths as string[])?.join('/');
  const entryUri = `https://dataportal.se/specifications/${curi}`;
  const postscribeStatus = useScript(
    '/postscribe.min.js',
    'sha384-1nPAWyZS0cvGLWSoWOrkTZAy8Xq8g6llEe985qo5NRPAeDi+F9h9U+0R8v56XWCM',
    'anonymous'
  );

  return postscribeStatus === 'ready' && curi.length > 0 ? (
    <EntrystoreProvider
      env={env}
      entryUri={entryUri}
      entrystoreUrl={env.ENTRYSCAPE_TERMS_PATH}
      fetchMore={false}
    >
      <SpecificationPage curi={curi} />
    </EntrystoreProvider>
  ) : (
    <></>
  );
}
