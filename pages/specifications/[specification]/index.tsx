import { useRouter } from 'next/router';
import { useContext } from 'react';
import { SettingsContext } from '../../../components';
import EntrystoreProvider from '../../../components/EntrystoreProvider/EntrystoreProvider';
import { SpecificationPage } from '../../../components/pages/SpecificationPage';
import { useScript } from '../../../hooks/useScript';
export default function Specification() {
  const { env } = useContext(SettingsContext);
  const { query } = useRouter() || {};
  const { specification } = query || {};
  const curi = specification;
  const entryUri = `https://dataportal.se/concepts/${curi}`;
  const postscribeStatus = useScript(
    '/postscribe.min.js',
    'sha384-1nPAWyZS0cvGLWSoWOrkTZAy8Xq8g6llEe985qo5NRPAeDi+F9h9U+0R8v56XWCM',
    'anonymous'
  );

  return postscribeStatus === 'ready' ? (
    <EntrystoreProvider
      env={env}
      entryUri={entryUri}
      entrystoreUrl={env.ENTRYSCAPE_TERMS_PATH}
      fetchMore={false}
    >
      <SpecificationPage {...(typeof curi === 'string' ? { curi } : {})} />
    </EntrystoreProvider>
  ) : (
    <></>
  );
}
