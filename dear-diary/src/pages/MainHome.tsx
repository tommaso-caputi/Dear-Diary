import { IonNav } from '@ionic/react';
import Homepage from './Homepage';

const MainHome: React.FC = () => {
  return (
    <IonNav root={() => <Homepage />}></IonNav>
  );
};

export default MainHome;