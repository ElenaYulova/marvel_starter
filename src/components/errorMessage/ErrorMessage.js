import img from './error.gif';
import './errorMessage.scss';

const ErrorMessage = () => {
    return (
        <img className="errorMessageImg" alt='Error occured' src={img} />
    );   
}

export default ErrorMessage;