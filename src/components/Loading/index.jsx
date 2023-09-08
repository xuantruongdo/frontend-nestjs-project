import { HashLoader } from "react-spinners";

const Loading = () => {
    return ( 
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
            <HashLoader color="#36d7b7"/>
        </div>
     );
}
 
export default Loading;