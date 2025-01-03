import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

type ErrorResponse = {
    message: string;
    success: boolean;
};


const errorHandler = (error: Error | AxiosError) => {

    const axiosError = error as AxiosError;
    if (axiosError.response?.data) {
        const errorResponse = axiosError.response.data as ErrorResponse;
        toast.error(errorResponse.message); 
    } else {
        toast.error('Something went wrong. Please try again!');
    } 
};

export default errorHandler;