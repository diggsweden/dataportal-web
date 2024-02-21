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
  let entryUri = '';

  if (env.ENTRYSCAPE_SPECS_PATH.includes('sandbox'))
    entryUri = `https://www-sandbox.dataportal.se/specifications/${curi}`;
  else entryUri = `https://dataportal.se/specifications/${curi}`;

  const postscribeStatus = useScript(
    '/postscribe.min.js',
    'sha384-1nPAWyZS0cvGLWSoWOrkTZAy8Xq8g6llEe985qo5NRPAeDi+F9h9U+0R8v56XWCM',
    'anonymous'
  );

  return postscribeStatus === 'ready' ? (
    <EntrystoreProvider
      env={env}
      entryUri={entryUri}
      entrystoreUrl={env.ENTRYSCAPE_SPECS_PATH}
      fetchMore={false}
    >
      <SpecificationPage {...(typeof curi === 'string' ? { curi } : {})} />
    </EntrystoreProvider>
  ) : (
    <></>
  );
}
