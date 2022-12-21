import { FortroendeIntroPage } from '../../../components/Form/FortroendeModellen/FortroendeIntroPage';
import { getModule} from '../../../utilities';

export async function getStaticProps({ locale }: any) {
  return await getModule('fortroendemodellen', locale);
}

export default FortroendeIntroPage;
