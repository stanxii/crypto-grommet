import App from '../../components/App';
import withData from '../../apollo/withData';
import ICOList from '../../components/coins/ICOList';

const ICOs = () => (
  <App title='initial coin offerings'>
    <ICOList />
  </App>
);

export default withData(ICOs);

