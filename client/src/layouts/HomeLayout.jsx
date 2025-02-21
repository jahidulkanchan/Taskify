import Banner from "../components/Banner";
import TaskBoard from "../components/TaskBoard";
import { useAuth } from "../hooks/useAuth";

const HomeLayout = () => {
  const {user} = useAuth()
  return (
    <>
      {user? <TaskBoard/> : <Banner/>}
    </>
  );
};

export default HomeLayout;