import { useRouter } from 'next/router';
import { useContext } from 'react';
import { SettingsContext } from '../../../components';
import EntrystoreProvider from '../../../components/EntrystoreProvider/EntrystoreProvider';
import { ConceptPage } from '../../../components/pages/ConceptPage';
import { useScript } from '../../../hooks/useScript';
export default function Concept() {
  const { env } = useContext(SettingsContext);
  const { query } = useRouter() || {};
  const { concept } = query || {};
  const curi = concept;
  let entryUri = "";

  if (env.ENTRYSCAPE_TERMS_PATH.includes("sandbox"))
    entryUri = `https://www-sandbox.dataportal.se/concepts/${curi}`;
  else entryUri = `https://dataportal.se/concepts/${curi}`;
  
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
      <ConceptPage {...(typeof curi === 'string' ? { curi } : {})} />
    </EntrystoreProvider>
  ) : (
    <></>
  );
}
